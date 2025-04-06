// Business logic for cart
import { readJSONFile, writeJSONFile } from '../utils/fileUtils.js';
import { generateId } from '../utils/idGenerator.js';
import { validateCartData } from '../utils/validate/cartValidation.js';
import { getProductForCartById, signalInventory } from './productService.js';

const CART_FILE = '../data/cart.json';

let cartIndex = null;

const ensureCartInitialized = async () => {
  if (!cartIndex) {
    await initializeCart();
  }
};


const getCartData = async () => {
  return await readJSONFile(CART_FILE, 'c');
};


const saveCartData = async (cartData) => {
  await writeJSONFile(CART_FILE, cartData);
};


const getUserCart = async (userId, isAdmin) => {
  await ensureCartInitialized();
  const index = cartIndex[userId];
  if (index === undefined && !isAdmin) {
    throw new Error("User has not added anything to cart yet!");
  }
  const cart = await getCartData();
  return isAdmin ? cart : cart?.[0]?.[`${userId}`];
};


const getTargetUserId = (userId, isAdmin, targetUser) => {
  return isAdmin && targetUser ? targetUser : userId;
};

const logMessage = (message) => {
  console.log(message);
};


const logError = (methodName, errorMessage) => {
  console.error(`Error in ${methodName}:`, errorMessage);
};

export const initializeCart = async () => {
  try {
    const cart = Object.keys((await readJSONFile(CART_FILE, 'c'))[0]);
    cartIndex = {};
    cart.forEach((user, index) => {
      cartIndex[user] = index;
    });
  } catch (error) {
    logError('initializeCart', error.message);
    cartIndex = {};
  }
};

export const getCart = async (userId, isAdmin,targetUser_) => {
  try {
    return await getUserCart(userId, isAdmin, targetUser_);
  } catch (error) {
    logError('getCart', error.message);
    throw error;
  }
};

export const addProductToCart = async (productId, quantity, userId) => {
  try {
    await ensureCartInitialized();
    const validationErrors = validateCartData({ productId, quantity, userId });
    if (validationErrors.length > 0) {
      throw new Error(`Invalid product data: ${validationErrors.join(', ')}`);
    }
    const productInformation = await getProductForCartById(productId,quantity);

    // Check if product information was found
    if (!productInformation) {
      throw new Error(`Product with ID ${productId} not found.`);
    }

    const getTotalPrice = (parseInt(quantity) * productInformation.price);
    const index = cartIndex[userId];
    let cart = await getCartData();
    const cartId_ = String(await generateId('c'));
    const newProduct = { cartId: cartId_, productId: productId, quantity: quantity, price: productInformation.price, total: getTotalPrice};
    console.log(newProduct);

    if (index === undefined) {
      cart[0][`${userId}`] = [newProduct];
      await saveCartData(cart);
      await   signalInventory(productId,quantity,"r");
      return cart;
    } else {
      const userCart = cart[0][userId];
      const existingProductIndex = userCart.findIndex(item => item.productId === productId);

      if (existingProductIndex > -1) {
        // Update quantity and total if the product already exists
        cart[0][userId][existingProductIndex].quantity += quantity;
        cart[0][userId][existingProductIndex].total += getTotalPrice; // Use the calculated getTotalPrice
        logMessage(`Product quantity updated for product id ${productId}`);
        console.log("-------Updated cart Information----\n",cart[0][userId][existingProductIndex])
      } else {
        // Add the new product if it doesn't exist
        cart[0][userId].push(newProduct);
        logMessage("Product added to your cart!");
        console.log("-------Updated cart Information----\n", newProduct)
      }
      await saveCartData(cart);
      await   signalInventory(productId,quantity,"r");
      return cart[0][userId];
    }
  } catch (error) {
    logError('addProductToCart', error.message);
    throw error;
  }
};
//main function for removing the cart
export const removeProductFromCart = async (productId, userId, isAdmin, targetUser) => {
  try {
    await ensureCartInitialized();
    const userToRemoveFrom = getTargetUserId(userId, isAdmin, targetUser);
    const actingUserForError = getTargetUserId(userId, isAdmin, targetUser);
    // if isAdmin is true and targetUser is given the userId will be targetUser


    if (!isAdmin) {
      const cartData = await getCartData(); 
      if (!cartData?.[0]?.[userId] || cartData[0][userId].length === 0) {
        throw new Error("User has not added anything to cart yet!");
      }
    }
    const cart = await getCartData();
    const userCartKey = `${userToRemoveFrom}`;

    if (cart?.[0]?.[userCartKey]) {
      const initialCartLength = cart[0][userCartKey].length;
      const cartItemToremove = cart[0][userCartKey].find(
        (item) => item.productId === productId
      );
      cart[0][userCartKey] = cart[0][userCartKey].filter(
        (item) => item.productId !== productId
      );
  
      const updatedCartLength = cart[0][userCartKey].length;
      if(updatedCartLength === 0){
        delete cart[0][userCartKey];
      }

      await saveCartData(cart);
      
      await signalInventory(cartItemToremove.productId, cartItemToremove.quantity, "i");
      if (initialCartLength > updatedCartLength) {
        logMessage(`Product removed successfully with id ${productId}`);
        logMessage("Updated cart" + JSON.stringify(await getCart(userId, isAdmin)));
      } else {
        logMessage(`Product was not found with the id ${productId}`);
      }
    } else {
      const errorMessage = isAdmin && targetUser
        ? `User with id ${targetUser} does not have a cart.`
        : `User with id ${actingUserForError} does not have a cart.`;
      throw new Error(errorMessage);
    }

    return cart;
  } catch (error) {
    logError('removeProductFromCart', error.message);
    throw error;
  }
};

