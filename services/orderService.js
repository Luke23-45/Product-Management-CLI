// services/orderService.js

import { readJSONFile, writeJSONFile } from "../utils/fileUtils.js";

import { validateOrderData } from "../utils/validate/orderValidation.js";


const ORDERS_FILE = "../data/orders.json";

let orderIndex = null;


export const initializeOrders = async () => {
  try {
    const order = Object.keys((await readJSONFile(ORDERS_FILE, "o"))[0]);
    console.log(
      "this is order",
      order,
      (await readJSONFile(ORDERS_FILE, "o"))[0]
    );
    orderIndex = {};
    order.forEach((user, index) => {
      orderIndex[user] = index;
    });
    console.log(orderIndex);
  } catch (error) {
    console.error("Error initializing cart:", error.message);
    orderIndex = {};
  }
};

export const getOrders = async (userId, isAdmin, targetUser) => {
  try {
    if (!orderIndex) {
      await initializeCart();
    }
    const index = orderIndex[userId];
    if (index === undefined && !isAdmin) {
      throw new Error("User has not added anything to order yet!");
    }
    const order = await readJSONFile(ORDERS_FILE, "o");
    if (isAdmin) {
      if (!targetUser) {
        return order;
      } else {
        order[0][`${targetUser}`];
      }
    } else {
      return order[0][`${userId}`];
    }
  } catch (error) {
    console.error("Error getting cart:", error.message);
    throw error;
  }
};
function calculateItemsTotal(data) {
  let itemsTotal = 0;
  if (data && data.items && Array.isArray(data.items)) {
    for (const item of data.items) {
      if (item && typeof item.total === 'number') {
        itemsTotal += item.total;
      }
    }
  }
  return itemsTotal;
}
export const createOrder = async (orderData) => {
  try {
    if (!orderIndex) {
      await initializeOrders();
    }
    const validationErrors = validateOrderData(orderData);

    if (validationErrors.length > 0) {
      throw new Error(`Invalid order data: ${validationErrors.join(", ")}`);
    }
    const userId = orderData.userId;
    const index = orderIndex[orderData.userId];
    delete orderData.userId;
    let orders = await readJSONFile(ORDERS_FILE, "o");

    if (index === undefined) {
      // is any order has not been created by user then a new items with be created and orderdata would be assigned to it.
      orders[0][`${userId}`] = orderData;
      const total  = calculateItemsTotal(orders[0][`${userId}`]);
      orders[0][`${userId}`].total = total;
      await writeJSONFile(ORDERS_FILE, orders);
      //    console.log(orders[0][`${userId}`]);
      return orders[0][`${userId}`];
    } else {
      //this runs if user already created the order with different products
      //if product already exists in order and user is trying to add that product from cart as well. Then the existing product order will be replaced by new cart
      let data = orders[0][userId].items;
      if (data !== undefined) {
        let newData = orderData.items;
        orders[0][userId].items = mergeUniqueByProductId(newData, data);
        const total  = calculateItemsTotal(orders[0][`${userId}`]);
        orders[0][`${userId}`].total = total;
        await writeJSONFile(ORDERS_FILE, orders);
        //console.log(orders[0][userId]);
        return orders[0][userId];
      }
    }
  } catch (err) {
    throw new Error("Could not create the order", err.message);
  }
};
function mergeUniqueByProductId(arr1, arr2) {
  const mergedArray = [...arr1];
  const productIdsInArr1 = new Set(arr1.map((item) => item.productId));

  for (const item2 of arr2) {
    if (!productIdsInArr1.has(item2.productId)) {
      mergedArray.push(item2);
      productIdsInArr1.add(item2.productId);
    }
  }
  return mergedArray;
}
export const updateOrder = async (orderData, targetUser) => {
  const isAdmin = orderData.isAdmin;
  const userId = orderData.userId;
  // while updating we do not concern with cart at all. We will focus on updating the values of the order datasets.
  // if you want order to be updated with new informtion from the cart then you can use create command.
  // Here we will just focus on changing the status of product in order.
  try {
    if (!orderIndex) {
      await initializeOrders();
    }
    const userToRemoveFrom = isAdmin && targetUser ? targetUser : userId;
    const actingUserForError = isAdmin && targetUser ? targetUser : userId;
    const order = await readJSONFile(ORDERS_FILE, "o");
    if (!isAdmin) {
      const cartData = order;
      if (!cartData?.[0]?.[userId] || cartData[0][userId].length === 0) {
        throw new Error("User has not added anything to cart yet!");
      }
    }
    const userCartKey = `${userToRemoveFrom}`;
    if (order?.[0]?.[userCartKey]) {
      let data = [];
      console.log(orderData.items, "3333", order[0][userCartKey].items);
      if (
        Array.isArray(orderData.items) &&
        Array.isArray(order[0][userCartKey].items)
      ) {
        for (let i = 0; i < order[0][userCartKey].items.length; i++) {
          if (
            orderData.items.includes(order[0][userCartKey].items[i].productId)
          ) {
            order[0][userCartKey].items[i].status = orderData.status;
          }
        }
      }
      await writeJSONFile(ORDERS_FILE, order);
      return order[0][`${userId}`];
    }
  } catch (error) {
    console.error("Error updating order:", error.message);
    throw error;
  }
};
export const deleteOrder = async (optionData, targetUser) => {
  try {
    if (!orderIndex) {
      await initializeOrders();
    }
    const userId = optionData.userId;
    const isAdmin = optionData.isAdmin;
    const userToRemoveFrom = isAdmin && targetUser ? targetUser : userId;
    const actingUserForError = isAdmin && targetUser ? targetUser : userId;
    const order = await readJSONFile(ORDERS_FILE, "o");

    const userCartKey = `${userToRemoveFrom}`;

    if (order?.[0]?.[userCartKey]) {
      let newArray = [];
      let removedProductIds = [];
      let attemptedToRemoveDone = []; // Keep track of products with 'Done' status that were attempted to remove

      if (Array.isArray(order[0][userCartKey]?.items)) {
        const itemsToFilter = order[0][userCartKey].items;
        for (let i = 0; i < itemsToFilter.length; i++) {
          const item = itemsToFilter[i];
          if (!optionData.producttotal_id.includes(item.productId)) {
            // Keep items whose product ID is NOT in the removal list
            newArray.push(item);
          } else {
            // Handle items whose product ID IS in the removal list
            if (item.status === "Done") {
              console.log(`Product with ${item.productId} has Done status and cannot be removed.`);
              attemptedToRemoveDone.push(item.productId); // Track attempted removal of 'Done' items
              newArray.push(item); // Importantly, keep the 'Done' item in the order
            } else {
              removedProductIds.push(item.productId); // Remove items that are not 'Done'
            }
          }
        }
      }
      console.log("This is new Array", newArray);
      order[0][userCartKey].items = newArray;

      if (removedProductIds.length === 0 && optionData.producttotal_id.length > 0 && attemptedToRemoveDone.length === 0) {
        throw new Error("No matching product IDs found in your order for removal.");
      } else if (removedProductIds.length > 0) {
        console.log(`Removed items with Product IDs: ${removedProductIds.join(', ')} from order for user ${userToRemoveFrom}`);
      } else if (attemptedToRemoveDone.length > 0 && removedProductIds.length === 0 && optionData.producttotal_id.length === attemptedToRemoveDone.length) {
        console.log("No items were removed as the provided product IDs have 'Done' status.");
      } else if (removedProductIds.length === 0 && attemptedToRemoveDone.length > 0 && optionData.producttotal_id.length > attemptedToRemoveDone.length) {
        console.log("Some items were not removed as they have 'Done' status. No other removable items found for the provided IDs.");
      } else if (removedProductIds.length === 0 && optionData.producttotal_id.length > 0 && attemptedToRemoveDone.length === 0) {
          console.log("No matching product IDs found for removal.");
      }

      await writeJSONFile(ORDERS_FILE, order);
      console.log("Order updated after deletion attempt.");
    } else {
      throw new Error(`Order not found for user ID: ${userToRemoveFrom}`);
    }
  } catch (error) {
    console.error("Error deleting order:", error.message);
    throw error;
  }
};


export const getLimitedInformation = () =>{
  
}
export const listOrdersForUser = async (userId, isAdmin, targetUser) => {
  try {
    if (!orderIndex) {
      await initializeOrders();
    }
    const userToRemoveFrom = isAdmin && targetUser ? targetUser : userId;
    const actingUserForError = isAdmin && targetUser ? targetUser : userId;
    const order = await readJSONFile(ORDERS_FILE, "o");
    const userCartKey = `${userToRemoveFrom}`;

    if (order?.[0]?.[userCartKey]) {
      return order[0][userCartKey];
    } else {
      throw new Error("do not have permission.");
    }
  } catch (error) {
    console.error("Error deleting order:", error.message);
    throw error;
  }
};
