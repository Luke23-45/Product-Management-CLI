// services/cartValidation.js


export const validateCartData = (cartData) => {
  const errors = [];

  if (!cartData) {
    errors.push('Cart data is required.');
    return errors; 
  }
  if (!cartData.productId) {
    errors.push('Product ID is required.');
  } else if (typeof cartData.productId !== 'string') {
    errors.push('Product ID must be a string.');
  }

  if(!cartData.userId){
    errors.push("user is required!");
  }else if(typeof cartData.userId !== 'string') {
    errors.push('username must be a string.');
  }

  if (cartData.quantity === undefined) {
    errors.push('Quantity is required.');
  } else if (typeof cartData.quantity !== 'number') {
    errors.push('Quantity must be a number.');
  } else if (cartData.quantity <= 0) {
    errors.push('Quantity must be greater than zero.');
  }

  return errors;
};