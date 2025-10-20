import { Client } from '@elastic/elasticsearch';
import { Email, EmailSearchFilters, EmailSearchResult } from '../config/types';

export class ElasticsearchService {
  private client: Client;
  private index: string;

  constructor(node: string, index: string) {
    this.client = new Client({ 
      node,
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
        password: process.env.ELASTICSEARCH_PASSWORD || 'changeme'
      }
    });
    this.index = index;
    this.initializeIndex().catch(err => {
      console.error('Failed to initialize Elasticsearch index:', err);
    });
  }

  private async initializeIndex(): Promise<void> {
    try {
      const exists = await this.client.indices.exists({ 
        index: this.index 
      });
    
      if (!exists) {
        await this.client.indices.create({
          index: this.index,
          mappings: {
            properties: {
              from: { type: 'keyword' },
              to: { type: 'keyword' },
              subject: { type: 'text' },
              body: { type: 'text' },
              date: { type: 'date' },
              categories: { type: 'keyword' },
              accountId: { type: 'keyword' },
              folder: { type: 'keyword' }
            }
          }
        });
      }
    } catch (error) {
      console.error('Error initializing Elasticsearch index:', error);
      throw error;
    }
  }

  async indexEmail(email: Email, accountId: string, folder: string): Promise<string> {
    try {
      const result = await this.client.index({
        index: this.index,
        document: {
          ...email,
          accountId,
          folder,
          date: new Date(email.date).toISOString()
        }
      });
      return result._id;
    } catch (error) {
      console.error('Error indexing email:', error);
      throw error;
    }
  }

  async searchEmails(query: string, filters?: EmailSearchFilters): Promise<EmailSearchResult[]> {
    try {
      const must: any[] = [];

      if (query) {
        must.push({
          multi_match: {
            query,
            fields: ['subject^2', 'text']
          }
        });
      }

      if (filters) {
        if (filters.accountId) {
          must.push({ term: { accountId: filters.accountId } });
        }
        if (filters.folder) {
          must.push({ term: { folder: filters.folder } });
        }
        if (filters.category) {
          must.push({ term: { categories: filters.category } });
        }
        if (filters.startDate) {
          must.push({
            range: {
              date: {
                gte: filters.startDate
              }
            }
          });
        }
        if (filters.endDate) {
          must.push({
            range: {
              date: {
                lte: filters.endDate
              }
            }
          });
        }
      }

      const result = await this.client.search({
        index: this.index,
        query: must.length > 0 ? {
          bool: { must }
        } : {
          match_all: {}
        },
        sort: [
          { date: 'desc' }
        ]
      });

      return result.hits.hits.map(hit => {
        if (!hit._id) {
          throw new Error('Elasticsearch response missing _id');
        }
        return {
          id: hit._id,
          ...(hit._source as Omit<EmailSearchResult, 'id'>)
        };
      });
    } catch (error) {
      console.error('Error searching emails:', error);
      throw error;
    }
  }

  async ping(): Promise<boolean> {
    try {
      await this.client.ping();
      return true;
    } catch (error) {
      console.error('Elasticsearch ping failed:', error);
      return false;
    }
  }
}