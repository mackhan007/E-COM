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
var _MongoDb_URL, _MongoDb_DATABASE, _MongoDb_client;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDb = void 0;
const mongodb_1 = require("mongodb");
class MongoDb {
    constructor(url, database) {
        // const
        _MongoDb_URL.set(this, void 0);
        _MongoDb_DATABASE.set(this, void 0);
        _MongoDb_client.set(this, void 0);
        this.onDestruct = () => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield __classPrivateFieldGet(this, _MongoDb_client, "f").close();
            }
            catch (e) {
                return e;
            }
        });
        __classPrivateFieldSet(this, _MongoDb_URL, url !== null && url !== void 0 ? url : 'mongodb+srv://macky:noneed@test.ujc1c.mongodb.net/?retryWrites=true&w=majority', "f");
        __classPrivateFieldSet(this, _MongoDb_DATABASE, database !== null && database !== void 0 ? database : 'ecom', "f");
        __classPrivateFieldSet(this, _MongoDb_client, new mongodb_1.MongoClient(__classPrivateFieldGet(this, _MongoDb_URL, "f")), "f");
        this.database = __classPrivateFieldGet(this, _MongoDb_client, "f").db(__classPrivateFieldGet(this, _MongoDb_DATABASE, "f"));
    }
}
exports.MongoDb = MongoDb;
_MongoDb_URL = new WeakMap(), _MongoDb_DATABASE = new WeakMap(), _MongoDb_client = new WeakMap();
