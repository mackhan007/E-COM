import {
  Db, MongoClient,
} from 'mongodb';

class MongoDb {
  constructor(url?: string, database?: string) {
    this.#URL = url ?? 'mongodb://Macky:noneed@ac-6ivbw1z-shard-00-00.ov8o64q.mongodb.net:27017,ac-6ivbw1z-shard-00-01.ov8o64q.mongodb.net:27017,ac-6ivbw1z-shard-00-02.ov8o64q.mongodb.net:27017/?ssl=true&replicaSet=atlas-zlmbm8-shard-0&authSource=admin&retryWrites=true&w=majority';
    this.#DATABASE = database ?? 'ecom';
    this.#client = new MongoClient(
      this.#URL,
    );
    this.database = this.#client.db(this.#DATABASE);
  }

  // const
  #URL: string;
  #DATABASE: string;
  #client: MongoClient;
  database: Db;

  onDestruct = async () => {
    try {
      return await this.#client.close();
    } catch (e) {
      return e;
    }
  };
}

export { MongoDb };
