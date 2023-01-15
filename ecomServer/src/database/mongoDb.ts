import {
  Db, MongoClient,
} from 'mongodb';

class MongoDb {
  constructor(url?: string, database?: string) {
    this.#URL = url ?? 'mongodb+srv://Macky:noneed@cluster0.ov8o64q.mongodb.net/?retryWrites=true&w=majority';
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