export const updateCartItemQuantity = async (productId, quantity, userId, isAdmin, targetUser) => {
  try {
    await ensureCartInitialized();
    const userToUpdate = getTargetUserId(userId, isAdmin, targetUser);
    if (!isAdmin) {
      const cartData = await getCartData();
      if (!cartData?.[0]?.[userId] || cartData[0][userId].length === 0) {
        throw new Error("User has not added anything to cart yet!");
      }
    }

    const cart = await getCartData();
    const userCartKey = `${userToUpdate}`;

    if (cart?.[0]?.[userCartKey]) {
      const userCartItems = cart[0][userCartKey];
      const productIndex = userCartItems.findIndex(item => item.productId === productId);
      if (productIndex > -1) {
        const productInformation = await getProductForCartById(productId,quantity);
        cart[0][userCartKey][productIndex].price = quantity*  cart[0][userCartKey][productIndex].price;
        await signalInventory(productId,(cart[0][userCartKey][productIndex].quantity - quantity),"i")
        cart[0][userCartKey][productIndex].quantity = parseInt(quantity);
        await saveCartData(cart);
        logMessage(`Product with id ${productId} updated with quantity ${quantity}`);
        logMessage(cart[0][userCartKey][productIndex])
      } else {
        throw new Error(`Product with id ${productId} could not be found in the cart.`);
      }
    } else {
      const errorMessage = isAdmin && targetUser
        ? `User with id ${targetUser} does not have a cart.`
        : `User with id ${userId} does not have a cart.`;
      throw new Error(errorMessage);
    }
    return cart;
  } catch (error) {
    logError('updateCartItemQuantity', error.message);
    throw error;
  }
};

