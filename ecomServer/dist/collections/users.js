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
var _Users_USERS, _Users_users;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
class Users {
    constructor(database, users) {
        _Users_USERS.set(this, void 0);
        _Users_users.set(this, void 0);
        this.createNewUser = (userId, name) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = {
                    uid: userId,
                    name,
                    cart: [],
                };
                const result = yield __classPrivateFieldGet(this, _Users_users, "f").insertOne(user);
                return result;
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
        this.addProductToCart = (productId, userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield __classPrivateFieldGet(this, _Users_users, "f").findOne({ uid: userId });
                if (user == null)
                    return null;
                const result = yield __classPrivateFieldGet(this, _Users_users, "f")
                    .updateOne({ uid: userId }, { $set: { cart: [...user.cart, productId] } });
                return result;
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
        this.removeProductFromCart = (productId, userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield __classPrivateFieldGet(this, _Users_users, "f").findOne({ uid: userId });
                if (user == null)
                    return null;
                const productIndex = user.cart.indexOf(productId, 0);
                if (productIndex > -1) {
                    user.cart.splice(productIndex, 1);
                }
                else {
                    return null;
                }
                const result = yield __classPrivateFieldGet(this, _Users_users, "f")
                    .updateOne({ uid: userId }, { $set: { cart: user.cart } });
                return result;
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
        this.purchaseCartItems = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield __classPrivateFieldGet(this, _Users_users, "f").findOne({ uid: userId });
                if (user == null)
                    return [];
                const { cart } = user;
                yield __classPrivateFieldGet(this, _Users_users, "f")
                    .updateOne({ uid: userId }, { $set: { cart: [] } });
                return cart;
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
        __classPrivateFieldSet(this, _Users_USERS, users !== null && users !== void 0 ? users : 'users', "f");
        __classPrivateFieldSet(this, _Users_users, database.collection(__classPrivateFieldGet(this, _Users_USERS, "f")), "f");
    }
}
exports.Users = Users;
_Users_USERS = new WeakMap(), _Users_users = new WeakMap();
