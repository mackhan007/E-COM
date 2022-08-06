"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Offers_OFFERS, _Offers_offers, _Offers_nth, _Offers_DISCOUNT, _Offers_generateDiscountCode;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Offers = void 0;
class Offers {
    constructor(database, offers, nth, discount) {
        _Offers_OFFERS.set(this, void 0);
        _Offers_offers.set(this, void 0);
        _Offers_nth.set(this, void 0);
        _Offers_DISCOUNT.set(this, void 0);
        // eslint-disable-next-line class-methods-use-this
        _Offers_generateDiscountCode.set(this, () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 12; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
                if (i !== 0 && (i - 1) % 4 === 0) {
                    result += '-';
                }
            }
            return result;
        });
        this.setNth = (nth) => {
            __classPrivateFieldSet(this, _Offers_nth, nth, "f");
        };
        // eslint-disable-next-line consistent-return
        this.generateDiscount = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const query = { offers: { $elemMatch: { userId } } };
                const isUserPresent = yield __classPrivateFieldGet(this, _Offers_offers, "f").findOne(query);
                if (isUserPresent != null)
                    return null;
                const offerCount = yield __classPrivateFieldGet(this, _Offers_offers, "f").find().toArray();
                if (offerCount.length === 0) {
                    const discountCode = __classPrivateFieldGet(this, _Offers_generateDiscountCode, "f").call(this);
                    const offer = {
                        uid: 1,
                        discountCode,
                        userId,
                    };
                    const result = yield __classPrivateFieldGet(this, _Offers_offers, "f").insertOne({ offers: [offer], counter: 1 });
                    return result;
                }
                const { offers, counter } = offerCount[0];
                if ((counter % __classPrivateFieldGet(this, _Offers_nth, "f")) === 0) {
                    const discountCode = __classPrivateFieldGet(this, _Offers_generateDiscountCode, "f").call(this);
                    const offer = {
                        uid: counter + 1,
                        discountCode,
                        userId,
                    };
                    const result = yield __classPrivateFieldGet(this, _Offers_offers, "f").updateOne({ counter }, { $set: { offers: [...offers, offer], counter: counter + 1 } }, { upsert: true });
                    return result;
                }
                const offer = {
                    uid: counter + 1,
                    discountCode: '',
                    userId,
                };
                const result = yield __classPrivateFieldGet(this, _Offers_offers, "f").updateOne({ counter }, { $set: { offers: [...offers, offer], counter: counter + 1 } });
                return result;
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
        this.removeDiscount = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const usersData = yield __classPrivateFieldGet(this, _Offers_offers, "f").find().toArray();
                if (usersData == null)
                    return null;
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
                }
                else {
                    return null;
                }
                const result = yield __classPrivateFieldGet(this, _Offers_offers, "f").updateOne({ counter }, { $set: { offers, counter } });
                return result;
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
        this.getUserDiscountCode = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(userId);
                const query = { offers: { $elemMatch: { userId } } };
                const usersData = yield __classPrivateFieldGet(this, _Offers_offers, "f").findOne(query);
                if (usersData == null)
                    return null;
                let userOffer = null;
                usersData === null || usersData === void 0 ? void 0 : usersData.offers.forEach((offer) => {
                    if (offer.userId === userId) {
                        userOffer = offer;
                    }
                });
                if (userOffer == null)
                    return null;
                return userOffer.discountCode;
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
        this.verifyDiscountCode = (userId, discountCode) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userDiscountCode = yield this.getUserDiscountCode(userId);
                if (userDiscountCode == null)
                    return 0;
                if (userDiscountCode === discountCode) {
                    return __classPrivateFieldGet(this, _Offers_DISCOUNT, "f");
                }
                return 0;
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
        this.getAllDiscountCodes = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const usersData = yield __classPrivateFieldGet(this, _Offers_offers, "f").find().toArray();
                if (usersData == null)
                    return null;
                const userOffers = [];
                usersData[0].offers.forEach((offer) => {
                    if (offer.discountCode !== '') {
                        userOffers.push(offer);
                    }
                });
                if (userOffers.length === 0)
                    return null;
                return userOffers;
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
        __classPrivateFieldSet(this, _Offers_OFFERS, offers !== null && offers !== void 0 ? offers : 'offers', "f");
        __classPrivateFieldSet(this, _Offers_offers, database.collection(__classPrivateFieldGet(this, _Offers_OFFERS, "f")), "f");
        __classPrivateFieldSet(this, _Offers_nth, nth !== null && nth !== void 0 ? nth : 4, "f");
        __classPrivateFieldSet(this, _Offers_DISCOUNT, discount !== null && discount !== void 0 ? discount : 0.1, "f");
    }
}
exports.Offers = Offers;
_Offers_OFFERS = new WeakMap(), _Offers_offers = new WeakMap(), _Offers_nth = new WeakMap(), _Offers_DISCOUNT = new WeakMap(), _Offers_generateDiscountCode = new WeakMap();
