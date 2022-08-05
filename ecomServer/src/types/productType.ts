interface IProduct {
    uid: string;
    productName: string;
    category: string;
    sellingPrice: string;
    aboutProduct: string;
    productSpecification: string;
    image: string;
    quantity: number;
    variants?: string;
    brandName?: string;
}

export { IProduct };
