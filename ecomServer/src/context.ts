import { Offers } from './collections/offers';
import { Products } from './collections/products';
import { Purchases } from './collections/purchases';
import { Users } from './collections/users';
import { MongoDb } from './database/mongoDb';

const mongodb = new MongoDb();
const productsAPI = new Products(mongodb.database);
const usersAPI = new Users(mongodb.database);
const offersAPI = new Offers(mongodb.database);
const purchaseAPI = new Purchases(mongodb.database);

export {
  mongodb, productsAPI, usersAPI, offersAPI,
  purchaseAPI,
};
