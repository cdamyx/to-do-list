const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const dotenv = require("dotenv");

dotenv.config();
const uri = process.env.URI;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
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

let completedList = ["one", "two", "three"];

// {id: 1, name: "one"},
//   {id: 2, name: "two"},
//   {id: 3, name: "three"}


app.get("/", (req, res) => {

  Item.find({}, (err, docs) => {

    if (!err) {
      res.render("list", {listTitle: "To-Do List", newListItems: docs});
    } else {
      console.log(err);
    }
  });
});

app.post("/", async (req, res) => {

  const itemName = req.body.newItem;

  const item = new Item ({
    name: itemName
  });

  await item.save();
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, (err) => {
    if(!err) {
      console.log("deleted");
      res.redirect("/");
    }
  });
});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/completed", function(req, res){
  res.render("completed", {listTitle: "Completed", newListItems: completedList});
});

app.post("/completed", (req, res) => {
  const checkedItemId = req.body.checkbox;
  // console.log(checkedItemId.innerText);
  // completedList.push(checkedItemId.innerText)

  Item.findOne({_id : checkedItemId}, (err, docs) => {
    if(!err) {
      completedList.push(docs.name);
      // Item.deleteOne(checkedItemId);
      res.redirect("/");
    }
  })
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully.");
});
