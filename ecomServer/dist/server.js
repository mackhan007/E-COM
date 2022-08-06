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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const crypto_1 = require("crypto");
const addDataset_1 = require("./loadDataset/addDataset");
const context_1 = require("./context");
const app = (0, express_1.default)();
const PORT = parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '8000', 10);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
/**
 *
 * used to start the server
 */
app.listen(PORT, () => console.log('Server Started'));
/**
 * shows if the server is running or not
 */
app.get('/', (req, res) => {
    res.status(200).send('Server is Running');
});
/**
 *
 * load files from the dataset
 *
 * warn only do it once, as the data goes to mongoDB server
 */
app.get('/loadFile', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /// do only onces
    const data = yield (0, addDataset_1.loadData)('./dataset.json');
    res.status(201).send(data);
}));
/**
 *
 * get all the products
 *
 * @params takes 2 parameters
 * @Required startIndex the starting index of uid after
 *      which the products are supposed to be fetched
 * @NONRequired endIndex if you want an limited amount of products
 */
app.post('/allProducts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startIndex } = req.body;
    let limit = null;
    if ('limit' in req.body) {
        limit = req.body.limit;
    }
    const data = yield context_1.productsAPI.getAllProducts(startIndex, limit);
    res.status(201).send(data);
}));
/**
 *
 * add product to card
 *
 * @params takes 2 params
 * @Required productId, userId
 */
app.post('/addProductToCart', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, userId } = req.body;
    try {
        const [productsAPIResult, usersAPIResult] = yield Promise.all([
            context_1.productsAPI.addProductToCart(productId),
            context_1.usersAPI.addProductToCart(productId, userId),
        ]);
        if ((productsAPIResult === null || productsAPIResult === void 0 ? void 0 : productsAPIResult.acknowledged) && (usersAPIResult === null || usersAPIResult === void 0 ? void 0 : usersAPIResult.acknowledged)) {
            res.status(201).send('Successfully added to cart');
        }
        else {
            if (productsAPIResult === null || productsAPIResult === void 0 ? void 0 : productsAPIResult.acknowledged) {
                context_1.productsAPI.removeProductFromCart(productId);
            }
            res.status(400).send('Unable to add to cart');
        }
    }
    catch (e) {
        res.status(400).send('Unable to add to cart');
    }
}));
/**
 * remove product from cart
 *
 * @params takes 2 params
 * @Required productId, userId
 */
app.post('/removeProductFromCart', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, userId } = req.body;
    try {
        const [productsAPIResult, usersAPIResult] = yield Promise.all([
            context_1.productsAPI.removeProductFromCart(productId),
            context_1.usersAPI.removeProductFromCart(productId, userId),
        ]);
        if ((productsAPIResult === null || productsAPIResult === void 0 ? void 0 : productsAPIResult.acknowledged) && (usersAPIResult === null || usersAPIResult === void 0 ? void 0 : usersAPIResult.acknowledged)) {
            res.status(201).send('Successfully removed from cart');
        }
        else {
            if (productsAPIResult === null || productsAPIResult === void 0 ? void 0 : productsAPIResult.acknowledged) {
                context_1.productsAPI.addProductToCart(productId);
            }
            res.status(400).send('Unable to remove from cart');
        }
    }
    catch (e) {
        res.status(400).send('Unable to remove from cart');
    }
}));
/**
 * purchase all products in cart
 *
 * @params takes 2 param
 * @Required userId, discountCode
 */
app.post('/purchaseCartItems', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, discountCode } = req.body;
    try {
        const cartData = yield context_1.usersAPI.purchaseCartItems(userId);
        if (cartData.length === 0) {
            res.status(400).send('No items in cart');
            return;
        }
        const productsPromiseList = [];
        cartData.forEach((productId) => {
            productsPromiseList.push(context_1.productsAPI.getProduct(productId));
        });
        const discountPercentage = yield context_1.offersAPI.verifyDiscountCode(userId, discountCode);
        const products = yield Promise.all(productsPromiseList);
        const purchase = yield context_1.purchaseAPI
            .purchaseProduct(userId, cartData, products, discountPercentage);
        if (discountPercentage > 0) {
            yield context_1.offersAPI.removeDiscount(userId);
        }
        res.status(201).send(purchase);
    }
    catch (e) {
        res.status(400).send('Unable to purchase cart items');
    }
}));
/**
 * get all purchase history of all users
 * ADMIN ONLY
*/
app.get('/getAllPurchaseHistory', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield context_1.purchaseAPI.getAllPurchaseHistory();
        res.status(201).send(data);
    }
    catch (e) {
        res.status(400).send('Unable to get purchase history');
    }
}));
/**
 * get total discount amount of all users
 * ADMIN ONLY
 */
app.get('/getTotalDiscountAmount', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield context_1.purchaseAPI.getTotalDiscountAmount();
        console.log(data);
        res.status(201).send({ 'total discount': data });
    }
    catch (e) {
        res.status(400).send('Unable to get total discount amount');
    }
}));
/**
 * get Total amount of all purchases
 * ADMIN ONLY
 */
app.get('/getTotalPurchaseAmount', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield context_1.purchaseAPI.getTotalPurchases();
        res.status(201).send({ 'total amount': data });
    }
    catch (e) {
        console.log(e);
        res.status(400).send('Unable to get total purchase amount');
    }
}));
/**
 * add new user to DB
 * @params takes 1 params
 * @Required userId
 */
app.post('/addNewUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const userId = (0, crypto_1.randomUUID)();
    try {
        const data = yield context_1.offersAPI.generateDiscount(userId);
        if (data) {
            const result = yield context_1.usersAPI.createNewUser(userId, name);
            if (result === null || result === void 0 ? void 0 : result.acknowledged) {
                res.status(201).send(userId);
            }
            else {
                res.status(400).send('Unable to create new user');
            }
        }
        else {
            res.status(401).send('User already exists');
        }
    }
    catch (e) {
        res.status(400).send('Unable to create new user');
    }
}));
/**
 * get discount code of a user
 * @params takes 1 params
 * @Required userId
 */
app.post('/getUserDiscount', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        const data = yield context_1.offersAPI.getUserDiscountCode(userId);
        if (data !== null) {
            res.status(201).send(data);
        }
        else {
            res.status(401).send('User does not exist');
        }
    }
    catch (e) {
        res.status(400).send('Unable to get discount');
    }
}));
/**
 * get all discount codes of all users
 *
 * ADMIN ONLY
 */
app.get('/getAllDiscountCodes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield context_1.offersAPI.getAllDiscountCodes();
        res.status(201).send(data);
    }
    catch (e) {
        res.status(400).send('Unable to get discount');
    }
}));
