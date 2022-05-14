const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://new-user-1:odKSO34iwe537@cluster0.qovp6.mongodb.net/todolistDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

// Routes

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

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully.");
});
