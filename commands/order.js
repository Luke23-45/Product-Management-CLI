// commands/order.js

import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  listOrdersForUser,
  initializeOrders,
} from '../services/orderService.js';
import { hasPermission } from '../services/authService.js'; // Import hasPermission
import { generateId } from '../utils/idGenerator.js';
import { getCart, removeCartWithId} from "../services/cartService.js"


export const handleOrderCommand = async (parsedCommand) => {
  try {
    await initializeOrders(); // Initialize orders

    const { options, subcommand, arguments: args, user } = parsedCommand; // Extract user

    switch (subcommand || args[0]) {
      case 'list':
        if (!user|| !await hasPermission('order:view')) {
          console.error('Permission denied: You do not have permission to view orders.');
          return;
        }
        let targetUser_ =''
        if(options.targetUser){
          await getUserById(options.targetUser)
          targetUser_ = options.targetUser;
        }
        const data = await getOrders(user.userId,user.isAdmin,targetUser_);
        // node index.js order list --userId user123
        console.log(data)
        break;
      case 'create': {
        if (!user || !await hasPermission('order:create')) {
          console.error('Permission denied: You do not have permission to create orders.');
          return;
        }
        const cart_data = await getCart(user.userId);
        if(cart_data.length === 0){
          throw new Error("Cart is empty!")
        }

        options.items = String(options.items)
        
        const selected_items = options.items.split(",");
        const filtered_cart = cart_data.filter(item => selected_items.includes(item.productId));

        if(filtered_cart.length == 0){
          throw new Error("Produts have not added to the cart yet. Please add to cart for order.")
        }
        if(!(options.status === "Pending" || options.status ==="Done")){

          throw new Error('Please enter the valid status - Pending or Done');
        }
        const producttotal_id = [];
        for(let i = 0; i < filtered_cart.length; i++){
          filtered_cart[i].status = options.status;
          producttotal_id.push(parseInt(filtered_cart[i].productId))
        }

        const id = String(await ( generateId('o')));
        const userId = String(user.userId);
        const items = filtered_cart;
        const total = 0;
        const timestamp = Date.now();
  
        
      //  console.log(userId , items, total, timestamp , status)
      

        if (!userId || !items || !timestamp) {
          console.error(
            'Error: userId, items, timestamp, and status are required for "create" command.'
          );
          return;
        }
  
        const newOrder = await createOrder({
          id,
          userId,
          items,
          total,
          timestamp,
        }, user.username);
      console.log('Order created:', newOrder);
        if(newOrder){
          removeCartWithId(filtered_cart,user.userId,user.isAdmin);
        }
        break;
      }
      case 'update': {
        if (!user || !await hasPermission('order:update')) {
          console.error('Permission denied: You do not have permission to update orders.');
          return;
        }
        let targetUser_ =''
        if(options.targetUser){
          await getUserById(options.targetUser)
          targetUser_ = options.targetUser;
        }
        options.items = String(options.items);
        let cart_data = [];
        if(user.isAdmin){
           cart_data = (await getOrders(targetUser_, user.isAdmin))[0];
           cart_data = cart_data[`${targetUser_}`]
        }else{
           cart_data = await getOrders(user.userId);
        }
        if(!cart_data){
          throw new Error("The order is empty!")
        }
        const selected_items = options.items.split(",");
        let filtered_cart = [];
        if(Array.isArray(cart_data.items)){
           filtered_cart = cart_data.items.filter(item => selected_items.includes(item.productId));
        }
        if(!(options.status === "Pending" || options.status ==="Done")){
          throw new Error('Please enter the valid status - Pending or Done');
        }
        if(filtered_cart.length == 0){
          throw new Error("Please select the product first!")
        }
        const producttotal_id = [];
        for(let i = 0; i < filtered_cart.length; i++){
          producttotal_id.push(String(filtered_cart[i].productId))
        }
        const userId = user.userId;
        const items = producttotal_id;
      
        const status = options.status || 'pending';
        const isAdmin = user.isAdmin;
        const updatedOrder = await updateOrder({
          userId,
          items,
          status,
          isAdmin
        },targetUser_);
        break;
      }
      case 'delete': {
        if (!user || !await hasPermission('order:delete')) {
          console.error('Permission denied: You do not have permission to delete orders.');
          return;
        }
        let targetUser_ =''
        if(options.targetUser){
          await getUserById(options.targetUser)
          targetUser_ = options.targetUser;
        }
      
        let cart_data = [];
        if(user.isAdmin){
           cart_data = (await getOrders(targetUser_, user.isAdmin))[0];
           cart_data = cart_data[`${targetUser_}`]
        }else{
           cart_data = await getOrders(user.userId,user.isAdmin);
        }
      
        if(!cart_data){
          throw new Error("The order is empty!")
        }
        let selected_items = '';
        if(options.items){
          selected_items = options.items.split(",");
        }
      
        let filtered_cart = [];
        if(Array.isArray(cart_data.items)){
           filtered_cart = cart_data.items.filter(item => selected_items.includes(item.productId));
        }
        const producttotal_id = [];
        for(let i = 0; i < filtered_cart.length; i++){
          producttotal_id.push(String(filtered_cart[i].productId))
        }
        if(producttotal_id.length === 0){
          throw new Error("Please enter the valid product ID");
        }
        const userId = user.userId;
        const isAdmin = user.isAdmin;
      
        await deleteOrder({
          userId,
          producttotal_id,
          isAdmin
        },targetUser_);
      //  await deleteOrder(user.userId,user.isAdmin,targetUser_);
        console.log('Order deleted');
        break;
      }
      default:
        console.error('Error: Invalid order command or subcommand.');
    }
  } catch (error) {
    console.error('Error processing order command:', error.message);
  }
};

export default handleOrderCommand;