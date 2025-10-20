import axios from 'axios';
import { Email } from '../config/types';

export class WebhookService {
  private slackWebhookUrl: string;
  private externalWebhookUrl: string;

  constructor(slackWebhookUrl: string, externalWebhookUrl: string) {
    this.slackWebhookUrl = slackWebhookUrl;
    this.externalWebhookUrl = externalWebhookUrl;
  }

  async sendSlackNotification(email: Email) {
    try {
      await axios.post(this.slackWebhookUrl, {
        text: `New Interested Lead!\nFrom: ${email.from}\nSubject: ${email.subject}`
      });
    } catch (error) {
      console.error('Error sending Slack notification:', error);
    }
  }

  async triggerExternalWebhook(email: Email) {
    try {
      await axios.post(this.externalWebhookUrl, {
        event: 'interested_lead',
        email: {
          from: email.from,
          subject: email.subject,
          date: email.date
        }
      });
    } catch (error) {
      console.error('Error triggering external webhook:', error);
    }
  }
}