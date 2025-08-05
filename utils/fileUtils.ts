import { FileAttachment, ChatSession } from '../types';

export const fileToData = (file: File): Promise<FileAttachment> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = (reader.result as string).split(',')[1];
      resolve({ name: file.name, mimeType: file.type, data: base64data });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const supportedMimeTypes = new Set([
  // Images
  'image/png', 'image/jpeg', 'image/webp',
  // Audio
  'audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/x-aiff', 'audio/aac', 'audio/ogg', 'audio/flac',
  // Video
  'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/x-flv', 'video/mpg', 'video/webm', 'video/x-ms-wmv', 'video/3gpp',
  // Text/Docs
  'text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword',
  'application/rtf', 'text/csv', 'text/tab-separated-values', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel',
  // Code (common types)
  'text/x-c', 'text/x-c++', 'text/x-python', 'text/x-java-source', 'application/x-httpd-php', 'application/sql', 'text/html', 'text/css', 'text/javascript', 'application/json', 'text/x-typescript', 'text/markdown'
]);

export const getSupportedMimeTypes = (): string => {
  return Array.from(supportedMimeTypes).join(',');
};

export const isFileSupported = (file: File): boolean => {
  return supportedMimeTypes.has(file.type);
};

export const exportChatSession = (session: ChatSession, format: 'md' | 'json' = 'md') => {
  if (format === 'json') {
    const jsonString = JSON.stringify(session, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${session.title}.json`);
    URL.revokeObjectURL(url);
    return;
  }

  // Markdown export
  let mdContent = `# ${session.title}\n\n`;
  mdContent += `**Model:** ${session.model}\n`;
  mdContent += `**Created At:** ${new Date(session.createdAt).toLocaleString()}\n\n`;
  mdContent += '---\n\n';

  session.messages.forEach(msg => {
    mdContent += `### ${msg.role === 'user' ? '👤 User' : '🤖 Model'}\n`;
    mdContent += `*${new Date(msg.timestamp).toLocaleString()}*\n\n`;
    mdContent += `${msg.content}\n\n`;
    if (msg.attachments && msg.attachments.length > 0) {
      mdContent += `**Attachments:**\n`;
      msg.attachments.forEach(att => {
        mdContent += `- ${att.name} (${att.mimeType})\n`;
      });
      mdContent += '\n';
    }
    mdContent += '---\n\n';
  });

  const blob = new Blob([mdContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const sanitizedTitle = session.title.replace(/[/\\?%*:|"<>]/g, '-');
  triggerDownload(url, `${sanitizedTitle}.md`);
  URL.revokeObjectURL(url);
};

const triggerDownload = (url: string, filename: string) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
