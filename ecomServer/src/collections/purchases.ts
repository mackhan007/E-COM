import { Collection, Db } from 'mongodb';
import { IProduct } from '../types/productType';
import { IPurchases } from '../types/purchasesType';

class Purchases {
  constructor(database: Db, purchases?: string) {
    this.#PURCHASES = purchases ?? 'purchases';
    this.#purchases = database.collection(this.#PURCHASES);
  }

  #PURCHASES: string;
  #purchases: Collection<IPurchases>;

  getTotalPurchases = async (): Promise<number> => {
    try {
      const result = await this.#purchases.find().toArray();

      return result.reduce((acc, cur) => acc + cur.sellingPrice - cur.discountPrice, 0);
    } catch (e) {
      return 0;
    }
  };

  getTotalDiscountAmount = async (): Promise<number> => {
    try {
      console.log('getTotalDiscountAmount');
      const result = await this.#purchases.find().toArray();

      return result.reduce((acc, cur) => acc + cur.discountPrice, 0);
    } catch (e) {
      return 0;
    }
  };

  getAllPurchaseHistory = async (userId?: string): Promise<IPurchases[]> => {
    try {
      const result = await this.#purchases.find().toArray();
      if (userId) {
        return result.filter((purchase) => purchase.userId === userId);
      }
      return result;
    } catch (e) {
      return [];
    }
  };

  purchaseProduct = async (
    userId: string,
    cart: number[],
    products: (IProduct | null)[],
    discountPercent?: number,
  ): Promise<string> => {
    try {
      for (let i = 0; i < cart.length; i++) {
        // eslint-disable-next-line no-continue
        if (products[i] == null) continue;

        const sellingPrice = parseInt(products[i]!.sellingPrice.substring(1), 10);
        const productId = cart[i];
        let discountPrice = 0;

        if (discountPercent) {
          discountPrice = sellingPrice * discountPercent;
        }

        const purchase = {
          uid: `${userId}-${productId}`,
          productId,
          userId,
          quantity: 1,
          sellingPrice,
          discountPrice,
        } as IPurchases;

        this.#purchases.insertOne(purchase);
      }

      return 'Successfully purchased';
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
}

export { Purchases };
