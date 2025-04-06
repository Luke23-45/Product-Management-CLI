// index.js
import { parseArgs, showHelp } from '../lib/parser.js';
import handleProductCommand from '../commands/product.js';
import handleCartCommand from '../commands/cart.js';
import handleOrderCommand from '../commands/order.js';
import { login, register, getSessionUser, clearSessionUser as logout  } from '../services/authService.js'; 


const commands = {
  product: handleProductCommand,
  cart: handleCartCommand,
  order: handleOrderCommand,
};

async function run() {
  const args = process.argv.slice(2);
  const parsed = parseArgs(args);

  console.log(parsed);

  if (!parsed.command) {
    console.error('No command provided.\n');
    showHelp();
    process.exit(1);
  }

  switch (parsed.command) {
    case 'login':
      if (parsed.options.username && parsed.options.password) {
        try {
          const user = await login(parsed.options.username, parsed.options.password);
          if (user) {
            console.log('Login successful!');
          } else {
            console.log('Login failed!');
          }
        } catch (error) {
          console.error(error.message);
        }
      } else {
        console.error('Username and password are required for login.');
      }
      break;
    case 'logout':
      try {
        await logout();
        console.log('Logout successful!');
      } catch (error) {
        console.error(error.message);
      }
      break;
    case 'register':
      if (parsed.options.username && parsed.options.password) {
        try {
          const user = await register(parsed.options.username, parsed.options.password, parsed.options.permissions);
          if (user) {
            console.log('Registration successful!');
          } else {
            console.log('Registration failed!');
          }
        } catch (error) {
          console.error(error.message);
        }
      } else {
        console.error('Username and password are required for registration.');
      }
      break;
    default:
      try {
        const sessionUser = await getSessionUser();
        if (!sessionUser) {
          console.error('You must be logged in to perform this action.');
          return;
        }
        
        if (commands[parsed.command]) {
          commands[parsed.command]({
            options: parsed.options,
            subcommand: parsed.subcommand,
            arguments: parsed.arguments,
            user: sessionUser,
          });
        } else {
          console.error(`Unknown command: ${parsed.command}\n`);
          showHelp();
          process.exit(1);
        }
      } catch (error) {
        console.error('Error processing command:', error.message);
      }
  }
}

run();