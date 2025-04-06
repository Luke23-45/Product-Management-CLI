import {
  getCart,
  addProductToCart,
  removeProductFromCart,
  updateCartItemQuantity,
  getTotalCart,
  initializeCart,
} from '../services/cartService.js';
import { getUserById, hasPermission } from '../services/authService.js'; 
import { getProductForCartById } from '../services/productService.js';

export const handleCartCommand = async (parsedCommand) => {
  try {
    await initializeCart(); 
    const { options, subcommand, arguments: args, user } = parsedCommand; 
    if (!user) {
      console.error('You must be logged in to perform cart operations.');
      return;
    }

    switch (subcommand || args[0]) {
      case 'view':
        if (!user || !await hasPermission('cart:view')) {
          console.error('Permission denied: You do not have permission to view the cart.');
          return;
        }
        let targetUser_ =''
        if(options.targetUser){
          await getUserById(options.targetUser)
          targetUser_ = options.targetUser;
        }
        const cart = await getCart(user.userId,user.isAdmin,targetUser_);
        console.log(cart);
        break;
      case 'add': {
        if (!user && !await hasPermission('cart:add')) {
          console.error('Permission denied: You do not have permission to add products to the cart.');
          return;
        }
        // node index.js cart add <productId> --quantity 2
        const productId = args[0];
        const quantity = parseInt(options.quantity);
        if (!productId || quantity === undefined) {
          console.error('Error: Product ID and quantity are required for "add" command.');
          return;
        }
        await addProductToCart(productId, quantity, user.userId, user.isAdmin);
        break;
      }
      case 'remove': {
        if (!user && !await hasPermission('cart:remove')) {
          console.error('Permission denied: You do not have permission to remove products from the cart.');
          return;
        }
        
        // node index.js cart remove <productId>
        const productId = args[0];
        if (!productId) {
          console.error('Error: Product ID is required for "remove" command.');
          return;
        }
        productId = String(productId);
        await getProductForCartById(productId,10);
        let targetUser_ =''
        if(options.targetUser){
          await getUserById(options.targetUser)
          targetUser_ = options.targetUser;
        }
        await removeProductFromCart(productId, user.userId,user.isAdmin, targetUser_);
        break;
      }
      case 'update': {
        if (!user && !await hasPermission('cart:update')) {
          console.error('Permission denied: You do not have permission to update the cart.');
          return;
        }
        // node index.js cart update <productId> --quantity 5
        const productId = args[0];
        const quantity = options.quantity;

        if (!productId || quantity === undefined) {
          console.error('Error: Product ID and quantity are required for "update" command.');
          return;
        }
        let targetUser_ =''
        if(options.targetUser){
          await getUserById(options.targetUser)
          targetUser_ = options.targetUser;
        }
        await updateCartItemQuantity(productId, quantity, user.userId,user.isAdmin, targetUser_);
        break;
      }
      case 'total':
        if (!await hasPermission('cart:view')) {
          console.error('Permission denied: You do not have permission to view the cart total.');
          return;
        }
        let user_name =''
        if(options.targetUser){
          console.log("shit")
          await getUserById(options.targetUser)
          user_name = options.targetUser;
        }
        await getTotalCart(user.userId,user.isAdmin, user_name);
        break;
      default:
        console.error('Error: Invalid cart command or subcommand.');
    }
  } catch (error) {
    console.error('Error processing cart command:', error.message);
  }
};

export default handleCartCommand;