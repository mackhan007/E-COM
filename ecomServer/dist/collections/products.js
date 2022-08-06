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
var _Products_PRODUCTS, _Products_products;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Products = void 0;
class Products {
    constructor(database, products) {
        _Products_PRODUCTS.set(this, void 0);
        _Products_products.set(this, void 0);
        this.getProduct = (productId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield __classPrivateFieldGet(this, _Products_products, "f")
                    .findOne({ uid: productId });
                return result;
            }
            catch (e) {
                return null;
            }
        });
        this.insertProduct = (product) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield __classPrivateFieldGet(this, _Products_products, "f").insertOne(product);
                //   console.log(result);
                return `Successfully added to database ${result.insertedId}`;
            }
            catch (e) {
                return `Unable to add data ${e}`;
            }
        });
        this.insertProductList = (productList) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield __classPrivateFieldGet(this, _Products_products, "f").insertMany(productList);
                //   console.log(result);
                return `Successfully added to database ${result.insertedIds}`;
            }
            catch (e) {
                return `Unable to add data ${e}`;
            }
        });
        this.getAllProducts = (startIndex, limit) => __awaiter(this, void 0, void 0, function* () {
            try {
                const query = { uid: { $gte: (startIndex !== null && startIndex !== void 0 ? startIndex : 0) } };
                const result = yield __classPrivateFieldGet(this, _Products_products, "f")
                    .find(query)
                    .sort({ uid: 1 })
                    .limit(limit !== null && limit !== void 0 ? limit : 20)
                    .toArray();
                //   console.log(result);
                return result;
            }
            catch (e) {
                console.log(e);
                return [];
            }
        });
        this.addProductToCart = (productId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield this.getProduct(productId);
                if (product == null)
                    return null;
                if (product.quantity <= 0) {
                    return null;
                }
                const result = yield __classPrivateFieldGet(this, _Products_products, "f")
                    .updateOne({ uid: productId }, { $set: { quantity: product.quantity - 1 } });
                return result;
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
        this.removeProductFromCart = (productId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield this.getProduct(productId);
                if (product == null)
                    return null;
                const result = yield __classPrivateFieldGet(this, _Products_products, "f")
                    .updateOne({ uid: productId }, { $set: { quantity: product.quantity + 1 } });
                return result;
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
        __classPrivateFieldSet(this, _Products_PRODUCTS, products !== null && products !== void 0 ? products : 'products', "f");
        __classPrivateFieldSet(this, _Products_products, database.collection(__classPrivateFieldGet(this, _Products_PRODUCTS, "f")), "f");
    }
}
exports.Products = Products;
_Products_PRODUCTS = new WeakMap(), _Products_products = new WeakMap();
