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
var _Purchases_PURCHASES, _Purchases_purchases;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purchases = void 0;
class Purchases {
    constructor(database, purchases) {
        _Purchases_PURCHASES.set(this, void 0);
        _Purchases_purchases.set(this, void 0);
        this.getTotalPurchases = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield __classPrivateFieldGet(this, _Purchases_purchases, "f").find().toArray();
                return result.reduce((acc, cur) => acc + cur.sellingPrice - cur.discountPrice, 0);
            }
            catch (e) {
                return 0;
            }
        });
        this.getTotalDiscountAmount = () => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('getTotalDiscountAmount');
                const result = yield __classPrivateFieldGet(this, _Purchases_purchases, "f").find().toArray();
                return result.reduce((acc, cur) => acc + cur.discountPrice, 0);
            }
            catch (e) {
                return 0;
            }
        });
        this.getAllPurchaseHistory = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield __classPrivateFieldGet(this, _Purchases_purchases, "f").find().toArray();
                if (userId) {
                    return result.filter((purchase) => purchase.userId === userId);
                }
                return result;
            }
            catch (e) {
                return [];
            }
        });
        this.purchaseProduct = (userId, cart, products, discountPercent) => __awaiter(this, void 0, void 0, function* () {
            try {
                for (let i = 0; i < cart.length; i++) {
                    // eslint-disable-next-line no-continue
                    if (products[i] == null)
                        continue;
                    const sellingPrice = parseInt(products[i].sellingPrice.substring(1), 10);
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
                    };
                    __classPrivateFieldGet(this, _Purchases_purchases, "f").insertOne(purchase);
                }
                return 'Successfully purchased';
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
        __classPrivateFieldSet(this, _Purchases_PURCHASES, purchases !== null && purchases !== void 0 ? purchases : 'purchases', "f");
        __classPrivateFieldSet(this, _Purchases_purchases, database.collection(__classPrivateFieldGet(this, _Purchases_PURCHASES, "f")), "f");
    }
}
exports.Purchases = Purchases;
_Purchases_PURCHASES = new WeakMap(), _Purchases_purchases = new WeakMap();
