import {
  teamInvalidParameters,
  teamAlreadyExists,
  teamCreateMessage,
  teamCreateFailMessage,
  teamUserAddFailMessage,
  teamUserRemoveFailMessage,
  teamUserRemoveSuccessMessage,
  teamListFailMessage,
  teamNoListMessage,
  teamListSuccessMessage,
  teamUserAddSuccessMessage
} from '@src/bot/slack/templates';
<<<<<<< HEAD
import { any } from 'superstruct';
=======
>>>>>>> 826861e7711e90863003561d020babaab8051b4e

describe('bot/slack/templates ==> Team all specification', () => {
  it('should return team invalid parameters', () => {
    const expected = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '>Incomplete team command.\n Please try command `@hazree team help`'
        }
      }
    ];
    const actual = teamInvalidParameters();
    expect(expected).toStrictEqual(actual);
  });
  it('should return team Already Exists', () => {
    const expected = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '>Team `team Exists` already exists!'
        }
      }
    ];
    const actual = teamAlreadyExists('team Exists');
    expect(expected).toStrictEqual(actual);
  });

  it('should return team Create Message', () => {
    const expected = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '>Team `team create` have been successfully created.'
        }
      }
    ];
    const actual = teamCreateMessage('team create');
    expect(expected).toStrictEqual(actual);
  });
  it('should return team Create Fail Message', () => {
    const expected = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '>Error: Cannot create team!'
        }
      }
    ];
    const actual = teamCreateFailMessage();
    expect(expected).toStrictEqual(actual);
  });
  it('should return team can not add member Message', () => {
    const expected = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '>Error: Cannot add members\n> '
        }
      }
    ];
    const actual = teamUserAddFailMessage(' ');
    expect(expected).toStrictEqual(actual);
  });
  it('should return team remove success message', () => {
    const expected = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '>Removed members ``\n\tFrom the team ``'
        }
      }
    ];
    const actual = teamUserRemoveSuccessMessage('', []);
    expect(expected).toStrictEqual(actual);
  });
  it('should return team no list message', () => {
    const expected = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '>You don\'t have any teams under you.'
        }
      }
    ];
    const actual = teamNoListMessage();
    expect(expected).toStrictEqual(actual);
  });
  it('should return team list fail message', () => {
    const expected = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '>Error: Cannot get teams list!\n\t'
        }
      }
    ];
    const actual = teamListFailMessage('');
    expect(expected).toStrictEqual(actual);
  });
  it('should return team list Success message', () => {
    const expected = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '>Your teams ``'
        }
      }
    ];
    const actual = teamListSuccessMessage([]);
    expect(expected).toStrictEqual(actual);
  });
  it('should return team user remove success message', () => {
    const expected = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '>Removed members ``\n\tFrom the team ``'
        }
      }
    ];
    const actual = teamUserRemoveSuccessMessage('', []);
    expect(expected).toStrictEqual(actual);
  });
  it('should return team user and success message', () => {
    const expected = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '>Successfully added members ``\n\tInto the team ``'

        }
      }
    ];
    const actual = teamUserAddSuccessMessage('', []);
    expect(expected).toStrictEqual(actual);
  });
  it('should return team user remove fail message', () => {
    const expected = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '>Error: Cannot remove members!\n\t'
        }
      }
    ];
    const actual = teamUserRemoveFailMessage('');
    expect(expected).toStrictEqual(actual);
  });
});