export const getTotalCart = async (userId, isAdmin, targetUser) => {
  try {
    await ensureCartInitialized();
    const userToRemoveFrom = getTargetUserId(userId, isAdmin, targetUser);
    const actingUserForError = getTargetUserId(userId, isAdmin, targetUser);
    // if isAdmin is true and targetUser is given the userId will be targetUser
    if (!isAdmin) {
      const cartData = await getCartData(); 
      if (!cartData?.[0]?.[userId] || cartData[0][userId].length === 0) {
        throw new Error("User has not added anything to cart yet!");
      }
    }
    const cart = await getCartData();
    const userCartKey = `${userToRemoveFrom}`;
    let total = 0;
    if (cart?.[0]?.[userCartKey]) {


      if(Array.isArray(cart[0][userCartKey])){
        for(let i = 0; i < cart[0][userCartKey].length; i++){
          total += cart[0][userCartKey][i].total;
        }

      }else{
        throw new Error("User has not addded any product yet!")
      }
    }
    console.log("The current total cart is ", total.toFixed(3));
  } catch (error) {
    logError('getTotalCart', error.message);
    throw error;
  }
};
//additional functions
export default function uniqueelement(arr1, arr2) {
  const result = [];
  for (const item1 of arr1) {
    let foundInArr2 = false;
    for (const item2 of arr2) {
      if (
        item1.cartId === item2.cartId &&
        item1.productId === item2.productId &&
        item1.quantity === item2.quantity
      ) {
        foundInArr2 = true;
        break;
      }
    }
    if (!foundInArr2) {
      result.push(item1);
    }
  }
  return result;
}

export const removeCartWithId = async (arr, userId, isAdmin, targetUser) => {
  try {
    await ensureCartInitialized();
    const userToRemoveFrom = getTargetUserId(userId, isAdmin, targetUser);
    const actingUserForError = getTargetUserId(userId, isAdmin, targetUser);

    if (!isAdmin) {
      const cartData = await getCartData(); 
      if (!cartData?.[0]?.[userId] || cartData[0][userId].length === 0) {
        throw new Error("User has not added anything to cart yet!");
      }
    }
    const cart = await getCartData();
    const userCartKey = `${userToRemoveFrom}`;
    if (cart?.[0]?.[userCartKey]) {
      if(Array.isArray(arr) &&   Array.isArray(cart[0][userCartKey])){
        let data = uniqueelement(cart[0][userCartKey],arr)
        if(data.length === 0){
          delete cart[0][userCartKey];
        }else{
          cart[0][userCartKey] = data;
        }  
        console.log(data);
        await saveCartData(cart);
      }
    } else {
      const errorMessage = isAdmin && targetUser
        ? `User with id ${targetUser} does not have a cart.`
        : `User with id ${actingUserForError} does not have a cart.`;
      throw new Error(errorMessage);
    }
    return cart;
  } catch (error) {
    logError('removeProductFromCart', error.message);
    throw error;
  }
};
//node index.js cart remove 30 --targetUser 78
export const removeCartWithProductId = async (arr, userId, isAdmin, targetUser) => {
  try {
    console.log("---------------------")
    await ensureCartInitialized();
    const userToRemoveFrom = getTargetUserId(userId, isAdmin, targetUser);
    const actingUserForError = getTargetUserId(userId, isAdmin, targetUser);
    if (!isAdmin) {
      const cartData = await getCartData(); 
      if (!cartData?.[0]?.[userId] || cartData[0][userId].length === 0) {
        throw new Error("User has not added anything to cart yet!");
      }
    }
    const cart = await getCartData();
    console.log("this cartdata", cart[0][userId][0])
    const userCartKey = `${userToRemoveFrom}`;

    if (cart?.[0]?.[userCartKey]) {
      let yu = []
      if(Array.isArray(arr)){
        for(let i = 0 ; i < cart[0][userId].length;i++){
          if(arr.includes( cart[0][userId][i].productId)){
            yu.push(cart[0][userId][i].productId);
          }
        }
      }
      if(yu.length !==0){
        cart[0][userId] = cart[0][userId].filter(data => !yu.includes(data.productId))
      }
      if(cart[0][userId].length === 0){
        delete cart[0][userId];
      }
      await saveCartData(cart);

      logMessage(`Product removed`);
    } else {
      const errorMessage = isAdmin && targetUser
        ? `User with id ${targetUser} does not have a cart.`
        : `User with id ${actingUserForError} does not have a cart.`;
      throw new Error(errorMessage);
    }
    return cart;
  } catch (error) {
    logError('removeProductFromCart', error.message);
    throw error;
  }
};

