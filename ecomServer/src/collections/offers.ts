import { Collection, Db } from 'mongodb';
import { IOffer, IOffers } from '../types/offerType';

class Offers {
  constructor(database: Db, offers?: string, nth?: number, discount?: number) {
    this.#OFFERS = offers ?? 'offers';
    this.#offers = database.collection(this.#OFFERS);
    this.#nth = nth ?? 4;
    this.#DISCOUNT = discount ?? 0.1;
  }

  #OFFERS: string;
  #offers: Collection<IOffers>;
  #nth: number;
  #DISCOUNT: number;

  // eslint-disable-next-line class-methods-use-this
  #generateDiscountCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i !== 0 && (i - 1) % 4 === 0) {
        result += '-';
      }
    }
    return result;
  };

  setNth = (nth: number) => {
    this.#nth = nth;
  };

  // eslint-disable-next-line consistent-return
  generateDiscount = async (userId: string) => {
    try {
      const query = { offers: { $elemMatch: { userId } } };
      const isUserPresent = await this.#offers.findOne(query);
      if (isUserPresent != null) return null;

      const offerCount = await this.#offers.find().toArray();

      if (offerCount.length === 0) {
        const discountCode = this.#generateDiscountCode();
        const offer = {
          uid: 1,
          discountCode,
          userId,
        };

        const result = await this.#offers.insertOne(
          { offers: [offer], counter: 1 }as any,
        );

        return result;
      }

      const { offers, counter } = offerCount[0];

      if ((counter % this.#nth) === 0) {
        const discountCode = this.#generateDiscountCode();
        const offer = {
          uid: counter + 1,
          discountCode,
          userId,
        };

        const result = await this.#offers.updateOne(
          { counter },
          { $set: { offers: [...offers, offer], counter: counter + 1 } as any },
          { upsert: true },
        );

        return result;
      }

      const offer = {
        uid: counter + 1,
        discountCode: '',
        userId,
      };

      const result = await this.#offers.updateOne(
        { counter },
        { $set: { offers: [...offers, offer], counter: counter + 1 } as any },
      );

      return result;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  removeDiscount = async (userId: string) => {
    try {
      const usersData = await this.#offers.find().toArray();

      if (usersData == null) return null;

      const { offers, counter } = usersData[0];

      let userOfferIndex = null;

      for (let i = 0; i < offers.length; i++) {
        if (offers[i].userId === userId) {
          userOfferIndex = i;
          break;
        }
      }

      if (userOfferIndex) {
        offers[userOfferIndex].discountCode = '';
      } else {
        return null;
      }

      const result = await this.#offers.updateOne(
        { counter },
        { $set: { offers, counter } as any },
      );

      return result;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  getUserDiscountCode = async (userId: string): Promise<any> => {
    try {
      console.log(userId);
      const query = { offers: { $elemMatch: { userId } } };
      const usersData = await this.#offers.findOne(query);

      if (usersData == null) return null;

      let userOffer: IOffer | null = null;

      usersData?.offers.forEach((offer) => {
        if (offer.userId === userId) {
          userOffer = offer;
        }
      });

      if (userOffer == null) return null;

      return (userOffer as IOffer).discountCode;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  verifyDiscountCode = async (userId: string, discountCode: string): Promise<number> => {
    try {
      const userDiscountCode = await this.getUserDiscountCode(userId);

      if (userDiscountCode == null) return 0;

      if (userDiscountCode === discountCode) {
        return this.#DISCOUNT;
      }

      return 0;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  getAllDiscountCodes = async (): Promise<any> => {
    try {
      const usersData = await this.#offers.find().toArray();

      if (usersData == null) return null;

      const userOffers: IOffer[] = [];

      usersData[0].offers.forEach((offer) => {
        if (offer.discountCode !== '') {
          userOffers.push(offer);
        }
      });

      if (userOffers.length === 0) return null;

      return userOffers;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
}

export { Offers };
