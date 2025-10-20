export enum EmailCategory {
  URGENT = 'URGENT',
  FOLLOW_UP = 'FOLLOW_UP',
  PERSONAL = 'PERSONAL',
  WORK = 'WORK',
  PROMOTIONAL = 'PROMOTIONAL',
  SPAM = 'SPAM'
}

export interface EmailConfig {
  email: string;
  password: string;
  host: string;
  port: number;
  tls: boolean;
}

export interface Email {
  id?: string;
  from: string;
  to: string[];
  subject: string;
  text: string;
  html?: string;
  date: string;
  categories?: string[];
  attachments?: Attachment[];
}

export interface Attachment {
  filename: string;
  contentType: string;
  size: number;
  content?: Buffer;
}

export interface EmailSearchFilters {
  accountId?: string;
  folder?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export interface EmailSearchResult {
  id: string;
  from: string;
  to: string[];
  subject: string;
  text: string;
  html?: string;
  date: string;
  categories?: string[];
  accountId: string;
  folder: string;
}