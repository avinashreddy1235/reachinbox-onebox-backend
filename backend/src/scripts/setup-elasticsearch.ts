import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200'
});

async function setupElasticsearch() {
  const index = process.env.ELASTICSEARCH_INDEX || 'emails';

  try {
    // Check if index exists
    const indexExists = await client.indices.exists({ 
      index 
    });

    if (indexExists) {
      console.log(`Index ${index} already exists. Deleting...`);
      await client.indices.delete({ 
        index 
      });
    }

    // Create index with mapping
    await client.indices.create({
      index,
      settings: {
        analysis: {
          analyzer: {
            email_analyzer: {
              type: 'custom',
              tokenizer: 'standard',
              filter: ['lowercase', 'stop', 'snowball']
            }
          }
        }
      },
      mappings: {
        properties: {
          id: { type: 'keyword' },
          from: { type: 'keyword' },
          to: { type: 'keyword' },
          subject: { type: 'text' },
          body: { type: 'text' },
          date: { type: 'date' },
          category: { type: 'keyword' },
          accountId: { type: 'keyword' },
          folder: { type: 'keyword' }
        }
      }
    });

    console.log(`Successfully created index ${index} with mappings`);
  } catch (error) {
    console.error('Error setting up Elasticsearch:', error);
    process.exit(1);
  }
}

setupElasticsearch();