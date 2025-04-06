- **Introduction**
- **Getting Started**
    - Prerequisites
    - Installation
- **File Structure Overview**
- **Parser**
- **User Authentication and Authorization**
- **Core Functionality**
    - Product Management
        - Listing Products
        - Getting a Product by ID
        - Adding a Product
        - Updating a Product
        - Deleting a Product
    - Cart Management
        - Viewing Cart
        - Adding Product to Cart
        - Removing Product from Cart
        - Updating Cart Item Quantity
        - Calculating Cart Total
    - Order Management
        - Creating an Order
        - Listing Orders for User
        - Getting an Order by ID
        - Updating Order Status
        - Deleting an Order
- **User Authentication and Authorization**
    - Registration
    - Login
    - Logout
    - Permissions
- **File Structure**
    - Root Directory
    - `lib/`
    - `commands/`
    - `services/`
    - `utils/`
    - `data/`
- **Utilities**
    - Parser (`lib/parser.js`)
    - File Utilities (`utils/fileUtils.js`)
    - ID Generator (`utils/idGenerator.js`)
    - Validation (`utils/validate/`)
- **Error Handling**
- **Security Considerations**
    - Password Hashing
    - Session Management 
    - Input Validation


## **Introduction**

This document provides a comprehensive guide to the Product Management Command Line Interface (CLI), a  tool designed to streamline the management of products, shopping carts, and orders. 

**Key Highlights:**
- **Secure User Sessions:** The CLI employs user sessions to maintain login status across operations, improve user experience.
- **Authentication:** An authentication system allows users to log in and access authorized functionalities.
- **Permission Control:** The CLI implements a permission-based system, ensuring that users can only perform actions they are authorized to, supporting different roles and responsibilities.
- **Administrative Capabilities:** Specific administrative features enable privileged users to manage core aspects of the system.
- **Efficient Command Parsing:** An integrated command parser simplifies the process of interpreting user input, making the CLI easy to use.
- **Optimized Data Retrieval:** For product searches, the CLI utilizes an index-based hashing mechanism, providing fast and efficient data retrieval.
## **Getting Started**

This section will guide you through the necessary prerequisites and the installation process to get your Product Management CLI up and running.
### Prerequisites

Before you begin, ensure that you have the following software installed on your system:

