import { UserCommand } from '@src/core';
import { UsersDocument } from '@src/database/models';
import { JokeService } from '@src/services';
import { chatPostMarkdown } from '../../slack/api';

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export async function joke(com: UserCommand, _user: UsersDocument): Promise<void> {
  const randomJoke = await JokeService.getRandomJoke();

  await chatPostMarkdown(com.channelId, randomJoke.setup);
  await new Promise((resolve) => {
    setTimeout(async () => {
      await chatPostMarkdown(com.channelId, randomJoke.punchline);
      resolve();
    }, 5000);
  });
}
