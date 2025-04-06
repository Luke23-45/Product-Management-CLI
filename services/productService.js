
// services/productService.js

import { readJSONFile, writeJSONFile } from '../utils/fileUtils.js';
import { generateId } from '../utils/idGenerator.js';
import { validateProductData } from '../utils/validate/productValidation.js'; 

const PRODUCTS_FILE = './../data/products.json';

let productIndex = null; 

export const initializeProductIndex = async () => {
  try {
    const products = await readJSONFile(PRODUCTS_FILE, "p");
    productIndex = {};
    products.forEach((product, index) => {
      productIndex[product.id] = index;
    });
  } catch (error) {
    console.error('Error initializing product index:', error.message);
    productIndex = {}; 
  }
};

export const getProductTotal =async(data) =>{
  try{
    if(!productIndex){
      await initializeProductIndex();
    }
    const products = await readJSONFile(PRODUCTS_FILE,'p');
    let total = 0;
    for(let i = 0; i < data.length ; i++){
      let index = productIndex[data[i]];
      if(index === undefined){
        throw new Error("Invalid product key found!")
      }else{
        total += parseInt(products[index].price)
      }
    }
    return total;
  }catch(err){
    console.error('Error getting products total', err.message);
    throw err;
  }

}

export const getProducts = async (userId, isAdmin) => {
  try {
    if (!productIndex) {
      await initializeProductIndex();
    }
    
    if(isAdmin){
      return (await readJSONFile(PRODUCTS_FILE,'p'));
    }else{
      let data = await readJSONFile(PRODUCTS_FILE,'p');

      data = data.filter(data => data.userId === userId)
      if(data.length == 0){
        throw new Error("User has not added any product yet!")
      }
      return await data;
    }
  } catch (error) {
    console.error('Error getting products:', error.message);
    throw error;
  }
};
// this function reduce the inventory stock after the product added to cart.
export const signalInventory = async (productId,quantity,flag) =>{
  try{
    if (!productIndex) {
      await initializeProductIndex();
    }
    const products = await readJSONFile(PRODUCTS_FILE,'p');
    const index = productIndex[productId];
    if (index === undefined) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    let product = products[index];
    if(flag === 'r'){
      product.inventory -= quantity;
    }
    if(flag === 'i'){
      product.inventory += quantity;
    }

    products[index] = { ...product };
    await writeJSONFile(PRODUCTS_FILE, products);
  
  }catch(err){
    throw new Error("Error in the inventory system!")
  }
}

export const getProductForCartById = async (id,quantity)=>{
  if (!productIndex) {
    await initializeProductIndex();
  }
  const products = await readJSONFile(PRODUCTS_FILE,'p');
  const index = productIndex[id];
  if (index === undefined) {
    throw new Error(`Product with ID ${id} not found`);
  }
  const product = products[index];
  if(product.inventory < quantity ){
    throw new Error(`Product does not have ${quantity} item in inventory. The stock contains ${product.inventory}`);
  }
  return products[index];
}

export const getProductById = async (id, userId, isAdmin) => {
  try {
    if (!productIndex) {
      await initializeProductIndex();
    }
    const products = await readJSONFile(PRODUCTS_FILE,'p');
    const index = productIndex[id];
    if (index === undefined) {
      throw new Error(`Product with ID ${id} not found`);
    }
    if(isAdmin){
      return products[index];
    }else{
      const products = await readJSONFile(PRODUCTS_FILE,'p');
      if((products[index].userId) === (userId)){
        return products[index];
      }else{
        throw new Error("You do not have permission.")
      }
    }
  } catch (error) {
    console.error('Error getting product by ID:', error.message);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    if (!productIndex) {
      await initializeProductIndex();
    }
    if (validateProductData) {
      const validationErrors = validateProductData(productData);
      if (validationErrors.length > 0) {
        throw new Error(`Invalid product data: ${validationErrors.join(', ')}`);
      }
    }
    const products = await readJSONFile(PRODUCTS_FILE,'p');
    const newProductId = String(await generateId('p'));
    const newProduct = { id: newProductId, ...productData };
    products.push(newProduct);
    await writeJSONFile(PRODUCTS_FILE, products);

    // Update the index
    productIndex[newProductId] = products.length - 1;

    return newProduct;
  } catch (error) {
    console.error('Error creating product:', error.message);
    throw error;
  }
};


export const updateProduct = async (id, productData,isAdmin,userId) => {
  
  try {
    if (!productIndex) {
      await initializeProductIndex();
    }

    const index = productIndex[id];
    if (index === undefined) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    const products = await readJSONFile(PRODUCTS_FILE,'p');

    if(products[index].userId === userId || isAdmin ){
      console.log("product updated before",products[index] )
      for (const key in productData) {
        if (productData.hasOwnProperty(key)) {
          products[index][key] = productData[key];
        }
      }
      await writeJSONFile(PRODUCTS_FILE, products);
  
      return products[index];
    }else{
      throw new Error("You do not have permission to update this product");
    }

  } catch (error) {
    console.error('Error updating product:', error.message);
    throw error;
  }
};


export const deleteProduct = async (id,userId,isAdmin) => {
  try {
    if (!productIndex) {
      await initializeProductIndex();
    }

    const index = productIndex[id];
    if (index === undefined) {
      throw new Error(`Product with ID ${id} not found`);
    }

    const products = await readJSONFile(PRODUCTS_FILE,'p');

    if(products[index].userId === userId|| isAdmin){
      products.splice(index, 1);
      await writeJSONFile(PRODUCTS_FILE, products);
    }else{
      throw new Error("You do not have permission to delete this product.")
    }


    // Update the index after deletion
    await initializeProductIndex();
  } catch (error) {
    console.error('Error deleting product:', error.message);
    throw error;
  }
};