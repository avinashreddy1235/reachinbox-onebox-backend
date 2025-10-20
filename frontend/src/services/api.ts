import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export interface Email {
  id: string;
  from: string;
  to: string[];
  subject: string;
  text: string;
  html?: string;
  date: string;
  categories?: string[];
}

export interface SearchResponse {
  emails: Email[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SearchParams {
  query?: string;
  accountId?: string;
  folder?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

class APIService {
  async searchEmails(params: SearchParams): Promise<SearchResponse> {
    const response = await axios.get(`${API_URL}/api/emails/search`, { params });
    return response.data;
  }

  async getEmailById(id: string): Promise<Email> {
    const response = await axios.get(`${API_URL}/api/emails/${id}`);
    return response.data;
  }

  async getSuggestedReply(emailId: string): Promise<string> {
    const response = await axios.post(`${API_URL}/api/emails/${emailId}/suggest-reply`);
    return response.data.reply;
  }

  async getRecentEmails(accountId: string): Promise<Email[]> {
    const response = await axios.get(`${API_URL}/api/emails/${accountId}/recent`);
    return response.data;
  }

  async syncEmails(): Promise<void> {
    await axios.post(`${API_URL}/api/emails/sync`);
  }

  async categorizeEmail(emailId: string): Promise<string[]> {
    const response = await axios.post(`${API_URL}/api/emails/${emailId}/categorize`);
    return response.data.categories;
  }
}

export const apiService = new APIService();