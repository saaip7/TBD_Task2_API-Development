const { Router } = require("express")
const controller = require('./controller')

const router = Router();

//Create (POST)
router.post("/addbook/", controller.addBook)
router.post("/wishlist/add/", controller.addBookToWishlist)
router.post("/search-book", controller.searchBook);
router.post("/addpurchase", controller.addPurchase)

//Read (GET)
router.get("/", controller.getBooks) 
router.get("/:bookNumber", controller.getBookById)
router.get("/wishlist/:id", controller.getWishlist)


//Update (PUT)
router.put("/update/:bookNumber", controller.updateBook)

//Delete (DELETE)
router.delete("/delete/:book_id", controller.removeBook)
router.delete("/wishlist/delete/:accountID/:bookNumber", controller.removeWishlist)

module.exports = router