- **Node.js:** The Product Management CLI is built using Node.js. You will need Node.js version 16 or higher installed. You can download it from the official Node.js website: [https://nodejs.org/](https://nodejs.org/)
    
- **npm (Node Package Manager):** npm comes bundled with Node.js. You will use npm to install the CLI's dependencies. You can verify your npm installation by running the following command in your terminal:
    ```Bash
    npm -v
    ```
### Installation

The Product Management CLI is designed to be run directly from its source code. Follow these steps to install and set up the CLI:

1. **Clone the Repository:** If you haven't already, clone the repository containing the CLI's source code to your local machine using Git:
    ```Bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2. **Running the CLI:** Once the dependencies are installed, you can run the CLI using the following command in your terminal from the project's root directory:
     
    ```bash
    cd bin
    node index.js <command> [subcommand] [options] [arguments]
    ```
    
Replace `<command>`, `[subcommand]`, `[options]`, and `[arguments]` with the specific actions you want to perform. You can start by running the help command to see the available options:
## File Structure Overview

The project follows a well-defined file structure to organize the codebase and separate concerns. Below is an overview of each directory and its key files:

**Root Directory (`/`)**

- `package.json`: This file contains metadata about the project.
- `README.md`: This file serves as the entry point for understanding the project. 

**`bin/`**

- `index.js`: This is the main executable file for the CLI application. When you run commands like `node index.js product list`, this script is the entry point that parses the arguments and dispatches them to the appropriate command handlers.

**`commands/`**

This directory contains files that define the logic for different CLI commands. Each file typically handles a specific feature area.

- `cart.js`: Handles commands related to the shopping cart, such as adding items, removing items, viewing the cart, updating quantities, and calculating the total.
- `order.js`: Handles commands related to order management, such as creating new orders, listing orders, retrieving specific orders, updating order statuses, and deleting orders.
- `product.js`: Handles commands related to product management, such as listing products, getting product details, adding new products, updating existing products, and deleting products.

**`data/`**

This directory stores the JSON files that serve as the data storage for the CLI.

- `cart.json`: Stores the data related to the shopping cart, including items and their quantities.
- `orders.json`: Stores the data for all the orders placed through the CLI.
- `products.json`: Stores the information about the available products, including details like name, ID, price, etc.
- `sessionuser.json`: Stores the information of the currently logged-in user. This file is used to maintain user sessions.
- `users.json`: Stores the user credentials and permissions for all users of the CLI.
- `utils.json`: This filename contains general data about the project like IDs.

**`docs/`**

This directory contains documentation-related files.

**`lib/`**
This directory contains core library files that provide fundamental functionalities to the CLI.
- `parser.js`: This file contains the logic for parsing the command-line arguments provided by the user, breaking them down into commands, subcommands, options, arguments.

**`services/`**

This directory contains files that encapsulate the business logic of the application. Each file typically handles operations related to a specific feature area.

- `authService.js`: Handles user authentication (login, logout, registration) and authorization (checking permissions).
- `cartService.js`: Contains the business logic for managing the shopping cart, such as adding, removing, updating items, and calculating totals.
- `orderService.js`: Contains the business logic for managing orders, such as creating, listing, getting, updating, and deleting orders.
- `productService.js`: Contains the business logic for managing products, such as listing, getting, adding, updating, and deleting products.

**`tests/`**

This directory contains test files used to ensure the functionality of different parts of the CLI works as expected.

- `fileutils/`: Contains test files specifically for the `fileUtils.js` module.


**`utils/`**

This directory contains utility functions that are used across different parts of the application.

- `fileUtils.js`: Contains functions for reading from and writing to JSON files, as well as checking if a file exists and ensuring a file exists with default data.
- `idGenerator.js`: Contains a function to generate unique IDs for entities like products, users, or orders.
- `timestamp.js`: This file contains a function to generate timestamps.
- `validate/`: Contains files related to input validation.
    - `cartValidation.js`: Contains validation rules and functions for cart-related data.
    - `orderValidation.js`: Contains validation rules and functions for order-related data.
    - `productValidation.js`: Contains validation rules and functions for product-related data.
## Parser


Examples of how parser parsed the cli commands into structural object. 
**Command:** `product list`
**Parsed Object:**

```JSON
{
  "command": "product",
  "subcommand": "list",
  "arguments": [],
  "options": {}
}
```

**Example 2: Getting details of a specific product by ID**

**Command:** `product get 123`

**Parsed Object:**

```JSON
{
  "command": "product",
  "subcommand": "get",
  "arguments": ["123"],
  "options": {}
}
```

**Example 3: Adding a product to the cart with a short option for quantity**

**Command:** `cart add 456 -q 3`

**Parsed Object:**

```JSON
{
  "command": "cart",
  "subcommand": "add",
  "arguments": ["456"],
  "options": {
    "q": "3"
  }
}
```

**Example 4: Updating a product with long options for name and price**

**Command:** `product update 789 --name "New Name" --price 25.99`

**Parsed Object:**

```JSON
{
  "command": "product",
  "subcommand": "update",
  "arguments": ["789"],
  "options": {
    "name": "New Name",
    "price": "25.99"
  }
}
```

**Example 5: Listing completed orders with a boolean option**

**Command:** `order list --completed`

**Parsed Object:**

```JSON
{
  "command": "order",
  "subcommand": "list",
  "arguments": [],
  "options": {
    "completed": true
  }
}
```

**Example 6: Updating a cart item with arguments and options**

**Command:** `cart update 101 --quantity 5 --note "Urgent"`

**Parsed Object:**

```JSON
{
  "command": "cart",
  "subcommand": "update",
  "arguments": ["101"],
  "options": {
    "quantity": "5",
    "note": "Urgent"
  }
}
```

**Example 7: Logging in a user**

**Command:** `users login --username testuser --password secret`

**Parsed Object:**

```JSON
{
  "command": "users",
  "subcommand": "login",
  "arguments": [],
  "options": {
    "username": "testuser",
    "password": "secret"
  }
}
```

**Example 8: Removing a product from the cart using an argument**

**Command:** `cart remove 101`

**Parsed Object:**

```JSON
{
  "command": "cart",
  "subcommand": "remove",
  "arguments": ["101"],
  "options": {}
}
```

## User Authentication and Authorization

This section details the user authentication and authorization mechanisms implemented in the Product Management CLI. These features ensure that only authenticated users can access the CLI's functionalities and that their actions are limited based on their assigned permissions.
### Registration

User registration allows new users to create an account and gain access to the CLI.

**Purpose:** To enable new individuals to become users of the Product Management CLI by providing a unique username and password. Optionally, during registration, users can be assigned a set of permissions that define what actions they are allowed to perform. 

## User Permissions

The Product Management CLI employs a permission system to control access to various functionalities and data. This ensures that users can only perform actions they are authorized to, while also protecting user data from unauthorized access. The system utilizes a combination of explicit permissions assigned to each user and an `isAdmin` flag to define different levels of access and roles.

**1. Standard User Permissions and Data Protection:**

Each user in the system is associated with a set of permissions, which are explicitly granted to them. These permissions define the operations that the user is allowed to perform within the CLI.

- **Operation-Based Permissions:** Permissions are typically defined based on the action a user might want to take, often following a pattern like `<resource>:<action>`. For example:
    
    - `product:view`: Allows a user to view product details.
    - `cart:update`: Allows a user to add, remove, or modify items in their own cart.
    - `order:create`: Allows a user to create new orders.
    - `order:view`: Allows a user to view their own order history.
- **Data Isolation:** By default, users can only access and modify their own data. For instance, a user logged in will only be able to view their own shopping cart or their own order history. They will not have access to the cart or order data of other users unless explicitly granted administrative privileges.
    
**Example:**

Consider two users: Alice and Bob.

- Alice has the following permissions: `["product:view", "cart:view", "cart:update", "order:create", "order:view"]`.
    
    - Alice can view product details.
    - Alice can view and update her own shopping cart.
    - Alice can create new orders and view her own order history.
    - Alice cannot add new products, delete products, or view Bob's cart.
- Bob has the following permissions: `["product:view", "order:view"]`.
    - Bob can view product details.
    - Bob can view his own order history.
    - Bob cannot modify his cart, create new orders, or view Alice's order history.

**2. Administrator Permissions (`isAdmin: true`):**

Users with the `isAdmin` field set to `true` have elevated privileges within the system.

- **Access to All User Data:** Administrators have the ability to access and view data belonging to all users. 
- **Permission-Based Operations on Other User Data:** While administrators have access to all user data, they still require explicit permissions to perform _operations_ on that data. This means that even if a user is an administrator, they need specific permissions listed in their `permissions` field to, for example, update another user's order status or delete another user's cart.

**Example:**

Consider a user named Admin with `isAdmin: true` and the following permissions: `["product:create", "product:update", "product:delete", "order:view", "order:update:status", "user:view", "cart:view"]`.

- Admin can create, update, and delete products (as these are general product management permissions).
- Admin can view all orders in the system.
- Admin can update the status of any order (`order:update:status`).
- Admin can view the details of all users (`user:view`).
- Admin can view the shopping carts of all users (`cart:view`).

However, if Admin wanted to _delete_ another user's cart, they would need to have the `cart:delete` permission in their permissions list, even though they have `isAdmin: true` and can view all carts. This ensures that even administrative actions require explicit authorization.

**3. Creating Multiple Roles or Staff:**

The combination of specific permissions and the `isAdmin` flag allows for the creation of various roles and staff with different levels of access and capabilities.

- **Standard User:** `isAdmin: false`, with a limited set of permissions related to their own actions (e.g., viewing products, managing their cart, placing orders).
- **Product Manager:** `isAdmin: false`, with permissions like `product:view`, `product:create`, `product:update`, `product:delete`. They can manage products but might not have access to user or order data.
- **Order Processor:** `isAdmin: false`, with permissions like `order:view`, `order:update:status`. They can view and update the status of orders but might not be able to manage products or user accounts.
- **Administrator:** `isAdmin: true`, with a broad set of permissions allowing them to manage all aspects of the system, including products, orders, users, and potentially other administrative tasks. The specific permissions granted to an administrator can be tailored based on their responsibilities.

``` javascript
const permissions = [
  // Product Permissions

  "product:create",

  "product:view",

  "product:update",

  "product:delete",

  // Cart Permissions

  "cart:view",

  "cart:add",

  "cart:remove",

  "cart:update",

  // Order Permissions

  "order:create",

  "order:view",

  "order:update",

  "order:delete",

];
```
**Command Example:**

To register a new user, use the `register` command followed by the `--username` and `--password` options. You can also specify permissions using the `--permissions` option as a comma-separated list.

```Bash
node index.js register --username newuser --password securepassword --permissions "product:view,cart:view"
```

- `--username`: Specifies the desired username for the new user.
- `--password`: Specifies the password for the new user's account.
- `--permissions`:  A comma-separated list of permissions to assign to the new user. If omitted, the user might be assigned a default set of permissions.

**Implementation:**

1. The `index.js` file handles the `register` command and extracts the username, password, and permissions from the command-line arguments.
2. It then calls the `register` function in `authService.js`, passing these details.
3. The `register` function in `authService.js`:
    - Reads the existing user data from the `users.json` file.
    - Checks if the provided username already exists. If so, it returns an error.
    - If the username is unique, it generates a new user ID.
    - It then (insecurely, for demonstration purposes) hashes the provided password using the `simpleHash` function. 
    - Creates a new user object with the generated ID, username, isAdmin, hashed password, and provided permissions.
    - Appends the new user object to the user data and writes the updated data back to the `users.json` file.
### Login

User login allows existing registered users to authenticate themselves and establish a session to use the CLI's protected functionalities.

**Purpose:** To verify the identity of a user by checking their provided username and password against the stored credentials. Upon successful authentication, a session is established, allowing the user to perform authorized actions.

**Command Example:**

To log in, use the `login` command followed by the `--username` and `--password` options.

```Bash
node index.js login --username newuser --password securepassword
```

- `--username`: Specifies the username of the user attempting to log in.
- `--password`: Specifies the password for the user's account.

**Implementation:**

1. The `index.js` file handles the `login` command and extracts the username and password from the command-line arguments.
2. It then calls the `login` function in `authService.js`, passing these details.
3. The `login` function in `authService.js`:
    - Reads the user data from the `users.json` file.
    - Searches for a user with the provided username.
    - If a user with the given username is found, it hashes the provided password using the `simpleHash` function and compares it to the stored hashed password. 
    - If the passwords match, the function stores the user's essential information (userId, username, isAdmin, permissions) in the `sessionuser.json` file using the `setSessionUser` function, effectively establishing a session.
    - The function returns the user object upon successful login.

### Logout

User logout allows a currently logged-in user to terminate their session.
The session user's data will be removed from "setSessionUser.json" file.

**Command Example:**

To log out, use the `logout` command.

```bash
node index.js logout
```

**Implementation:**

1. The `index.js` file handles the `logout` command.
2. It then calls the `logout` function in `authService.js`.
3. The `logout` function in `authService.js`:
    - Calls the `clearSessionUser` function, which writes an empty JSON object `{}` to the `sessionuser.json` file, effectively clearing the session.

### Permissions

The Product Management CLI employs a permission-based authorization system to control what actions each user is allowed to perform. Permissions are associated with user accounts and are checked before executing certain commands.

**Purpose:** To enforce access control and ensure that users can only interact with the features and data they are authorized to use.

**Permission Structure:**

Permissions are typically defined as strings following a convention, such as `<resource>:<action>`. For example:

- `product:view`: Allows viewing product information.
- `product:add`: Allows adding new products.
- `cart:view`: Allows viewing the shopping cart.
- `order:create`: Allows creating new orders.

The sample user data provided illustrates how permissions are stored as an array of strings within a user object:


```JSON
{
  "userId": "78",
  "username": "krishna__",
  "isAdmin": false,
  "permissions": [
    "product:view",
    "product:add",
    "product:update",
    "product:delete",
    "cart:view",
    "cart:add",
    "cart:remove",
    "cart:update",
    "order:create",
    "order:view",
    "order:update",
    "order:delete"
  ]
}
```

In this example, the user "krishna__" has permissions to view, add, update, and delete products; view, add, remove, and update the cart; and create, view, update, and delete orders. 

**Command Examples Demonstrating Permissions:**

- **Viewing Products (Requires `product:view` permission):**
    ```Bash
    node index.js product list
    ```
    
    If the logged-in user does not have the `product:view` permission, this command will be denied.
    
- **Adding a Product to Cart (Requires `cart:update` permission):**
    ```Bash
    node index.js cart add 123 --quantity 1
    ```
    
    If the logged-in user does not have the `cart:update` permission, they will not be able to add items to their cart.
    
**Implementation:**

1. Before executing any protected command (i.e., commands other than `login`, `logout`, and `register`), the `index.js` file retrieves the currently logged-in user's information by calling `getSessionUser` from `authService.js`.
2. The `getSessionUser` function reads the user data from `sessionuser.json`.
3. The `index.js` then passes the retrieved user object to the appropriate command handler in the `commands/` directory.
4. Within each command handler (e.g., `cart.js`, `product.js`, `order.js`), before performing any action, the `hasPermission` function from `authService.js` is called to check if the logged-in user has the required permission for that specific operation.
5. The `hasPermission` function:
    - Takes the required permission string as an argument.
    - Retrieves the logged-in user's information using `getSessionUser`.
    - Checks if the `user.permissions` array exists and includes the requested permission string.
    - Returns `true` if the permission is granted, and `false` otherwise.
6. If `hasPermission` returns `false`, the command handler will log an "Permission denied" error and prevent the action from being executed.

### Product List

```bash
node index.js product list
```
- **Description:** This command is used to list products. The behavior of this command depends on the current session user's role and permissions.
- **Permission Required:** `product:view`
- **Behavior:**
    - **For a regular session user:** This command will return a list of all products that were added by the currently logged-in user. Each product in the system has a `userId` field that stores the identifier of the user who created it. The command filters the product list to show only those where the `userId` matches the `userId` of the current session user.
    - **If there is no active session user:** If no user is currently logged in and a session cannot be identified, the command will return a permission denied error.
    - **For an administrator (`isAdmin: true`):** If the current session user has the `isAdmin` flag set to `true`, they will have access to view products added by all users in the system, provided they also have the `product:view` permission. If an administrator does not have the `product:view` permission, they will also receive a permission denied error.
- **Example Usage:**

    ```Bash
    node index.js product list
    ```
    
- Potential Output (for a regular session user who has added products):
    Assuming the current session user's userId is user123:
    ```JSON
    [
      {
        "id": "PROD001",
        "userId": "user123",
        "name": "My First Product",
        "price": 19.99,
        "description": "A product added by the current user.",
        "category": "Example",
        "inventory": 10
      },
      {
        "id": "PROD005",
        "userId": "user123",
        "name": "Another Great Item",
        "price": 49.50,
        "description": "Another product created by this user.",
        "category": "Showcase",
        "inventory": 25
      }
    ]
    ```
    
- **Potential Output (for a regular session user who has not added any products):**
    
    ```
    Error processing product command: User has not added any product yet!
    ```
    
- **Potential Output (if there is no active session user):**
    
    ```
    Permission denied: You do not have permission to view products.
    ```
    
- ** Output (for an administrator with `isAdmin: true` and `product:view` permission, showing products from all users):**

    ```JSON
    [
      {
        "id": "PROD001",
        "userId": "user123",
        "name": "My First Product",
        "price": 19.99,
        "description": "A product added by user123.",
        "category": "Example",
        "inventory": 10
      },
      {
        "id": "PROD002",
        "userId": "adminUser",
        "name": "Admin Product A",
        "price": 99.00,
        "description": "A product added by an administrator.",
        "category": "Admin",
        "inventory": 5
      },
      {
        "id": "PROD005",
        "userId": "user123",
        "name": "Another Great Item",
        "price": 49.50,
        "description": "Another product created by user123.",
        "category": "Showcase",
        "inventory": 25
      }
      // ... potentially more products from other users
    ]
    ```
    
- **Potential Output (for an administrator with `isAdmin: true` but without `product:view` permission):**
    
    ```
    Permission denied: You do not have permission to view products.
    ```

### `product get <productId>`
```bash
node index.js product get <productId>
node index.js product get 121
```

- **Description:** This command retrieves the details of a specific product using its unique ID. The command verifies the existence of the product and ensures that the current session user has the necessary permissions to view it.
    
- **Permission Required:** `product:view`
    
- **Arguments:**
    
    - `<productId>`: The ID of the product to retrieve.
- **Behavior:**
    
    1. **Product Existence Check:** The command first attempts to find a product with the provided `<productId>`.
    2. **Regular User Authorization:** If a product with the given ID is found and the current session user is not an administrator (`isAdmin: false`):
        - The command checks if the `userId` field of the retrieved product matches the `userId` of the current session user.
        - If the `userId` values match, the product details are returned.
        - If the `userId` values do not match, an error indicating insufficient permissions will be displayed.
    3. **Administrator Access (`isAdmin: true`):** If the current session user has the `isAdmin` flag set to `true`:
        - The command will check if the administrator has the `product:view` permission.
        - If the administrator has the permission, the product details will be returned if a product with the given ID is found, **regardless of the product's `userId`**. The administrator has the privilege to view all product data.
        - If the administrator does not have the `product:view` permission, a permission denied error will be displayed.
    4. **Product Not Found:** If no product exists with the provided `<productId>`, an error message indicating that the product was not found will be displayed.
    5. **No Session User:** If there is no active session user and the `product:view` permission cannot be verified, a permission denied error will be shown.
- **Example Usage:**

    ```    Bash
    node index.js product get PROD001
    ```
    
-  Output (if the product exists and the current session user (not admin) is the owner):
    
    Assuming the current session user's userId is user123 and the product with ID PROD001 has userId: "user123":

    ```    JSON
    {
      "id": "PROD001",
      "userId": "user123",
      "name": "My Product",
      "price": 29.99,
      "description": "This is my product.",
      "category": "Personal",
      "inventory": 5
    }
    ```
    
-  Output (if the product exists but the current session user (not admin) is not the owner):
    Assuming the current session user's userId is user456 and the product with ID PROD001 has userId: "user123":
    
    ```
    Error processing product command: You do not have permission.
    ```
    
-  Output (if the product exists and the current session user is an administrator with isAdmin: true and product:view permission):
    
    Assuming the current session user has userId: "adminUser", isAdmin: true, and the product with ID PROD002 has userId: "anotherUser":
    ```JSON
    {
      "id": "PROD002",
      "userId": "anotherUser",
      "name": "Another User's Product",
      "price": 55.00,
      "description": "A product owned by another user.",
      "category": "Shared",
      "inventory": 10
    }
    ```
    
- **Output (if the product with the given ID does not exist):**
    
    ```
    Error processing product command: Product with ID NONEXISTENT not found
    ```
    
- **Output (if the user does not have the `product:view` permission):**
    
    ```
    Permission denied: You do not have permission to view products.
    ```
    
- **Output (if there is no active session user):**
    
    ```
    Permission denied: You do not have permission to view products.
    ```

## Product Add
`product add --name <name> --price <price> --description <description> --category <category> --inventory <inventory>`

- **Description:** This command allows authorized users to add a new product to the system. When a product is added, it is automatically associated with the `userId` of the currently logged-in session user.
- **Permission Required:** `product:add`
- **Options:**
    - `--name <name>`: The name of the product (required). This should be a descriptive name for the product.
    - `--price <price>`: The price of the product (required). This value should be a numerical representation of the product's cost.
    - `--description <description>`(required): A brief description of the product. This can provide more details about the product's features or benefits.
    - `--category <category>`(required): The category the product belongs to. This helps in organizing and classifying products.
    - `--inventory <inventory>`(required): The initial stock level of the product (required). This value should be a whole number indicating the quantity of the product currently in stock.
- **Example Usage:**
    1. **Adding a product with all details:**
    
        ```Bash
        node index.js product add --name "Organic Coffee Beans" --price 15.99 --description "Premium, ethically sourced organic coffee beans." --category "Beverages" --inventory 500
        ```
        **Output:**
        
        ```JSON
        Product added: {
          "id": "PROD006",
          "userId": "user123",
          "name": "Organic Coffee Beans",
          "price": 15.99,
          "description": "Premium, ethically sourced organic coffee beans.",
          "category": "Beverages",
          "inventory": 500
        }
        ```
        
    In this example, a new product named "Organic Coffee Beans" with a price of 15.99, a description, category, and an initial inventory of 500 has been successfully added by the user with the ID `user123` (assuming they are the current session user). The system automatically generated a unique ID "PROD006" for this product.
    
- **Potential Errors:**

    1. **Missing required options:** If the `--name`, `--price`, `--inventory` or other options are not provided, the command will fail with an error message.

        ```Bash
        node index.js product add --name "Test Product" --price 10.50
        ```
        
        **Potential Output:**
        
        ```
        Error: Name, price, and inventory are required for the "add" command.
        ```
        
    2. **Permission denied:** If the current session user does not have the `product:add` permission, the command will fail.
    
        ```Bash
        node index.js product add --name "Another Product" --price 22.00 --inventory 75
        ```
        
        **Potential Output:**
        
        ```
        Permission denied: You do not have permission to add products.
        ```
        
    3. **Invalid data format:** If the provided values for `--price` or `--inventory` are not valid numbers, the command fail due to validation errors.
    
        ```Bash
        node index.js product add --name "Broken Item" --price "not a number" --inventory "many"
        ```
        
        ** Output:**
        
        ```
        Error processing product command: Invalid product data: price must be a number, inventory must be a number
        ```
        
    4. **No active session:** If there is no active session user when attempting to add a product, the `userId` cannot be determined, and the command result in an error or a permission denial. 
### Product Update 
```bash
node index.js product update <productId> --name <name> --price <price> --description <description> --category <category> --inventory <inventory>`
```

- **Description:** This command allows authorized users to modify the details of an existing product in the system. You must provide the unique `<productId>` of the product you wish to update. You can then specify which fields you want to change by using the available options. Only the options provided will be updated, while other fields will remain unchanged.
    
- **Permission Required:** `product:update`
- **Arguments:**
    - `<productId>`: The unique identifier of the product that needs to be updated. This is a mandatory argument.
- **Options:** You can use any combination of the following options to update the product's attributes:
    
    - `--name <name>`: The new name for the product.
    - `--price <price>`: The new price of the product (should be a numerical value).
    - `--description <description>`: The updated description for the product.
    - `--category <category>`: The new category for the product.
    - `--inventory <inventory>`: The updated inventory quantity (should be a number).
- **Behavior:**

    1. **Product Existence Check:** The command first checks if a product with the provided `<productId>` exists in the system. If no product with that ID is found, an error will be displayed.
    2. **Authorization Check:**
        - **Regular Users:** If the current session user is not an administrator (`isAdmin: false`), the command verifies if the `userId` associated with the product matches the `userId` of the current session user. Only if the `userId` values match will the user be allowed to update the product, provided they also have the `product:update` permission.
        - **Administrators:** If the current session user has the `isAdmin` flag set to `true`, they will be allowed to update any product in the system, provided they have the `product:update` permission. The `userId` of the product is not a factor for administrators. 
    3. **Permission Check:** Regardless of whether the user is a regular user or an administrator, they must have the `product:update` permission to execute this command. If the permission is missing, a permission denied error will be shown.
    4. **Data Validation:** If the user is authorized and has the necessary permissions, the command will validate the provided options (e.g., ensuring price and inventory are in the correct format). If the validation fails, an error message will be displayed.
    
- **Example Usage:**
    
    1. Updating the name and price of a product (as the owner):
        
        Assuming the current session user's userId is user123 and they own the product with ID PROD001:
    
        ```        Bash
        node index.js product update PROD001 --name "Premium T-Shirt" --price 29.99
        ```
        
        **Output:**
        
        ```JSON
        Product updated: {
          "id": "PROD001",
          "userId": "user123",
          "name": "Premium T-Shirt",
          "price": 29.99,
          "description": "A comfortable and stylish t-shirt.",
          "category": "Apparel",
          "inventory": 50
        }
        ```
        
        Only the name and price of the product `PROD001` have been updated.
        
    2. Updating the inventory of a product (as an administrator):
        
        Assuming the current session user has isAdmin: true and product:update permission, and they are updating a product with ID PROD002 which is owned by another user:
    
        ```Bash
        node index.js product update PROD002 --inventory 120
        ```
        
        **Output:**
        
        ```JSON
        Product updated: {
          "id": "PROD002",
          "userId": "anotherUser",
          "name": "Cool Coffee Mug",
          "price": 12.5,
          "description": "Keeps your coffee hot.",
          "category": "Home Goods",
          "inventory": 120
        }
        ```
        
        The administrator successfully updated the inventory of product `PROD002`.
        
    3. Attempting to update a product owned by another user (as a regular user):
        
        Assuming the current session user's userId is user456 and they try to update the product with ID PROD001 which is owned by user123:
        
        ```Bash
        node index.js product update PROD001 --price 30.00
        ```
        
        **Output:**
        
        ```
        Error processing product command: You do not have permission to update this product
        ```
        
    4. **Attempting to update a non-existent product:**

        ```Bash
        node index.js product update NONEXISTENT --name "New Name"
        ```
        
        **Potential Output:**
        
        ```
        Error processing product command: Product with ID NONEXISTENT not found
        ```
        
    5. **Forgetting to provide the product ID:**

        ```Bash
        node index.js product update --name "Something"
        ```
        
        **Potential Output:**
        
        ```
        Error: Product ID is required for the "update" command.
        ```
        
    6. **User without `product:update` permission trying to update a product:**
    
        ```Bash
        node index.js product update PROD001 --description "Updated description"
        ```
        
        **Potential Output:**
        
        ```
        Permission denied: You do not have permission to update products.
        ```
        
    7. **Providing invalid data for price:**
        
        ```        Bash
        node index.js product update PROD001 --price "not a number"
        ```
        
        **Potential Output:**
        
        ```
        Error processing product command: Invalid product data: price must be a number
        ```


### `product delete <productId>`

- **Description:** This command allows authenticated users with the necessary permissions to delete a product from the inventory. The product is identified by its unique `<productId>`.
    
- **Permission Required:** `product:delete`
    
- **Options:**
    
    - `<productId>`: (Mandatory) The unique identifier of the product that needs to be deleted.
- **Behavior:**
    1. **User Authentication:** The command first checks if there is an active session user. If not, it will display an error message indicating that the user must be logged in. If isAdmin is true and has `product:delete` permission then he could also removed the any product from product list.
    2. **Permission Check:** The command verifies if the current session user has the `product:delete` permission. If not, a permission denied error will be displayed.
    3. **Product Existence Check:** The command reads the product data from `products.json`. It then searches for a product with the provided `<productId>`.
    4. **Deletion:**
        - If a product with the matching `<productId>` is found, it is removed from the list of products.
        - If no product with the given `<productId>` exists, an error message indicating that the product was not found will be displayed.
    5. **Data Persistence:** After successful deletion, the command writes the updated list of products back to the `products.json` file, effectively removing the product from the inventory.
    6. **Output:** Upon successful deletion, the command might display a success message indicating the ID of the deleted product. If an error occurs (e.g., product not found, permission denied), an appropriate error message will be shown.
- **Example Usage:**
    
    1. **Deleting a product with the ID 'PROD005':**
        
        ```Bash
        node index.js product delete PROD005
        ```
        
        **Output (Success):**
        
        ```
        Product with ID PROD005 deleted successfully.
        ```
        
    2. **Attempting to delete a product that does not exist (e.g., 'PROD999'):**

        ```Bash
        node index.js product delete PROD999
        ```
        
        **Output (Error):**
        
        ```
        Error: Product with ID PROD999 not found.
        ```
        
    3. **Attempting to delete a product without being logged in:**
    
        ```Bash
        node index.js product delete PROD001
        ```
        
        **Output (Error):**
        
        ```
        You must be logged in to perform product operations.
        ```
        
    4. **User without `product:delete` permission trying to delete a product:**
        
        ```Bash
        node index.js product delete PROD001
        ```
        
        **Output (Error):**
        
        ```
        Permission denied: You do not have permission to delete products.
        ```
        

## Cart view command.

### `cart view [--targetUser <userId>]`

- **Description:** This command allows authorized users to view the contents of a shopping cart. By default, a user can view their own cart. Administrators with the necessary permissions can also view the cart of other users by specifying the `--targetUser` option.
    
- **Permission Required:** `cart:view`
    
- **Options:**
    
    - `--targetUser <userId>`: (Optional, Admin-only) If the current session user is an administrator and has the required permissions, this option allows them to view the shopping cart of the user with the specified `<userId>`.
- **Behavior:**
    1. **Permission Check:** The command first verifies if the current session user has the `cart:view` permission. If not, a permission denied error will be displayed.
    2. **User Identification:**
        - **Regular Users:** If the user is not an administrator, the command will retrieve and display the shopping cart associated with their own `userId` from the current session.
        - **Administrators (without `--targetUser`):** If the user is an administrator and does not specify the `--targetUser` option, the command will retrieve and display the shopping cart associated with their own `userId`.
        - **Administrators (with `--targetUser`):** If the user is an administrator and provides the `--targetUser` option with a valid `userId`, the command will attempt to retrieve and display the shopping cart of the user with that specific ID. The system will first verify if a user with the provided `userId` exists.
    3. **Cart Display:** Upon successful retrieval, the command will output the contents of the shopping cart. Based on  `cart.json` structure.
    4. **Empty Cart:** If the user (or the target user, in the case of an administrator) has not added any products to their cart yet, the output will be a message indicating that the user has not added anything to their cart yet.
    5. **User Not Found (for `--targetUser`):** If an administrator specifies a `--targetUser` with a `userId` that does not exist in the system, an error message indicating that the user could not be found will be displayed.
    6. **Cart Not Found (for `--targetUser`):** If the target user exists but does not have a cart associated with their account (meaning they haven't added anything yet), the output might be an array containing an object with the target user's ID as a key a message stating that the user has not added anything to their cart yet ).
- **Example Usage:**
    
    1. **Viewing your own cart (as a regular user with `userId` 78):**
    
        ```Bash
        node index.js cart view
        ```
        
        **Output (if the cart is not empty):**

        ```JSON
        
            "78": [
              {
                "cartId": "182",
                "productId": "94",
                "quantity": 1,
                "price": 2,
                "total": 20
              },
              {
                "cartId": "182",
                "productId": "96",
                "quantity": 1,
                "price": 2,
                "total": 20
              }
            ]
       
        ```

        **utput (if the user hasn't added anything to the cart yet, as per the service logic):**
        
        ```
        Error processing cart command: User has not added anything to cart yet!
        ```
        
    2. **Viewing your own cart (as an administrator with `userId` adminUser):**
        
        ```Bash
        node index.js cart view 
        ```
        
        The output would be similar to the regular user, showing the administrator's own cart in the same structure. For example:
    
        ```        JSON
       
            "adminUser": [
              {
                "cartId": "201",
                "productId": "101",
                "quantity": 5,
                "price": 10,
                "total": 50
              }
            ]
     
        ```
        
    3. **Viewing another user's cart (as an administrator with `userId` adminUser, targeting user with `userId` 78):**
    
        ```        Bash
        node index.js cart view --targetUser 78
        ```
        
        **Output (if the target user's cart is not empty):**
        
        ```JSON
      
            "78": [
              {
                "cartId": "182",
                "productId": "94",
                "quantity": 1,
                "price": 2,
                "total": 20
              },
              {
                "cartId": "182",
                "productId": "96",
                "quantity": 1,
                "price": 2,
                "total": 20
              }
            ]
     
        ```
    
        **Output (if the target user exists but hasn't added anything to the cart yet, as per the service logic):**
        
        ```
        Error processing cart command: User has not added anything to cart yet!
        ```
        
        **Output (if the target user ID is invalid or does not exist):**
        
        ```
        Error processing cart command: User with id invalidUser not found!
        ```
        
- **Errors:**
    - **Permission Denied:** If the user does not have the `cart:view` permission.

        ```Bash
        node index.js cart view
        ```
        
        **Output:**
        
        ```
        Permission denied: You do not have permission to view the cart.
        ```
        
    - **User Not Logged In:** If the user tries to access the cart without being logged in.

        ```Bash
        node index.js cart view
        ```
        
        **Output:**
        
        ```
               Permission denied: You do not have permission to view the cart.
        ```
        

## Cart Add
### `cart add <productId> --quantity <quantity>`

- **Description:** This command allows logged-in users with the necessary permissions to add a specific product to their shopping cart. If the product is already in the cart, the quantity will be increased. This command also interacts with the product inventory to ensure sufficient stock and to decrement the inventory upon successful addition to the cart.
    
- **Permission Required:** `cart:add`
    
- **Arguments:**
    
    - `<productId>`: The unique identifier of the product to be added to the cart. This is a mandatory argument.
- **Options:**
    
    - `--quantity <quantity>`: The number of units of the specified product to add to the cart. This is a mandatory option and should be a positive integer.
- **Behavior:**
    1. **User Authentication:** The command first checks if there is an active session user. If not, it will display an error message indicating that the user must be logged in.
    2. **Permission Check:** The command verifies if the current session user has the `cart:add` permission. If not, a permission denied error will be displayed.
    3. **Input Validation:** The command checks if both the `<productId>` argument and the `--quantity` option are provided. It also validates that the `quantity` is a valid positive integer. If either is missing or invalid, an error message will be shown.
    4. **Product Existence and Inventory Check:** Before adding the product to the cart, the command will communicate with the product service to:
        - Verify if a product with the given `<productId>` exists.
        - Check if there is sufficient inventory for the requested `quantity`. If the inventory is less than the requested quantity, an error message will be displayed.
    5. **Adding to Cart:**
        - If the product is not already in the user's cart, a new entry for the product with the specified quantity will be added to the user's cart in the `cart.json` file.
        - If the product is already in the user's cart, the `quantity` of that product in the cart will be increased by the specified amount.
    6. **Inventory Update:** Upon successfully adding the product to the cart, the command will signal the product service to decrease the inventory of the added product by the specified `quantity`.
    7. **Output:** After successfully adding the product (or updating its quantity), the command will display a success message along with the updated contents of the user's cart.
- **Example Usage:**
    
    1. **Adding 2 units of product with ID `PROD003` to the cart:**

        ```Bash
        node index.js cart add PROD003 --quantity 2
        ```
        
        **Potential Output (if the product is not already in the cart):**
        
        ```JSON
             [
              {
                "cartId": "CART003",
                "productId": "PROD003",
                "quantity": 2,
                "price": 49.99,
                "total": 99.98
              }
           ]
        ```
        
        (Assuming the user's ID is 78 and this is their first item in the cart)
        
        ** Output (if the product `PROD003` is already in the cart with a quantity of 1):**
        Product quantity updated for product id PROD003
        Product added to cart:
        ```JSON
         
           [
              {
                "cartId": "CART001",
                "productId": "PROD003",
                "quantity": 3,
                "price": 49.99,
                "total": 149.97
              },
              {
                "cartId": "CART002",
                "productId": "PROD005",
                "quantity": 1,
                "price": 12.50,
                "total": 12.50
              }
            ]
          
        ```
        
    2. **Attempting to add a product without specifying the quantity:**

        ```Bash
        node index.js cart add PROD004
        ```
        
        **Output:**
        
        ```
        Error: Product ID and quantity are required for "add" command.
        ```
        
    3. **Attempting to add a product with an invalid quantity (e.g., zero or negative):**

        ```Bash
        node index.js cart add PROD005 --quantity -10
        ```
        
        **Output:**
        
        ```
        Error processing cart command: Invalid product data: quantity must be greater than 0
        ```
        
        ```Bash
        node index.js cart add PROD005 --quantity -1
        ```
        
        **Output (based on `cartValidation.js`):**
        
        ```
        Error processing cart command: Invalid product data: quantity must be greater than 0
        ```
        
    4. **Attempting to add a non-existent product:**
    
        ```Bash
        node index.js cart add NONEXISTENT --quantity 1
        ```
        
        **Output**
        
        ```
        Error processing cart command: Product with ID NONEXISTENT not found
        ```
        
    5. Attempting to add a quantity that exceeds the available inventory:
        
        Assuming product PROD006 has an inventory of 50:

        ```Bash
        node index.js cart add PROD006 --quantity 55
        ```
        
        **Output (from `productService.js`):**
        
        ```
        Error processing cart command: Product does not have 55 item in inventory. The stock contains 50
        ```
        
    6. **User without `cart:add` permission trying to add a product:**
    
        ```Bash
        node index.js cart add PROD007 --quantity 1
        ```
        
        **Output:**
        
        ```
        Permission denied: You do not have permission to add products to the cart.
        ```
        
    7. **User trying to add a product without being logged in:**
        
        ```Bash
        node index.js cart add PROD008 --quantity 1
        ```
        
        **Output:**
        
        ```
          Permission denied: You do not have permission to add products to the cart.
        ```
        
## cart remove

### `cart remove <productId> [--targetUser <userId>]`

- **Description:** This command allows authorized users to remove a specific product from their shopping cart. Administrators with the necessary permissions can also remove products from other users' carts by specifying the `--targetUser` option. This command also interacts with the product inventory to increment the stock upon successful removal from the cart.
    
- **Permission Required:** `cart:remove`
    
- **Arguments:**
    
    - `<productId>`: The unique identifier of the product to be removed from the cart. This is a mandatory argument.
- **Options:**

    - `--targetUser <userId>`: (Optional, Admin-only) If the current session user is an administrator and has the required permissions, this option allows them to remove the specified product from the shopping cart of the user with the given `<userId>`.
- **Behavior:**
    1. **User Authentication:** The command first checks if there is an active session user. If not, it will display an error message indicating that the user must be logged in.
    2. **Permission Check:** The command verifies if the current session user has the `cart:remove` permission. If not, a permission denied error will be displayed.
    3. **Cart Existence Check:**
        - **Regular Users:** If the user is not an administrator, the command checks if their cart exists and contains any items. If the cart is empty, an error message will be displayed.
        - **Administrators (with `--targetUser`):** If an administrator specifies a `--targetUser`, the command will attempt to find the cart associated with that user. If the target user does not have a cart, an error message will be displayed.
    4. **Product Removal:**
        - The command searches for the specified `<productId>` within the user's (or target user's) cart.
        - If the product is found, it is removed from the cart in the `cart.json` file.
        - If the product is not found in the cart, a message indicating this will be displayed.
    5. **Inventory Update:** Upon successfully removing the product from the cart, the command will signal the product service to increase the inventory of the removed product by the quantity that was in the cart. 
    6. **Output:** After attempting to remove the product, the command will display a message indicating whether the product was successfully removed or not found. If removal was successful, the updated cart contents might also be displayed.
- **Example Usage:**
	  
    1. **Removing product with ID `PROD003` from your own cart (as a regular user):**
        ```Bash
        node index.js cart remove "PROD003"
        ```
        
        **Output (if the product was found and removed):**
        Product removed successfully with id PROD003
        Updated cart:
        ```JSON
          [
              {
                "cartId": "CART002",
                "productId": "PROD005",
                "quantity": 1,
                "price": 12.50,
                "total": 12.50
              }
            ]
          
        ```
        
        (Assuming the user's ID is 78 and `PROD003` was in their cart)
        
        **Output (if the product was not found in the cart):**
        Product was not found with the id PROD007
        
    ```Bash
        Error processing cart command: Product with ID INVALIDID not found
        ```
        
    2. Removing product with ID PROD001 from the cart of user with ID user456 (as an administrator):
        Assuming the current session user has isAdmin: true and product:update permission:
         ```Bash
        node index.js cart remove PROD001 --targetUser user456
             ```
        
        **Output if the product was found and removed from the target user's cart):**
        Product removed successfully with id PROD001
        Updated cart:
        ```JSON
         [
              {
                "cartId": "CART011",
                "productId": "PROD009",
                "quantity": 2,
                "price": 35.00,
                "total": 70.00
              }
            ]
      
        ```
        
        ** Output if the product was not found in the target user's cart):**
        Product was not found with the id PROD010
        
        ```bash
        Error processing cart command: Product with ID INVALIDID not found
        ```
        
    3. **Attempting to remove a product without providing the product ID:**
        
        ```Bash
        node index.js cart remove
        ```
        
        **Output:**
        
        ```
        Error: Product ID is required for "remove" command.
        ```
        
    4. **Attempting to remove a product when the user's cart is empty (as a regular user):**
    
        ```Bash
        node index.js cart remove PROD005
        ```
        
        **Output:**
        
        ```
        Error processing cart command: User has not added anything to cart yet!
        ```
        
    5. Attempting to remove a product from a user who doesn't have a cart (as an administrator):
        
        Assuming user with ID nonexistentUser has never added anything to their cart:
    
        ```Bash
        node index.js cart remove PROD002 --targetUser nonexistentUser
        ```
        
        **Output:**
        
        ```
        Error processing cart command: User with id nonexistentUser does not have a cart.
        ```
        
    6. **User without `cart:remove` permission trying to remove a product:**
    
        ```Bash
        node index.js cart remove PROD004
        ```
        
        ** Output:**
        
        ```
        Permission denied: You do not have permission to remove products from the cart.
        ```
        
    7. **User trying to remove a product without being logged in:**

        ```Bash
        node index.js cart remove PROD006
        ```
        
        **Potential Output:**
        
        ```
       Permission denied: You do not have permission to remove products from the cart.
        ```
        



## Cart Update 

### `cart update <productId> --quantity <quantity> [--targetUser <userId>]`

- **Description:** This command allows authorized users to update the quantity of a specific product in their shopping cart. Administrators with the necessary permissions can also update the quantity of products in other users' carts by specifying the `--targetUser` option. This command interacts with the product inventory to adjust the stock based on the change in quantity.
    
- **Permission Required:** `cart:update`
    
- **Arguments:**
    
    - `<productId>`: The unique identifier of the product in the cart whose quantity needs to be updated. This is a mandatory argument.
- **Options:**
    - `--quantity <quantity>`: The new desired quantity for the specified product in the cart. This is a mandatory option and should be a positive integer.
    - `--targetUser <userId>`: (Optional, Admin-only) If the current session user is an administrator and has the required permissions, this option allows them to update the quantity of the specified product in the shopping cart of the user with the given `<userId>`.
- **Behavior:**
    
    1. **User Authentication:** The command first checks if there is an active session user. If not, it will display an error message indicating that the user must be logged in.
    2. **Permission Check:** The command verifies if the current session user has the `cart:update` permission. If not, a permission denied error will be displayed.
    3. **Input Validation:** The command checks if both the `<productId>` argument and the `--quantity` option are provided. It also validates that the `quantity` is a valid positive integer. If either is missing or invalid, an error message will be shown.
    4. **Cart Existence Check:**
        - **Regular Users:** If the user is not an administrator, the command checks if their cart exists and contains any items. If the cart is empty, an error message will be displayed.
        - **Administrators (with `--targetUser`):** If an administrator specifies a `--targetUser`, the command will attempt to find the cart associated with that user. If the target user does not have a cart, an error message will be displayed.
    5. **Product Existence in Cart Check:** The command searches for the specified `<productId>` within the user's (or target user's) cart. If the product is not found in the cart, an error message will be displayed.
    6. **Inventory Adjustment:**
        - The command compares the new `quantity` with the existing quantity of the product in the cart.
        - If the new quantity is greater than the old quantity, the command will signal the product service to decrease the inventory by the difference. It will also check if sufficient inventory is available before making the update.
        - If the new quantity is less than the old quantity, the command will signal the product service to increase the inventory by the difference.
        - If the new quantity is the same as the old quantity, no inventory update will occur.
    7. **Cart Update:** Upon successful validation, authorization, and inventory check, the quantity of the specified product in the user's (or target user's) cart in the `cart.json` file will be updated to the new `quantity`. The `total` for that cart item will also be recalculated based on the new quantity and the product's price.
    8. **Output:** After attempting to update the cart item's quantity, the command will display a message indicating whether the update was successful or if any errors occurred.
- **Example Usage:**
    
    1. Updating the quantity of product with ID PROD003 to 5 in your own cart (as a regular user):
        
        Assuming the current session user's userId is user123 and PROD003 is in their cart:
        
        ```Bash
        node index.js cart update PROD003 --quantity 5
        ```
        
        **Output (if successful):**
        
        ```
        Product with id PROD003 updated with quantity 5
        ```
        
    2. Updating the quantity of product with ID PROD001 to 2 in the cart of user with ID user456 (as an administrator):
        
        Assuming the current session user has isAdmin: true and cart:update permission:
        
        ```Bash
        node index.js cart update PROD001 --quantity 2 --targetUser user456
        ```
        
        **Output (if successful):**
        
        ```
        Product with id PROD001 updated with quantity 2
        ```
        
    3. **Attempting to update the quantity without providing the product ID:**
    
        ```Bash
        node index.js cart update --quantity 3
        ```
        
        **Output:**
        
        ```
        Error: Product ID and quantity are required for "update" command.
        ```
        
    4. **Attempting to update the quantity without providing the new quantity:**
    
        ```Bash
        node index.js cart update PROD005
        ```
        
        **Output:**
        
        ```
        Error: Product ID and quantity are required for "update" command.
        ```
        
    5. **Attempting to update the quantity of a product that is not in the cart (as a regular user):**
    
        ```Bash
        node index.js cart update PROD007 --quantity 1
        ```
        
        **Output:**
        
        ```
        Error processing cart command: Product with id PROD007 could not be found in the cart.
        ```
        
    6. Attempting to update the quantity to a value that exceeds the available inventory (as a regular user):
        
        Assuming product PROD006 has an inventory of 10, and it's already in the cart with a quantity of 5. The user tries to update the quantity to 12:
    
        ```Bash
        node index.js cart update PROD006 --quantity 12
        ```
        
        **Output**
        
        ```
        Error processing cart command: Product does not have 12 item in inventory. The stock contains 10
        ```
        
    7. **User without `cart:update` permission trying to update the cart:**
        
        ```Bash
        node index.js cart update PROD004 --quantity 2
        ```
        
        **Output:**
        
        ```
        Permission denied: You do not have permission to update the cart.
        ```
        
    8. **User trying to update the cart without being logged in:**
        
        ```Bash
        node index.js cart update PROD008 --quantity 1
        ```
        
        **Output:**
        
        ```
        Permission denied: You do not have permission to update the cart.
        ```
        
    9. **Attempting to update the quantity to an invalid value (e.g., zero or negative):**
        
        ```Bash
        node index.js cart update PROD005 --quantity 0
        ```
        
        **Output**
        
        ```
        Error processing cart command: Invalid quantity. Quantity must be a positive integer.
        ```
        


## Order Operations
### `order list [--targetUser <userId>]`

- **Description:** This command allows authorized users to list orders. Regular users can only view their own orders, while administrators with the necessary permissions can list all orders or filter by a specific user using the `--targetUser` option.
    
- **Permission Required:** `order:view`
    
- **Options:**
    - `--targetUser <userId>`: (Optional, Admin-only) If the current session user is an administrator and has the `order:view` permission, this option allows them to list orders placed by the user with the specified `<userId>`. If omitted by an administrator, all orders will be listed.
- **Behavior:**
    1. **User Authentication:** The command first checks if there is an active session user. If not, it will display an error message indicating that the user must be logged in.
    2. **Permission Check:** The command verifies if the current session user has the `order:view` permission. If not, a permission denied error will be displayed.
    3. **Order Retrieval:**
        - **Regular Users:** If the user is not an administrator, the command will call the `getOrders` function from `orderService.js` with the current session user's `userId`. This will retrieve an object containing their order details, keyed by their `userId`. If the user has not placed any orders, a message indicating this will be shown.
        - **Administrators:** If the user is an administrator, the command checks for the presence of the `--targetUser` option.
            - If `--targetUser` is provided, the command will call `getOrders` with the specified `userId`. This will retrieve an object containing the order details for that specific user, keyed by their `userId`. If the target user has not placed any orders, a message indicating this will be shown.
            - If `--targetUser` is not provided, the command will call `getOrders` with the current session user's `userId` and the `isAdmin` flag set to `true`. When `isAdmin` is true and `targetUser` is not provided, an array containing a single object will be returned. This object will have all user IDs as keys, with their corresponding order details as values.
    4. **Output:** The command will display the order information. The format will be an object where keys are user IDs and values are the order details for that user. The order details will include `id`, `userId`, `items` (with `cartId`, `productId`, `quantity`, `price`, `total`, and `status`), `total`, and `timestamp`.
- **Example Usage:**
    
    1. **Listing your own orders (as a regular user with `userId` 78):**
        ```Bash
        node index.js order list
        ```
        
        **Potential Output:**
        ```JSON
        {
          "78": {
            "id": "225",
            "userId": "78",
            "items": [
              {
                "cartId": "182",
                "productId": "95",
                "quantity": 1,
                "price": 2,
                "total": 20,
                "status": "Done"
              },
              {
                "cartId": "182",
                "productId": "97",
                "quantity": 9,
                "price": 2,
                "total": 20,
                "status": "Pending"
              }
            ],
            "total": 0,
            "timestamp": 1743745951336
          }
        }
        ```
        
        **Output (if no orders have been placed):**
        
        ```
        Error getting cart: User has not added anything to order yet!
        ```
        
    2. Listing all orders (as an administrator):
        
        Assuming the current session user has isAdmin: true:
    
        ```Bash
        node index.js order list
        ```
        
        **Output:**
        
        ```JSON
        [
          {
            "78": {
              "id": "225",
              "userId": "78",
              "items": [ ... ],
              "total": 0,
              "timestamp": 1743745951336
            },
            "79": {
              "id": "225",
              "userId": "78",
              "items": [ ... ],
              "total": 0,
              "timestamp": 1743745951336
            }
          }
        ]
        ```
        
    3. Listing orders for a specific user (as an administrator with userId 79):
        
        Assuming the current session user has isAdmin: true:

        ```Bash
        node index.js order list --targetUser 78
        ```
        
        **Output:**

        ```JSON
        {
          "78": {
            "id": "225",
            "userId": "78",
            "items": [
              {
                "cartId": "182",
                "productId": "95",
                "quantity": 1,
                "price": 2,
                "total": 20,
                "status": "Done"
              },
              {
                "cartId": "182",
                "productId": "97",
                "quantity": 9,
                "price": 2,
                "total": 20,
                "status": "Pending"
              }
            ],
            "total": 0,
            "timestamp": 1743745951336
          }
        }
        ```
        
        **Output (if the target user has no orders):**
        
        ```
        Error getting cart: User has not added anything to order yet!
        ```
        
    4. **Attempting to list orders without being logged in:**
        
        ```Bash
        node index.js order list
        ```
        
        **Output:**
        
        ```
        Permission denied: You do not have permission to view orders.
        ```
        
    5. **User without `order:view` permission trying to list orders:**
    
        ```Bash
        node index.js order list
        ```
        
        **Output:**
        
        ```
        Permission denied: You do not have permission to view orders.
        ```


## Order **Create**

`order create --items <productId1,productId2,...> --status <Pending|Done>`

- **Description:** This command allows authenticated users with the necessary permissions to create a new order from the items currently in their shopping cart. Users must specify the product IDs they wish to order and the initial status of the order.
    
- **Permission Required:** `order:create`
    
- **Options:**
    - `--items <productId1,productId2,...>`: (Mandatory) A comma-separated list of product IDs that the user wants to include in the order. These product IDs must correspond to items currently present in the user's shopping cart. Must be enclose with double quotations mark.
    - `--status <Pending|Done>`: (Mandatory) The initial status of the order. It must be either `Pending` or `Done`. Any other status will result in an error.
- **Behavior:**
    1. **User Authentication:** The command first checks if there is an active session user. If not, it will display an error message indicating that the user must be logged in.
    2. **Permission Check:** The command verifies if the current session user has the `order:create` permission. If not, a permission denied error will be displayed.
    3. **Cart Retrieval:** The command retrieves the current user's shopping cart by calling the `getCart` function from `cartService.js` with the user's `userId`.
    4. **Empty Cart Check:** If the user's cart is empty, the command will display an error message indicating that an order cannot be created from an empty cart.
    5. **Item Selection:** The command parses the comma-separated list of product IDs provided in the `--items` option. It then filters the user's cart to include only the items with the specified product IDs.
    6. **Product Existence Check (in Cart):** If none of the provided product IDs are found in the user's cart, the command will display an error message indicating that the selected products have not been added to the cart yet.
    7. **Status Validation:** The command validates the `--status` option. If the provided status is neither `Pending` nor `Done`, an error message will be displayed prompting the user to enter a valid status.
    8. **Order Object Creation:** For each selected item from the cart, the command sets its `status` to the value provided in the `--status` option. It then gathers the necessary information to create a new order object, including:
        - A unique `id` generated using `generateId('o')`.
        - The current session user's `userId`.
        - The filtered list of cart items.
        - A `total` 
        - The current `timestamp`.
    9. **Order Creation in Service:** The command calls the `createOrder` function from `orderService.js` with the newly created order data. This function will add the order to the `orders.json` file.
    10. **Cart Update:** If the order is created successfully, the command calls the `removeCartWithId` function from `cartService.js` to remove the items that were just ordered from the user's shopping cart.
    11. **Output:** Upon successful creation of the order, the command might display a success message or the details of the newly created order.
- **Example Usage:**
    
    1. Creating an order with products 'PROD001' and 'PROD003' with 'Pending' status:
        
        Assuming the user has these products in their cart:
        ```Bash
        node index.js order create --items "PROD001,PROD003" --status Pending
        ```
        
        **Output:**
        
        ```
        Order created successfully.
        ```

        
    2. Creating an order with a single product 'PROD005' with 'Done' status:
        
        Assuming the user has 'PROD005' in their cart:

        ```        Bash
        node index.js order create --items "PROD005" --status Done
        ```
        
        **Output:**
        
        ```
        Order created successfully. 
        ```
        
    3. **Attempting to create an order with an empty cart:**
        
        ```        Bash
        node index.js order create --items "PROD001" --status Pending
        ```
        
        **Output:**
        
        ```
        Error processing order command: Produts have not added to the cart yet. Please add to cart for order.
        ```
        
    4. Attempting to create an order with product IDs not in the cart:
        
        Assuming the user does not have 'PROD007' in their cart:
        ```Bash
        node index.js order create --items "PROD007" --status Pending
        ```
        
        **Output:**
        
        ```
        Error: Produts have not added to the cart yet. Please add to cart for order.
        ```
        
    5. **Attempting to create an order with an invalid status:**
        
        ```Bash
        node index.js order create --items "PROD001" --status Processing
        ```
        
        **Output:**
        
        ```
        Error: Please enter the valid status - Pending or Done
        ```
        
    6. **Attempting to create an order without being logged in:**
        

        ```Bash
        node index.js order create --items "PROD001" --status Pending
        ```
        
        **Output:**
        
        ```
        Permission denied: You do not have permission to create orders.
        ```
        
    7. **User without `order:create` permission trying to create an order:**
    
        ```Bash
        node index.js order create --items PROD001 --status Pending
        ```
        
        **Potential Output:**
        
        ```
        Permission denied: You do not have permission to create orders.
        ```
        

## Order Update
### `order update --items <productId1,productId2,...> --status <Pending|Done> [--targetUser <userId>]`

- **Description:** This command allows authenticated users with the necessary permissions to update the status of specific items within an existing order. Regular users can only update the status of items in their own orders. Administrators with the `order:update` permission can update the status of items in any user's order by using the `--targetUser` option.
    
- **Permission Required:** `order:update`
    
- **Options:**
    
    - `--items <productId1,productId2,...>`: (Mandatory) A comma-separated list of product IDs within the order whose status needs to be updated.
    - `--status <Pending|Done>`: (Mandatory) The new status to be assigned to the specified product items. It must be either `Pending` or `Done`. Any other status will result in an error.
    - `--targetUser <userId>`: (Optional, Admin-only) If the current session user is an administrator and has the `order:update` permission, this option allows them to specify the `userId` of the user whose order needs to be updated. If omitted by a regular user, their own `userId` is assumed.
- **Behavior:**
    1. **User Authentication:** The command first checks if there is an active session user. If not, it will display an error message indicating that the user must be logged in.
    2. **Permission Check:** The command verifies if the current session user has the `order:update` permission. If not, a permission denied error will be displayed.
    3. **Target User Determination:**
        - **Regular Users:** If the `--targetUser` option is not provided, the command will use the `userId` of the current session user.
        - **Administrators:** If the `--targetUser` option is provided, the command will use the specified `userId`. 
    4. **Order Retrieval:** The command retrieves the order for the determined target user by calling the `getOrders` function from `orderService.js`.
    5. **Empty Order Check:** If no order exists for the target user, the command will display an error message indicating that the order is empty.
    6. **Status Validation:** The command validates the `--status` option. If the provided status is neither `Pending` nor `Done`, an error message will be displayed prompting the user to enter a valid status.
    7. **Item Identification and Status Update:** The command parses the comma-separated list of product IDs from the `--items` option. It then iterates through the items in the retrieved order for the target user. For each item in the order, if its `productId` is present in the provided list, its `status` will be updated to the value specified in the `--status` option.
    8. **Order Persistence:** After updating the status of the specified items, the command calls the `updateOrder` function in `orderService.js` to save the changes back to the `orders.json` file.
    9. **Output:** Upon successful update of the order items' status, the command might display a success message. If there are any errors during the process (e.g., invalid status, no order found), an appropriate error message will be shown.
- **Example Usage:**
    
    1. **Regular user (with `userId` 78) updating the status of products '95' and '97' to 'Done' in their order:**

        ```Bash
        node index.js order update --items "95,97" --status Done
        ```
        
        **Output:**
        
        ```
        Order updated successfully. Status of items "95, 97" set to Done.
        ```
        
    2. **Administrator (with `isAdmin: true`) updating the status of product '95' to 'Pending' for user with `userId` 79:**

        ```        Bash
        node index.js order update --items "95" --status Pending --targetUser 79
        ```
        
        **Output:**
        
        ```
        Order for user 79 updated successfully. Status of item 95 set to Pending.
        ```
        
    3. **Regular user attempting to update the status of items in another user's order:**
        
        ```Bash
        node index.js order update --items "95" --status Done --targetUser 79
        ```
        
        **Output:**
        
        ```
        Permission denied: You do not have permission
        ```
        
    4. **Attempting to update order status with an invalid status:**
        
        ```Bash
        node index.js order update --items 95 --status Processing
        ```
        
        **Output:**
        
        ```
        Error: Please enter the valid status - Pending or Done
        ```
        
    5. **Attempting to update order status for a user who has no orders:**

        ```Bash
        node index.js order update --items 95 --status Done --targetUser 999
        ```
        
        **Output:**
        
        ```
        Error processing order command: Produts have not added to the cart yet. Please add to cart for order.
        ```
        
    6. **Attempting to update order status without being logged in:**
        
        ```Bash
        node index.js order update --items 95 --status Done
        ```
        
        **Potential Output:**
        
        ```
        Permission denied: You do not have permission.
        ```
        
    7. **User without `order:update` permission trying to update order status:**

        ```Bash
        node index.js order update --items 95 --status Done
        ```
        
        **Output:**
        
        ```
        Permission denied: You do not have permission to update orders.
        ```
        
## Order Delete

`order delete --items <productId1,productId2,...> [--targetUser <userId>]`

- **Description:** This command allows authenticated users with the necessary permissions to remove specific items from their existing order. Regular users can only remove items from their own orders. Administrators with the `order:delete` permission can remove items from any user's order by using the `--targetUser` option.
- **Permission Required:** `order:delete`
- **Options:**
    
    - `--items <productId1,productId2,...>`: (Mandatory) A comma-separated list of product IDs that the user wants to remove from their order.
    - `--targetUser <userId>`: (Optional, Admin-only) If the current session user is an administrator and has the `order:delete` permission, this option allows them to specify the `userId` of the user whose order items need to be removed. If omitted by a regular user, their own `userId` is assumed.
- **Behavior:**
    1. **User Authentication:** The command first checks if there is an active session user. If not, it will display an error message indicating that the user must be logged in.
    2. **Permission Check:** The command verifies if the current session user has the `order:delete` permission. If not, a permission denied error will be displayed.
    3. **Target User Determination:**
        - **Regular Users:** If the `--targetUser` option is not provided, the command will use the `userId` of the current session user.
        - **Administrators:** If the `--targetUser` option is provided, the command will use the specified `userId`. 
    4. **Order Retrieval:** The command retrieves the order for the determined target user by calling the `getOrders` function from `orderService.js`.
    5. **Empty Order Check:** If no order exists for the target user, the command will display an error message indicating that the order is empty.
    6. **Item Identification and Removal:** The command parses the comma-separated list of product IDs from the `--items` option. It then filters the items in the retrieved order for the target user. Only the items whose `productId` is **not** in the provided list will be kept in the order.
    7. **Order Persistence:** After removing the specified items, the command calls the `deleteOrder` function in `orderService.js` to save the changes (the updated list of items) back to the `orders.json` file.
    8. **Output:** Upon successful removal of the items, the command might display a success message indicating which items were removed. If there are any errors during the process (e.g., no order found, invalid product ID), an appropriate error message will be shown.
- **Example Usage:**
    
    1. **Regular user (with `userId` 78) removing products '97' from their order:**
    
        ```Bash
        node index.js order delete --items "97"
        ```
        
        **Output:**
        
        ```
        Order updated successfully. Removed item(s) with ID(s): 97.
        ```
        
    2. **Administrator (with `isAdmin: true`) removing product '95' from the order of user with `userId` 79:**
    
        ```Bash
        node index.js order delete --items "95" --targetUser 79
        ```
        
        **Output:**
        
        ```
        Order for user 79 updated successfully. Removed item(s) with ID(s): 95.
        ```
        
    3. **Regular user attempting to remove items from another user's order:**
        
        ```Bash
        node index.js order delete --items "97" --targetUser 79
        ```
        
        **Output:**
        
        ```
        Permission denied: You do not have permission.
        ```
        
        
    4. **Attempting to remove items from an order that does not exist:**
        
        ```bash
        node index.js order delete --items "97" --targetUser 999
        ```
        
        **Potential Output:**
        
        ```
        Error processing order command: Produts have not added to the cart yet. Please add to cart for order.
        ```
        
    5. **Attempting to remove items without being logged in:**
        
        ```Bash
        node index.js order delete --items "97"
        ```
        
        ** Output:**
        
        ```
        Permission denied: You do not have permission.
        ```
        
    6. **User without `order:delete` permission trying to remove items:**
        
        ```Bash
        node index.js order delete --items "97"
        ```
        
        **Output:**
        
        ```
        Permission denied: You do not have permission to delete orders.
        ```
        

In conclusion, the order management commands (`list`, `get`, `create`, `update`, and `delete`) provide a comprehensive interface for users and administrators to manage the lifecycle of orders within the Product Management CLI. These commands enable users to view their order history, retrieve specific order details, create new orders from their shopping carts, update the status of ordered items, and remove items from existing orders. Administrators have extended capabilities to oversee and manage orders across all users. This set of commands is crucial for the overall functionality of the product management system, allowing for efficient tracking and modification of customer orders.
