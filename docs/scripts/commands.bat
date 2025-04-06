

::Use command

::node index.js user create --username <username> --password <password> --permissions <permissions>
node index.js register --username "krishna__" --password "12323" --permissions "product:view, product:add"

::node index.js user login --username <username> --password <password>
node index.js login --username "krishna__" --password "12323"

::node index.js user logout
node index.js logout   

::Product Commands:

::node index.js product list
node index.js product list

::node index.js product get <productId>
node index.js product get PROD001

::node index.js product add --name <name> --price <price> --description <description> --category <category> --inventory <inventory>
node index.js product add --name "New Product" --price 25.99 --description "A brand new product" --category "Electronics" --inventory 100

::node index.js product update <productId> --<field> <newValue>
node index.js product update PROD001 --price 29.99

::node index.js product delete <productId>
node index.js product delete PROD005

::Cart Commands:

::node index.js cart view
node index.js cart view

::node index.js cart add <productId> --quantity <quantity>
node index.js cart add PROD002 --quantity 2

::node index.js cart remove <productId>
node index.js cart remove PROD002

::node index.js cart update <productId> --quantity <newQuantity>
node index.js cart update PROD003 --quantity 5
::total of cart
node index.js cart total
::Order Commands:

::node index.js order list [--targetUser <userId>]
node index.js order list
node index.js order list --targetUser user456

::node index.js order get <userId>
node index.js order get user123

::node index.js order create --items <productId1,productId2,...> --status <Pending|Done>
node index.js order create --items "PROD001,PROD003" --status Pending

::node index.js order update --items <productId1,productId2,...> --status <Pending|Done> [--targetUser <userId>]
:: focus on changing the status of product in order
node index.js order update --items "119" --status Done
node index.js order update --items "PROD002" --status Pending --targetUser user456

::node index.js order delete --items <productId1,productId2,...> [--targetUser <userId>]
:: provide the items with in the double quotations if you want to delete multiple then seperate them with comma ","
node index.js order delete --items "119,118"
node index.js order delete --items "PROD004" --targetUser user456