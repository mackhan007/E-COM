import { Collection, Db, UpdateResult } from 'mongodb';
import { IProduct } from '../types/productType';

class Products {
  constructor(database: Db, products?: string) {
    this.#PRODUCTS = products ?? 'products';
    this.#products = database.collection(this.#PRODUCTS);
  }

  #PRODUCTS: string;
  #products: Collection<IProduct>;

  getProduct = async (productId: number) => {
    try {
      const result: IProduct = await this.#products
        .findOne<IProduct>({ uid: productId } as any) as any;

      return result;
    } catch (e) {
      return null;
    }
  };

  insertProduct = async (product: IProduct) => {
    try {
      const result = await this.#products.insertOne(product);

      //   console.log(result);
      return `Successfully added to database ${result.insertedId}`;
    } catch (e) {
      return `Unable to add data ${e}`;
    }
  };

  insertProductList = async (productList: IProduct[]) => {
    try {
      const result = await this.#products.insertMany(productList);

      //   console.log(result);
      return `Successfully added to database ${result.insertedIds}`;
    } catch (e) {
      return `Unable to add data ${e}`;
    }
  };

  getAllProducts = async (startIndex?: number, limit?: number) => {
    try {
      const query = { uid: { $gte: (startIndex ?? 0) } };
      const result = await this.#products
        .find(query as any)
        .sort({ uid: 1 })
        .limit(limit ?? 20)
        .toArray();

      //   console.log(result);
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  addProductToCart = async (productId: number): Promise<UpdateResult | null> => {
    try {
      const product = await this.getProduct(productId);
      if (product == null) return null;
      if (product.quantity <= 0) {
        return null;
      }

      const result = await this.#products
        .updateOne({ uid: productId } as any, { $set: { quantity: product.quantity - 1 } });

      return result;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  removeProductFromCart = async (productId: number): Promise<UpdateResult | null> => {
    try {
      const product = await this.getProduct(productId);
      if (product == null) return null;

      const result = await this.#products
        .updateOne({ uid: productId } as any, { $set: { quantity: product.quantity + 1 } });

      return result;
    } catch (e) {
      console.log(e);
      return null;
    }
  };
}

export { Products };
