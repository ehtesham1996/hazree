import { chatPostMessage } from './chat-post-message.api';
import { markDownMessage } from '../templates';

export async function chatPostMarkdown(channelId: string, message: string): Promise<void> {
  await chatPostMessage(channelId, markDownMessage(message));
}
