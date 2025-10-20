import Imap from 'imap';
import { simpleParser } from 'mailparser';
import { EmailConfig } from '../config/types';

interface EmailMessage {
  from?: string;
  to?: string[];
  subject?: string;
  body?: string;
  date?: Date;
}

import { Stream } from 'stream';
import { AddressObject } from 'mailparser';

type MessageEvents = {
  'body': [Stream, { which: string }];
  'attributes': [any];
  'end': [];
};

interface ImapMessage {
  on<K extends keyof MessageEvents>(event: K, listener: (...args: MessageEvents[K]) => void): void;
}

type Box = {
  name: string;
  flags: string[];
  readOnly: boolean;
  uidvalidity: number;
  uidnext: number;
  permFlags: string[];
  keywords: string[];
  newKeywords: boolean;
  persistentUIDs: boolean;
  nomodseq: boolean;
  messages: {
    total: number;
    new: number;
  };
};

type EmailAddress = {
  text: string;
  address: string;
};

export class ImapService {
  private imap: Imap;
  private isConnected: boolean = false;

  constructor(config: EmailConfig) {
    this.imap = new Imap({
      user: config.email,
      password: config.password,
      host: config.host,
      port: config.port,
      tls: config.tls,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.imap.on('ready', () => {
      console.log('IMAP connection ready');
      this.isConnected = true;
    });

    this.imap.on('error', (err: Error) => {
      console.error('IMAP error:', err);
    });

    this.imap.on('end', () => {
      console.log('IMAP connection ended');
      this.isConnected = false;
    });
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.imap.once('ready', resolve);
      this.imap.once('error', reject);
      this.imap.connect();
    });
  }

  async fetchRecentEmails(days: number = 30): Promise<EmailMessage[]> {
    if (!this.isConnected) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      this.imap.openBox('INBOX', false, (err: Error | null, box: Box) => {
        if (err) return reject(err);

        const date = new Date();
        date.setDate(date.getDate() - days);

        const fetch = this.imap.seq.fetch(`1:*`, {
          bodies: [''],
          struct: true,
        });

        const emails: EmailMessage[] = [];

        fetch.on('message', (msg: ImapMessage) => {
          msg.on('body', (stream: Stream, info: { which: string }) => {
            try {
              simpleParser(stream)
                .then(parsed => {
                  const toAddresses: string[] = [];
                  
                  if (parsed.to) {
                    if (Array.isArray(parsed.to)) {
                      toAddresses.push(...parsed.to.map(a => a.text));
                    } else {
                      toAddresses.push(parsed.to.text);
                    }
                  }

                  const email: EmailMessage = {
                    from: parsed.from?.text,
                    to: toAddresses,
                    subject: parsed.subject,
                    body: parsed.text,
                    date: parsed.date,
                  };
                  emails.push(email);
                })
                .catch(error => {
                  console.error('Error parsing email:', error);
                });
            } catch (error) {
              console.error('Error parsing email:', error);
            }
          });
        });

        fetch.on('error', (err: Error) => reject(err));
        fetch.on('end', () => resolve(emails));
      });
    });
  }

  enableIdleMode(): void {
    if (!this.isConnected) {
      throw new Error('IMAP not connected');
    }

    this.imap.openBox('INBOX', false, (err: Error | null, box: Box) => {
      if (err) throw err;
      this.imap.on('mail', () => {
        console.log('New email received');
        this.fetchRecentEmails(1).catch(err => {
          console.error('Error fetching recent email:', err);
        });
      });
    });
  }

  disconnect(): void {
    if (this.isConnected) {
      this.imap.end();
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}