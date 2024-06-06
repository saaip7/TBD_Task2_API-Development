const { get } = require("./routes");

//Get all books
const getBooks = 'SELECT * FROM "Book"';

//Get book by id
const getBookById = 'SELECT * FROM "Book" WHERE "bookNumber" = $1'

//Add book
const addBook = 'INSERT INTO "Book" ("publisherID", "bookName", "publicationYear", pages, rating, price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING "bookNumber"'

// Search by name of the book
const checkTitleExist = 'SELECT b FROM "Book" b WHERE b."bookName" = $1';

//Remove book
const removeBook = 'DELETE FROM "Book" WHERE "bookNumber" = $1'

//All Queries for Updating Books
const updateBookName = 'UPDATE "Book" SET "bookName" = $1 WHERE "bookNumber" = $2'
const updateBookPublisher = 'UPDATE "Book" SET "publisherID" = $1 WHERE "bookNumber" = $2'
const updateBookPublicationYear = 'UPDATE "Book" SET "publicationYear" = $1 WHERE "bookNumber" = $2'
const updateBookPages = 'UPDATE "Book" SET pages = $1 WHERE "bookNumber" = $2'
const updateBookRating = 'UPDATE "Book" SET rating = $1 WHERE "bookNumber" = $2'
const updateBookPrice = 'UPDATE "Book" SET price = $1 WHERE "bookNumber" = $2'

//Get wishlist customer
const getWishlist = 'SELECT * FROM "Wishlist" WHERE "AccountCust_acc_id" = $1'

//Add book to wishlist
const addBookToWishlist = 'INSERT INTO "Wishlist" ("AccountCust_acc_id", "Book_bookNumber", date) VALUES ($1, $2, $3)'

// Search wishlist by name (unused for now)
//const getBookNameInWishlist = 'SELECT b."bookName" FROM "Wishlist" w JOIN "Book" b ON w."Book_bookNumber" = b."bookNumber" WHERE b."bookName" = $1';

//Check if account customer exist in wishlist
const checkAccountExistInWishlist = 'SELECT w FROM "Wishlist" w WHERE w."AccountCust_acc_id" = $1';

//check if book exists in wishlist for a specific account customer
const checkBookExistInWishlist = 'SELECT w FROM "Wishlist" w WHERE w."AccountCust_acc_id" = $1 AND w."Book_bookNumber" = $2';

//remove wishlist
const removeWishlist = 'DELETE FROM "Wishlist" WHERE "AccountCust_acc_id" = $1 AND "Book_bookNumber" = $2';

//All Query for add purchase
const addPurchase = 'INSERT INTO "Purchase" ( "timestamp", emp_id, stock_id, "custNumber", quantity) VALUES ($1, $2, $3, $4, $5) RETURNING purchase_id';

const updateTotalPrice = `UPDATE public."Purchase" p
SET "totalPrice" = p.quantity * b.price
FROM public."Stock" s
JOIN public."Book" b ON b."bookNumber" = s."Book_bookNumber"
WHERE p.stock_id = s.stock_id
AND p.purchase_id = $1`;

const updateStock = `
    UPDATE public."Stock" s
    SET quantity = s.quantity - $1
    FROM public."Purchase" p
    WHERE p.stock_id = s.stock_id
    AND p.purchase_id = $2
    AND s."Store_store_id" = $3
    RETURNING s.quantity;
`;

const addStock = `INSERT INTO public."Stock" ("Store_store_id", "Book_bookNumber", quantity) VALUES ($1, $2, $3)`;

module.exports = {
    getBooks,
    getBookById, 
    addBook,
    checkTitleExist,
    removeBook,
    getWishlist,
    addBookToWishlist,
    checkAccountExistInWishlist,
    checkBookExistInWishlist,
    removeWishlist,
    updateBookName,
    updateBookPublisher,
    updateBookPublicationYear,
    updateBookPages,
    updateBookRating,
    updateBookPrice,
    addPurchase,
    updateTotalPrice,
    updateStock,
    addStock
}