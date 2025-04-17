// Local database implementation using JSON files
// This is used as a fallback when MongoDB connection fails

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Define the base directory for storing JSON files
const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure the data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (error) {
  console.error('Error creating data directory:', error);
}

// Helper function to get the file path for a collection
const getCollectionPath = (collection: string) => {
  return path.join(DATA_DIR, `${collection}.json`);
};

// Helper function to read a collection
const readCollection = (collection: string) => {
  const filePath = getCollectionPath(collection);
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error(`Error reading collection ${collection}:`, error);
    return [];
  }
};

// Helper function to write to a collection
const writeCollection = (collection: string, data: any[]) => {
  const filePath = getCollectionPath(collection);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing to collection ${collection}:`, error);
    return false;
  }
};

// Create a mock database interface
export const localDb = {
  collection: (name: string) => ({
    find: (query = {}) => ({
      sort: (sortOptions = {}) => ({
        toArray: async () => {
          const data = readCollection(name);
          // Simple filtering based on query
          let result = data;

          if (Object.keys(query).length > 0) {
            result = data.filter(item => {
              return Object.entries(query).every(([key, value]) => {
                return item[key] === value;
              });
            });
          }

          return result;
        }
      })
    }),
    findOne: async (query = {}) => {
      const data = readCollection(name);
      return data.find(item => {
        return Object.entries(query).every(([key, value]) => {
          return item[key] === value;
        });
      }) || null;
    },
    insertOne: async (document: any) => {
      const data = readCollection(name);
      const id = crypto.randomUUID();
      const newDocument = {
        ...document,
        _id: id
      };
      data.push(newDocument);
      writeCollection(name, data);
      return { insertedId: id };
    },
    updateOne: async (query: any, update: any) => {
      const data = readCollection(name);
      let modifiedCount = 0;

      const updatedData = data.map(item => {
        if (Object.entries(query).every(([key, value]) => item[key] === value)) {
          modifiedCount++;
          if (update.$set) {
            return { ...item, ...update.$set };
          }
        }
        return item;
      });

      writeCollection(name, updatedData);
      return { modifiedCount };
    },
    deleteOne: async (query: any) => {
      const data = readCollection(name);
      const initialLength = data.length;

      const filteredData = data.filter(item => {
        return !Object.entries(query).every(([key, value]) => {
          return item[key] === value;
        });
      });

      writeCollection(name, filteredData);
      return { deletedCount: initialLength - filteredData.length };
    },
    countDocuments: async (query = {}) => {
      const data = readCollection(name);
      if (Object.keys(query).length === 0) {
        return data.length;
      }

      return data.filter(item => {
        return Object.entries(query).every(([key, value]) => {
          return item[key] === value;
        });
      }).length;
    },
    createIndex: async () => {
      // No-op for local DB
      return null;
    },
    aggregate: (pipeline: any[]) => ({
      toArray: async () => {
        // Simple aggregation for local DB
        const data = readCollection(name);
        // Only implement basic grouping for now
        if (pipeline.length === 1 && pipeline[0].$group) {
          const groupConfig = pipeline[0].$group;
          const groupKey = groupConfig._id;
          const groups: Record<string, any> = {};

          data.forEach(item => {
            let key = '';
            if (typeof groupKey === 'string' && groupKey.startsWith('$')) {
              // Simple field grouping
              const field = groupKey.substring(1);
              key = item[field];
            } else if (typeof groupKey === 'object') {
              // Compound grouping
              key = Object.entries(groupKey).map(([k, v]) => {
                const field = (v as string).substring(1);
                return item[field];
              }).join('_');
            }

            if (!groups[key]) {
              groups[key] = { _id: key, count: 0 };
            }

            groups[key].count++;
          });

          return Object.values(groups);
        }

        return [];
      }
    })
  }),
  listCollections: () => ({
    toArray: async () => {
      try {
        const files = fs.readdirSync(DATA_DIR);
        return files
          .filter(file => file.endsWith('.json'))
          .map(file => ({
            name: file.replace('.json', '')
          }));
      } catch (error) {
        console.error('Error listing collections:', error);
        return [];
      }
    }
  }),
  createCollection: async (name: string) => {
    const filePath = getCollectionPath(name);
    if (!fs.existsSync(filePath)) {
      writeCollection(name, []);
    }
    return true;
  }
};

// Export a function to get the local DB
export function getLocalDb() {
  return {
    client: null,
    db: localDb
  };
}
