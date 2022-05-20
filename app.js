const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const dotenv = require("dotenv");

dotenv.config();
const uri = process.env.URI;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

let completedList = [];

app.get("/", (req, res) => {

    Item.find({}, (err, docs) => {

        if (!err) {
            res.render("list", { listTitle: "To-Do List", newListItems: docs });
        } else {
            console.log(err);
        }
    });
});

app.post("/", async (req, res) => {

    const itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    });

    await item.save();
    res.redirect("/");
});

app.post("/delete", (req, res) => {

    const deleteItemId = req.body.delete;

    Item.findByIdAndRemove(deleteItemId, (err) => {
        if (!err) {
            console.log("deleted");
            res.redirect("/");
        } else {
            console.log(err);
        }
    });
});

app.get("/completed", function(req, res) {
    res.render("completed", { listTitle: "Completed", newListItems: completedList });
});

app.post("/completed", (req, res) => {
    const checkedItemId = req.body.checkbox;

    Item.findOne({ _id: checkedItemId }, async (err, docs) => {

        if (!err) {
            completedList.length > 24 ? completedList.unshift(docs.name) && completedList.pop() : completedList.unshift(docs.name);

            await Item.findByIdAndRemove(checkedItemId, (err) => {
                if (!err) {
                    console.log("Completed item removed from DB");
                } else {
                    console.log("Error deleting completed item from DB: ", err);
                }
            });

            res.redirect("/");

        } else {
            console.log("Error finding item in DB: ", err);
        }
    })
});

app.get("/about", function(req, res) {
    res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function() {
    console.log("Server has started successfully.");
});