# TBD - TASK 2: API Development

> [!NOTE]
> Syaifullah Hilmi Ma'arij | 22/497775/TK/54568

This source code is created to fulfill the final project requirements for TBD, focusing on API development for the _Good Reading Bookstore_, built using JavaScript with the Express framework from NodeJS.

### controller.js
> Functions as the intermediary between the model (database) and the view (response to the client). It manages the business logic of the application, such as handling requests from the client, calling appropriate functions from _query.js_ to interact with the database, and sending responses back to the client.

### query.js
> Contains all the SQL queries used in the application. In other words, _query.js_ includes functions that execute queries against the database. It is created to separate the database logic from the controller to enhance modularity and code maintenance.

### routes.js
> Defines the API routes and links them to the appropriate functions in _controller.js_. It also groups the routes for easier management and organization.

### db.js
> Manages the configuration and connection to the database. Important information such as the database password is stored in a separate _environment file (.env)._

## Example POST Method Query Input
The test is performed using POSTMAN. The POST Method requires input in the form of JSON in the POSTMAN body. Below are some examples.

### 1. addBook
```json
{
    "bookDetails": {
        "publisherID": 1,
        "bookName": "Sample Book",
        "publicationYear": 2023,
        "pages": 300,
        "rating": 4.5,
        "price": 20.00
    },
    "stockDetails": {
        "Store_store_id": 61,
        "quantity": 5
    }
}
```

### 2. addBookToWishlist
```json
{
    "AccountCust_acc_id": 3,
    "Book_bookNumber": 4,
    "date": "2024-01-02T17:00:00.000Z"
}
```

### 3. searchBook
```json
{
    "filter": "publicationYear",
    "filterValue": 2000,
    "orderBy": "price ASC",
    "limit": 10,
    "offset": 5
}
```
> [!IMPORTANT]
> Using _filter_ must be followed by _filterValue_.

> [!NOTE]
> Remove unused parameters if you do not want to use all parameters.

### 4. addPurchase
```json
{
    "timestamp": "2024-05-02T10:00:00",
    "emp_id": 40, 
    "stock_id": 523,
    "custNumber": 20, 
    "quantity": 1,
    "store_id": 61
}
```

## Example UPDATE Method Query Input
The UPDATE Method also requires JSON input. Below is an example of a JSON input for updating all attributes of a book.

### 1. updateBook
```json
{
    "publisherID": 5,
    "bookName": "The Pancasila II",
    "pages": 120,
    "rating": 4.5,
    "price": 50
}
```
> [!NOTE]
> If you want to update only some attributes, remove the unwanted parameters.


## Run It Down
> [!WARNING]
> After cloning or pulling the repository, always run _npm i_ to install the necessary packages. There might also be other specific packages that need to be installed, such as _nodemon, pg, or dotenv_.

Command to start the server
```
npm run devStart
```
The above command is a script created to simplify terminal commands.
Alternatively, you can use the default Node.js command:
```
node server.js
```
