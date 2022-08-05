interface IOffer {
    uid: number;
    discountCode: string;
    userId: string;
}

interface IOffers {
    offers: IOffer[];
    counter: number;
}

export { IOffers, IOffer };
