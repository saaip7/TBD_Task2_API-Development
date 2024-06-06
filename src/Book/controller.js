const pool = require('../../db')
const queries = require('./queries')


const getBooks = (req, res) => {
    pool.query(queries.getBooks, (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

const getBookById = (req, res) => {
    const bookNumber = parseInt(req.params.bookNumber)
    pool.query(queries.getBookById, [bookNumber], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

const removeBook = (req, res) => {
    const book_id = parseInt(req.params.book_id)
    pool.query(queries.removeBook, [book_id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).send(`Book deleted with ID: ${book_id}`)
    })
}




const getWishlist = (req, res) => {
    const id = parseInt(req.params.id)
    pool.query(queries.getWishlist, [id], (error, results) => {
        if (error){
            throw error
        }
        res.status(200).json(results.rows)
    })
}

const addBookToWishlist = (req, res) => {
    const { AccountCust_acc_id, Book_bookNumber, date } = req.body;

    //check if book exists in wishlist
    pool.query(queries.checkAccountExistInWishlist, [AccountCust_acc_id], (error, results) => {
        if (results.rows.length) {
            pool.query(queries.checkBookExistInWishlist, [AccountCust_acc_id, Book_bookNumber], (error, results) => {
                if (results.rows.length) {
                    res.send("This book already in your wishlist!");
                } else {
                    // Add book to wishlist
                    pool.query(queries.addBookToWishlist,
                        [
                            AccountCust_acc_id,
                            Book_bookNumber,
                            date
                        ], 
                        (error, results) => {
                        if (error) {
                            throw error
                        }
                        res.status(201).send("Book has been added to wishlist!");
                    })
                }
            })
        } else {
            // add book to wishlist
            pool.query(queries.addBookToWishlist,
                [
                    AccountCust_acc_id,
                    Book_bookNumber,
                    date
                ], 
                (error, results) => {
                if (error) {
                    throw error
                }
                res.status(201).send("Book has been added to wishlist!");
            })
        } 
    })
}

const removeWishlist = (req, res) => {
    const accountID = parseInt(req.params.accountID)
    const bookNumber = parseInt(req.params.bookNumber)
   
    pool.query(queries.checkAccountExistInWishlist, [accountID], (error, results) => {
        if (results.rows.length) {
            pool.query(queries.checkBookExistInWishlist, [accountID, bookNumber], (error, results) => {
                if (results.rows.length) {
                    pool.query(queries.removeWishlist, [accountID, bookNumber], (error, results) => {
                        if (error) {
                            throw error
                        }
                        res.status(200).send(`Book deleted with ID: ${bookNumber} from wishlist`)
                    })
                } else {
                    res.send("Book not found in your wishlist!")
                }
            })
        } else {
            res.send("Wishlist Empty!")
        }
    })
}

//TRY TO CREATE SQL BUILDER FOR QUERIES
//SQL query based on user input
const buildDynamicQuery = (baseQuery, params) => {
    let query = baseQuery;
    const values = [];

    if (params.filter && params.filterValue) {
        query += ` WHERE "${params.filter}" = ${params.filterValue}`;
    }

    if (params.orderBy) {
        query += ` ORDER BY ${params.orderBy}`;
    }

    if (params.limit) {
        query += ` LIMIT ${params.limit}`;
    }

    if (params.offset) {
        query += ` OFFSET ${params.offset}`;
    }

    return { query, values };
};

const searchBook = (req, res) => {
    const { filter, filterValue, orderBy, limit, offset } = req.body;
    const baseQuery = 'SELECT * FROM "Book"';
    const { query, values } = buildDynamicQuery(baseQuery, { filter, filterValue, orderBy, limit, offset });

    pool.query(query, values, (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
       // console.log(buildDynamicQuery(baseQuery, { filter, filterValue, orderBy, limit, offset }))
    });
};
//end of SQL Builder


//TCL Updating Book
const updateBook = async (req, res) => {
    const bookNumber = parseInt(req.params.bookNumber);
    
    const { publisherID, bookName, publicationYear, pages, rating, price } = req.body;

    const client = await pool.connect(); // get a client from the pool

    try {
        await client.query('BEGIN'); // start a transaction

        // Check if the book exists
        const bookExistsResult = await client.query(queries.getBookById, [bookNumber]);

        if (bookExistsResult.rows.length === 0) {
            await client.query('ROLLBACK'); // rollback the transaction if book does not exist
            return res.status(404).send(`Book with ID ${bookNumber} not found.`);
        }

        // Update book attributes conditionally
        if (publisherID !== undefined) {
            await client.query(queries.updateBookPublisher, [publisherID, bookNumber]);
        }
        if (bookName !== undefined) {
            await client.query(queries.updateBookName, [bookName, bookNumber]);
        }
        if (publicationYear !== undefined) {
            await client.query(queries.updateBookPublicationYear, [publicationYear, bookNumber]);
        }
        if (pages !== undefined) {
            await client.query(queries.updateBookPages, [pages, bookNumber]);
        }
        if (rating !== undefined) {
            await client.query(queries.updateBookRating, [rating, bookNumber]);
        }
        if (price !== undefined) {
            await client.query(queries.updateBookPrice, [price, bookNumber]);
        }

        await client.query('COMMIT'); // commit the transaction if all queries were successful
        return res.status(200).send(`Book with ID ${bookNumber} updated successfully.`);
    } catch (error) {
        await client.query('ROLLBACK'); // rollback the transaction in case of an error
        console.error('Error updating book:', error);
        return res.status(500).send('Internal Server Error');
    } finally {
        client.release(); // release the client back to the pool
    }
};

//TCL add Purchase
// const addPurchase = async (req, res) => {
//     const {  timestamp, emp_id, stock_id, custNumber, quantity } = req.body;
//     const client = await pool.connect(); // get a client from the pool

//     try {
//         await client.query('BEGIN'); // start a transaction

//         // Insert into Purchase table
//         const purchaseResult = await client.query(queries.addPurchase, 
//             [
//                 timestamp, 
//                 emp_id, 
//                 stock_id, 
//                 custNumber, 
//                 quantity
//             ]) 

//         let purchase_id = purchaseResult.rows[0].purchase_id; // Assuming the purchase_id column exists in the result

//         // update total price in Purchase table
//         await client.query(queries.updateTotalPrice, [purchase_id])

//         // Update Stock table
//         await client.query(queries.updateStock, [quantity, purchase_id])

//         await client.query('COMMIT'); // commit the transaction if all queries were successful
//         return res.status(201).send(`Purchase added and stock updated successfully.`);

//     } catch (error) {
//         await client.query('ROLLBACK'); // rollback the transaction in case of an error
//         console.error('Error adding purchase and updating stock:', error);
//        // return res.status(500).send('Internal Server Error');
//     } finally {
//         client.release(); // release the client back to the pool
//     }
// };

const addPurchase = async (req, res) => {
    const {  timestamp, emp_id, stock_id, custNumber, quantity, store_id } = req.body;
    const client = await pool.connect(); // get a client from the pool

    try {
        await client.query('BEGIN'); // start a transaction

        // Insert into Purchase table
        const purchaseResult = await client.query(queries.addPurchase, 
            [
                timestamp, 
                emp_id, 
                stock_id, 
                custNumber, 
                quantity
            ]) 

        let purchase_id = purchaseResult.rows[0].purchase_id; // Assuming the purchase_id column exists in the result

        // update total price in Purchase table
        await client.query(queries.updateTotalPrice, [purchase_id])

        // Update Stock table
        const stockResult = await client.query(queries.updateStock, [quantity, purchase_id, store_id])
        const updatedQuantity = stockResult.rows[0].quantity; // Assuming the quantity column exists in the result

        if (updatedQuantity < 0) {
            await client.query('ROLLBACK'); // rollback the transaction if quantity is negative
            return res.status(400).send('No More Stock Available!');
        }

        await client.query('COMMIT'); // commit the transaction if all queries were successful
        return res.status(201).send(`Purchase added and stock updated successfully.`);

    } catch (error) {
        await client.query('ROLLBACK'); // rollback the transaction in case of an error
        console.error('Error adding purchase and updating stock:', error);
        return res.status(500).send('Internal Server Error');
    } finally {
        client.release(); // release the client back to the pool
    }
};

//TCL add book + add stock
const addBook = async (req, res) => {
    const { bookDetails, stockDetails } = req.body;
    
    const { publisherID, bookName, publicationYear, pages, rating, price } = bookDetails;
    const { Store_store_id, quantity } = stockDetails;

    const client = await pool.connect(); // get a client from the pool
    
    try {
        await client.query('BEGIN'); // start a transaction
        // Check if Title exists

        const checkTitleResult = await client.query(queries.checkTitleExist, [bookName])
         
        if (checkTitleResult.rows.length) {
            await client.query('ROLLBACK'); // rollback the transaction if book does not exist
            return res.status(404).send(`Book with Title ${bookName} already exists.`);
            }

        // Add book to database
        const addBookResult = await client.query(queries.addBook,
            [
                publisherID,
                bookName, 
                publicationYear, 
                pages, 
                rating, 
                price,
            ])
        
        let bookNumber = addBookResult.rows[0].bookNumber; // Assuming the bookNumber column exists in the result
        
        await client.query(queries.addStock,
            [
                Store_store_id,
                bookNumber,
                quantity
            ])
       
        await client.query('COMMIT'); // commit the transaction if all queries were successful
        return res.status(201).send(`Book added and stock updated successfully.`);
        
    } catch (error) {
    await client.query('ROLLBACK'); // rollback the transaction in case of an error
    res.send("There is something wrong!");
  }finally {
    client.release(); // release the client back to the pool
  }
}


module.exports = {
    getBooks,
    getBookById,
    addBook,
    removeBook,
    getWishlist,
    addBookToWishlist,
    removeWishlist,
    searchBook,
    updateBook,
    addPurchase
}