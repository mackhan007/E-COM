import {
  Collection, Db, InsertOneResult, UpdateResult,
} from 'mongodb';
import { IUser } from '../types/userType';

class Users {
  constructor(database: Db, users?: string) {
    this.#USERS = users ?? 'users';
    this.#users = database.collection(this.#USERS);
  }

  #USERS: string;
  #users: Collection<IUser>;

  createNewUser = async (userId: string, name?: string): Promise<InsertOneResult> => {
    try {
      const user = {
        uid: userId,
        name,
        cart: [],
      } as IUser;

      const result = await this.#users.insertOne(user);

      return result;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  addProductToCart = async (
    productId: number,
    userId: string,
  ): Promise<UpdateResult | null> => {
    try {
      const user = await this.#users.findOne({ uid: userId });
      if (user == null) return null;

      const result = await this.#users
        .updateOne({ uid: userId } as any, { $set: { cart: [...user.cart, productId] } });

      return result;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  removeProductFromCart = async (
    productId: number,
    userId: string,
  ): Promise<UpdateResult | null> => {
    try {
      const user = await this.#users.findOne({ uid: userId });
      if (user == null) return null;

      const productIndex = user.cart.indexOf(productId, 0);

      if (productIndex > -1) {
        user.cart.splice(productIndex, 1);
      } else {
        return null;
      }

      const result = await this.#users
        .updateOne({ uid: userId } as any, { $set: { cart: user.cart } });

      return result;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  purchaseCartItems = async (
    userId: string,
  ): Promise<number[]> => {
    try {
      const user = await this.#users.findOne({ uid: userId });
      if (user == null) return [];

      const { cart } = user;

      await this.#users
        .updateOne({ uid: userId } as any, { $set: { cart: [] } });

      return cart;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
}

export { Users };
