import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  initializeProductIndex,
} from '../services/productService.js';
import { hasPermission } from '../services/authService.js';

export const handleProductCommand = async (parsedCommand) => {
  try {
    await initializeProductIndex();

    const { options, subcommand, arguments: args, user } = parsedCommand;
    console.log('---------Product Command--------');
    console.log(options);

    switch (subcommand || args[0]) {
      case 'list':
        if (!user || !await hasPermission('product:view')) {
          console.error('Permission denied: You do not have permission to view products.');
          return;
        }
        const products = await getProducts(user.userId, user.isAdmin);
        console.log(products);
        break;

      case 'get': {
        if (!user || !await hasPermission('product:view')) {
          console.error('Permission denied: You do not have permission to view products.');
          return;
        }
        const id = args[0];
        if (!id) {
          console.error('Error: Product ID is required for the "get" command.');
          return;
        }
        const product = await getProductById(id,user.userId, user.isAdmin);
        console.log(product);
        break;
      }

      case 'add': {
      
        if (!user || !await hasPermission('product:add')) {
          console.error('Permission denied: You do not have permission to add products.');
          return;
        }
        // Extract product details from options
        const userId = String(user.userId);
        const name = options?.name;
        const price = parseFloat(options?.price);
        const description = options?.description;
        const category = options?.category;
        const inventory = parseFloat(options?.inventory);

        if (!name || price === undefined || inventory === undefined) {
          console.error('Error: Name, price, and inventory are required for the "add" command.');
          return;
        }

        const newProduct = await createProduct({
          userId,
          name,
          price,
          description,
          category,
          inventory,
        });
        console.log('Product added:', newProduct);
        break;
      }

      case 'update': {
        if (!user || !await hasPermission('product:update')) {
          console.error('Permission denied: You do not have permission to update products.');
          return;
        }
        const productId = args[0];
        if (!productId) {
          console.error('Error: Product ID is required for the "update" command.');
          return;
        }
        let newData = {};
        const fields = ["name","price", "description", "category", "inventory"]
        for (const key in options) {
          console.log(key); 
          if(fields.includes(key)){
            newData[key] = options[key];
          }else{
            throw new Error(`Invalid field name ${key}`)
          }
        }
        console.log("new dataj", newData)
        for(const key in newData){
          if(key === "name" || key === "description" || key==='category'){
            if(typeof newData[key] !== 'string'){
              throw new Error("Name, description, and category must be a string");
            }
          }
          if(key === "price" || key === 'inventory'){
            if(typeof newData[key] !== 'number'){
              throw new Error("Price, and inventory must be a number");
            }
          }
        }
        const updatedProduct = await updateProduct(productId, newData, user.isAdmin,user.userId);
        console.log('Product updated:', updatedProduct);
        break;
      }

      case 'delete': {
        if (!user || !await hasPermission('product:delete')) {
          console.error('Permission denied: You do not have permission to delete products.');
          return;
        }
        const deleteId = args[0];
        if (!deleteId) {
          console.error('Error: Product ID is required for the "delete" command.');
          return;
        }
        await deleteProduct(deleteId, user.userId,user.isAdmin);
        console.log('Product deleted');
        break;
      }

      default:
        console.error(
          'Error: Invalid product command or subcommand. Valid commands are: list, get, add, update, delete'
        );
    }
  } catch (error) {
    console.error('Error processing product command:', error.message);
  }
};

export default handleProductCommand;