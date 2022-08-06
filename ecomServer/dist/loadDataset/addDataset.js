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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadData = void 0;
function loadData(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const json = require(filepath);
        const productList = [];
        for (let i = 0; i < json.products.length; i++) {
            const data = json.products[i];
            const productData = {
                uid: data['Uniq Id'],
                aboutProduct: data['About Product'],
                category: data.Category,
                image: data.Image,
                productName: data['Product Name'],
                productSpecification: data['Product Specification'],
                sellingPrice: data['Selling Price'],
                brandName: data['Brand Name'],
                variants: data.Variants,
                quantity: Math.floor(Math.random() * 10) + 1,
            };
            productList.push(productData);
        }
        let data;
        //   const data = await mongodb.insertProductList(productList);
        return data !== null && data !== void 0 ? data : 'done';
    });
}
exports.loadData = loadData;
