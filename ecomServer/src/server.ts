import express, {
  Application, Response, Request,
} from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import { loadData } from './loadDataset/addDataset';
import {
  offersAPI, productsAPI, purchaseAPI, usersAPI,
} from './context';
import { IProduct } from './types/productType';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT ?? '8000', 10);

app.use(cors());
app.use(express.json());

/**
 *
 * used to start the server
 */
app.listen(PORT, () => console.log('Server Started'));

/**
 * shows if the server is running or not
 */
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Server is Running');
});

/**
 *
 * load files from the dataset
 *
 * warn only do it once, as the data goes to mongoDB server
 */
app.get('/loadFile', async (req: Request, res: Response) => {
  /// do only onces
  const data = await loadData('./dataset.json');

  res.status(201).send(data);
});

/**
 *
 * get all the products
 *
 * @params takes 2 parameters
 * @Required startIndex the starting index of uid after
 *      which the products are supposed to be fetched
 * @NONRequired endIndex if you want an limited amount of products
 */
app.post('/allProducts', async (req: Request, res: Response) => {
  const { startIndex } = req.body;
  let limit = null;
  if ('limit' in req.body) {
    limit = req.body.limit;
  }

  const data = await productsAPI.getAllProducts(startIndex, limit);

  res.status(201).send(data);
});

/**
 *
 * add product to card
 *
 * @params takes 2 params
 * @Required productId, userId
 */
app.post('/addProductToCart', async (req: Request, res: Response) => {
  const { productId, userId } = req.body;

  try {
    const [productsAPIResult, usersAPIResult] = await Promise.all([
      productsAPI.addProductToCart(productId),
      usersAPI.addProductToCart(productId, userId),
    ]);

    if (productsAPIResult?.acknowledged && usersAPIResult?.acknowledged) {
      res.status(201).send('Successfully added to cart');
    } else {
      if (productsAPIResult?.acknowledged) {
        productsAPI.removeProductFromCart(productId);
      }
      res.status(400).send('Unable to add to cart');
    }
  } catch (e) {
    res.status(400).send('Unable to add to cart');
  }
});

/**
 * remove product from cart
 *
 * @params takes 2 params
 * @Required productId, userId
 */
app.post('/removeProductFromCart', async (req: Request, res: Response) => {
  const { productId, userId } = req.body;

  try {
    const [productsAPIResult, usersAPIResult] = await Promise.all([
      productsAPI.removeProductFromCart(productId),
      usersAPI.removeProductFromCart(productId, userId),
    ]);

    if (productsAPIResult?.acknowledged && usersAPIResult?.acknowledged) {
      res.status(201).send('Successfully removed from cart');
    } else {
      if (productsAPIResult?.acknowledged) {
        productsAPI.addProductToCart(productId);
      }
      res.status(400).send('Unable to remove from cart');
    }
  } catch (e) {
    res.status(400).send('Unable to remove from cart');
  }
});

/**
 * purchase all products in cart
 *
 * @params takes 2 param
 * @Required userId, discountCode
 */
app.post('/purchaseCartItems', async (req: Request, res: Response) => {
  const { userId, discountCode } = req.body;

  try {
    const cartData = await usersAPI.purchaseCartItems(userId);
    if (cartData.length === 0) {
      res.status(400).send('No items in cart');
      return;
    }

    const productsPromiseList: Promise<IProduct | null>[] = [];

    cartData.forEach((productId) => {
      productsPromiseList.push(productsAPI.getProduct(productId));
    });

    const discountPercentage = await offersAPI.verifyDiscountCode(userId, discountCode);

    const products = await Promise.all(productsPromiseList);

    const purchase = await purchaseAPI
      .purchaseProduct(userId, cartData, products, discountPercentage);

    if (discountPercentage > 0) {
      await offersAPI.removeDiscount(userId);
    }

    res.status(201).send(purchase);
  } catch (e) {
    res.status(400).send('Unable to purchase cart items');
  }
});

/**
 * get all purchase history of all users
 * ADMIN ONLY
*/
app.get('/getAllPurchaseHistory', async (req: Request, res: Response) => {
  try {
    const data = await purchaseAPI.getAllPurchaseHistory();
    res.status(201).send(data);
  } catch (e) {
    res.status(400).send('Unable to get purchase history');
  }
});

/**
 * get total discount amount of all users
 * ADMIN ONLY
 */
app.get('/getTotalDiscountAmount', async (req: Request, res: Response) => {
  try {
    const data = await purchaseAPI.getTotalDiscountAmount();
    console.log(data);

    res.status(201).send({ 'total discount': data });
  } catch (e) {
    res.status(400).send('Unable to get total discount amount');
  }
});

/**
 * get Total amount of all purchases
 * ADMIN ONLY
 */
app.get('/getTotalPurchaseAmount', async (req: Request, res: Response) => {
  try {
    const data = await purchaseAPI.getTotalPurchases();

    res.status(201).send({ 'total amount': data });
  } catch (e) {
    console.log(e);
    res.status(400).send('Unable to get total purchase amount');
  }
});

/**
 * add new user to DB
 * @params takes 1 params
 * @Required userId
 */
app.post('/addNewUser', async (req: Request, res: Response) => {
  const { name } = req.body;
  const userId = randomUUID();

  try {
    const data = await offersAPI.generateDiscount(userId);

    if (data) {
      const result = await usersAPI.createNewUser(userId, name);

      if (result?.acknowledged) {
        res.status(201).send(userId);
      } else {
        res.status(400).send('Unable to create new user');
      }
    } else {
      res.status(401).send('User already exists');
    }
  } catch (e) {
    res.status(400).send('Unable to create new user');
  }
});

/**
 * get discount code of a user
 * @params takes 1 params
 * @Required userId
 */
app.post('/getUserDiscount', async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const data = await offersAPI.getUserDiscountCode(userId);

    if (data !== null) {
      res.status(201).send(data);
    } else {
      res.status(401).send('User does not exist');
    }
  } catch (e) {
    res.status(400).send('Unable to get discount');
  }
});

/**
 * get all discount codes of all users
 *
 * ADMIN ONLY
 */
app.get('/getAllDiscountCodes', async (req: Request, res: Response) => {
  try {
    const data = await offersAPI.getAllDiscountCodes();

    res.status(201).send(data);
  } catch (e) {
    res.status(400).send('Unable to get discount');
  }
});
