import { IProduct } from '../types/productType';

async function loadData(filepath: string) {
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
    } as IProduct;

    productList.push(productData);
  }

  let data;
  //   const data = await mongodb.insertProductList(productList);

  return data ?? 'done';
}

export { loadData };
