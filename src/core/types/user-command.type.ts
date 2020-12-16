export interface UserCommand {
  teamId: string;
  userId: string;
  channelId: string;
  command: string;
  parameters: string[];
}
