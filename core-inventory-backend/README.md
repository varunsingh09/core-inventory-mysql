# Core Inventory (back-end)

<br>
<br>
<p align="center">
    <img src="https://raw.githubusercontent.com/andresfelipedev/core-inventory-frontend/e690dffdf35c37acb594f997a5378d2be24570e6/src/assets/images/core-inventory-logo.svg" alt="Core Inventory" width="400">   
</div>
<br>
<br>

Core Inventory is a web application for inventory management. This is the back-end for Core Inventory, built with:

* [Node JS](https://nodejs.org/en/) - To use JavaScript on the server side.
* [Express](https://expressjs.com) - To use MVC architecture on the server side.
* [MySQL](https://www.mysql.com) - To support quick processing and store data.

This web application is also made with learning purposes.

## Installation

1. Open the command prompt and clone this repository.
```bash
mkdir core-inventory-backend
cd core-inventory-backend
git clone https://github.com/andresfelipedev/core-inventory-backend.git
```

2. Run `npm install`.

3. Create a `.env` file in the root directory with the next environment variables:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=""
DB_NAME=coreinventory
TOKEN_KEY="Token-Auth"
```

> **NOTE:** Replace DB_USER and DB_PASSWORD values if you have your own MySQL user and password.

4. Execute `npm run dev`.

## Contributing

Create a pull request to contribute to this project. Open an issue to discuss major changes.

## License

[MIT](https://choosealicense.com/licenses/mit/)