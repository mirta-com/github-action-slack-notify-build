import { formatChannelName, buildSlackAttachments } from '../src/utils';
import { GITHUB_PUSH_EVENT, GITHUB_PR_EVENT, GITHUB_WORKFLOW_EVENT } from '../fixtures';

describe('Utils', () => {
  process.env.GITHUB_REPOSITORY = 'voxmedia/github-action-slack-notify-build';

  describe('formatChannelName', () => {
    it('strips #', () => {
      expect(formatChannelName('#app-notifications')).toBe('app-notifications');
    });

    it('strips @', () => {
      expect(formatChannelName('@app.buddy')).toBe('app.buddy');
    });
  });

  describe('buildSlackAttachments', () => {
    it('passes color', () => {
      const attachments = buildSlackAttachments({
        status: 'STARTED',
        color: 'good',
        event_show: false,
        github: GITHUB_PUSH_EVENT,
      });

      expect(attachments[0].color).toBe('good');
    });

    it('shows status', () => {
      const attachments = buildSlackAttachments({
        status: 'STARTED',
        color: 'good',
        event_show: false,
        github: GITHUB_PUSH_EVENT,
      });

      expect(attachments[0].fields.find(a => a.title === 'Status')).toEqual({
        title: 'Status',
        value: 'STARTED',
        short: true,
      });
    });

    it('show repo', () => {
      const attachments = buildSlackAttachments({
        status: 'STARTED',
        color: 'good',
        event_show: false,
        github: GITHUB_PUSH_EVENT,
      });

      expect(attachments[0].fields.find(a => a.title === 'Repo')).toEqual({
        title: 'Repo',
        value:
          '<https://github.com/voxmedia/github-action-slack-notify-build | voxmedia/github-action-slack-notify-build>',
        short: true,
      });
    });

    it('show author/actor', () => {
      const attachments = buildSlackAttachments({
        status: 'STARTED',
        color: 'good',
        event_show: false,
        github: GITHUB_PUSH_EVENT,
      });

      expect(attachments[0].fields.find(a => a.title === 'Author')).toEqual({
        title: 'Author',
        value: 'Codertocat',
        short: true,
      });
    });

    describe('for push events', () => {
      it('links to the action workflow', () => {
        const attachments = buildSlackAttachments({
          status: 'STARTED',
          color: 'good',
          event_show: false,
          github: GITHUB_PUSH_EVENT,
        });

        expect(attachments[0].fields.find(a => a.title === 'Action')).toEqual({
          title: 'Action',
          value: `<https://github.com/voxmedia/github-action-slack-notify-build/commit/abc123/checks | CI>`,
          short: true,
        });
      });

      it('links to the branch', () => {
        const attachments = buildSlackAttachments({
          status: 'STARTED',
          color: 'good',
          event_show: true,
          github: GITHUB_PUSH_EVENT,
        });

        expect(attachments[0].fields.find(a => a.title === 'Branch')).toEqual({
          title: 'Branch',
          value: `<https://github.com/voxmedia/github-action-slack-notify-build/commit/abc123 | my-branch>`,
          short: true,
        });
      });

      it('no links to the branch', () => {
        const attachments = buildSlackAttachments({
          status: 'STARTED',
          color: 'good',
          event_show: false,
          github: GITHUB_PUSH_EVENT,
        });

        expect(attachments[0].fields.find(a => a.title === 'Branch')).toEqual(undefined);
      });

      it('show message', () => {
        const attachments = buildSlackAttachments({
          status: 'STARTED',
          color: 'good',
          github: GITHUB_PUSH_EVENT,
          message: 'message',
          event_show: true,
        });

        expect(attachments[0].fields.find(a => a.title === 'Message')).toEqual({
          title: 'Message',
          value: 'message',
          short: false,
        });
      });
    });

    describe('for PR events', () => {
      it('links to the action workflow', () => {
        const attachments = buildSlackAttachments({
          status: 'STARTED',
          color: 'good',
          event_show: false,
          github: GITHUB_PR_EVENT,
        });

        expect(attachments[0].fields.find(a => a.title === 'Action')).toEqual({
          title: 'Action',
          value: `<https://github.com/voxmedia/github-action-slack-notify-build/commit/xyz678/checks | CI>`,
          short: true,
        });
      });

      it('links to the PR', () => {
        const attachments = buildSlackAttachments({
          status: 'STARTED',
          color: 'good',
          event_show: true,
          github: GITHUB_PR_EVENT,
        });

        expect(attachments[0].fields.find(a => a.title === 'Pull Request')).toEqual({
          title: 'Pull Request',
          value: `<https://github.com/voxmedia/github-action-slack-notify-build/pulls/1 | This is a PR>`,
          short: true,
        });
      });

      it('no links to the PR', () => {
        const attachments = buildSlackAttachments({
          status: 'STARTED',
          color: 'good',
          event_show: false,
          github: GITHUB_PR_EVENT,
        });

        expect(attachments[0].fields.find(a => a.title === 'Pull Request')).toEqual(undefined);
      });

      it('show message', () => {
        const attachments = buildSlackAttachments({
          status: 'STARTED',
          color: 'good',
          github: GITHUB_PR_EVENT,
          message: 'message',
          event_show: true,
        });

        expect(attachments[0].fields.find(a => a.title === 'Message')).toEqual({
          title: 'Message',
          value: 'message',
          short: false,
        });
      });
    });

    describe('for manual workflow events', () => {
      it('links to the action workflow', () => {
        const attachments = buildSlackAttachments({
          status: 'STARTED',
          color: 'good',
          event_show: false,
          github: GITHUB_WORKFLOW_EVENT,
        });

        expect(attachments[0].fields.find(a => a.title === 'Action')).toEqual({
          title: 'Action',
          value: 'CI',
          short: true,
        });
      });

      it('links to the branch', () => {
        const attachments = buildSlackAttachments({
          status: 'STARTED',
          color: 'good',
          event_show: true,
          github: GITHUB_WORKFLOW_EVENT,
        });

        expect(attachments[0].fields.find(a => a.title === 'Branch')).toEqual({
          title: 'Branch',
          value: 'my-branch',
          short: true,
        });
      });

      it('no links to the branch', () => {
        const attachments = buildSlackAttachments({
          status: 'STARTED',
          color: 'good',
          event_show: false,
          github: GITHUB_WORKFLOW_EVENT,
        });

        expect(attachments[0].fields.find(a => a.title === 'Branch')).toEqual(undefined);
      });

      it('show message', () => {
        const attachments = buildSlackAttachments({
          status: 'STARTED',
          color: 'good',
          github: GITHUB_WORKFLOW_EVENT,
          message: 'message',
        });

        expect(attachments[0].fields.find(a => a.title === 'Message')).toEqual({
          title: 'Message',
          value: 'message',
          short: false,
        });
      });
    });
  });
});
