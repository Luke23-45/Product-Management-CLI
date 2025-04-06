const UTILS_FILE = '../data/utils.json';
import { readJSONFile, writeJSONFile } from '../utils/fileUtils.js';

const initializeSession = async () => {
  let data;
  try {
    data = await readJSONFile(UTILS_FILE);
    if (!data || typeof data !== "object") {
      data = { productId: 0, orderId: 0, cartId: 0, userId: 0 };
      await writeJSONFile(UTILS_FILE, data);
      console.log("Initialized utils.json with default values.");
    }
  } catch (error) {
    console.error('Error initializing session:', error.message);
    data = { productId: 0, orderId: 0, cartId: 0, userId: 0 };
    await writeJSONFile(UTILS_FILE, data);
  }
  return data;
};

export const generateId = async (flag) => {
  let data = await initializeSession();
  console.log("Before update:", data);
  let id = 0;
  switch (flag) {
    case "p":
      data.productId += 1;
      id = data.productId;
      break;
    case "o":
      data.orderId += 1;
      id = data.orderId;
      break;
    case "c":
      data.cartId += 1;
      id = data.cartId;
      break;
    case "u":
      data.userId += 1;
      id = data.userId;
      break;
  }
  await writeJSONFile(UTILS_FILE, data);
  return id;  
};


