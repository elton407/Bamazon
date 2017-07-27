var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "Bamazon_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  showList();
});
var userId;
var quantityRemaining;
var initalStock;
var idSelected;
var userQnt;
var quantLeft;
var userInputs = [];

function buyItem(){

    //console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        
        //console.log(res);

        myItems = res

        var myItemIdlist = [];
       

        for (var i = 0; i < res.length; i++) {
          myItemIdlist.push(myItems[i].item_id);
        }
//console.log(myItemIdlist);
inquirer.prompt(
  [{
  name:"itemId",
  type:"input",
  message:"Please select the id of the product you would like to purchase",
  validate: function (value){
   for (var i = 0; i < res.length; i++) {
     if(value == res[i].item_id) {
      userId = parseInt(value);
      validateQuantity();
      return true;
      //console.log("response is" + res[i].item_id);
     }//end of if 
   }//end of loop
   return "Enter a valid Product ID";
  //end of validate 
  }
},{
  name: "itemQnt",
  type:"input",
  message:"How many Would you like to purchase",
  validate: function (value){
    var result = value % 1;
    if (value > 0 && result == 0 && value <= quantityRemaining){
    for (var i = 0; i < res.length; i++) {
      if(value <= res[i].stock_quantity){
        //console.log(res[i].stock_quantity);
        userQnt = value;
        return true;
      }//edn of 2nd if
      }//end of if  
    }//end of loop
    return "Sorry that is an insufficient ammount";
  }//end ohter validate function
//q2
//end of prompt
}]).then(
    function(results) {
      promptInputs = {
        item_id: parseInt(results.itemId),
        stock_quantity: parseInt(results.itemQnt)
      }
      userInputs.pop();
      userInputs.push(promptInputs);
      //console.log(userInputs);

        var query = "SELECT stock_quantity from products where?";
        connection.query(query, {item_id: results.itemId}, function (err,res){
        initalStock = parseInt(res[0].stock_quantity);
        quantLeft = parseInt(res[0].stock_quantity - userInputs[0].stock_quantity);
        idSelected = parseInt(userInputs[0].item_id);
        //console.log(quantLeft);
        //});
          var query1 = 

          connection.query(
            "UPDATE products SET ? WHERE ?", 
            [{
              stock_quantity: quantLeft
            },
            {
              item_id: results.itemId
            }
            ],
            function(error) {
              if (error) throw err;
              //console.log(quantLeft);
              //console.log("USERINPUTID " + idSelected);
              checkoutPrice();
              console.log("Your purchase was made successfully!");
              console.log()
              //console.log(res.affectedRows + "ROWS AFFECTED");
              //console.log(query1.sql);
              setTimeout(showList, 500);
              //for (var i = 0; i < res.length; i++) {
              //console.log("Product ID: " + res[i].item_id + " || Product: " + res[i].product_name + " Price: " + res[i].price + " Department: " + res[i].department_name + " Quantity: " + res[i].stock_quantity);
              //console.log("======================================================================================")
            //}

            }

            );
});

      start();
    }//end of results function
);//end of .then 
  
});//end of connection query
}//end of buy item function

function validateQuantity (){
    var query2 = "SELECT stock_quantity from products where ?";
        connection.query(query2, {item_id: userId}, function (err,res){
          quantityRemaining = parseInt(res[0].stock_quantity);
          console.log("The quantity of this product is currently: " + quantityRemaining);
          });
}

function checkoutPrice() {
  var query3 = "select price FROM products WHERE ?"
  connection.query(query3, {item_id: userId}, function (err,res){
    var totalPrice = res[0].price * userQnt;
    console.log("The total price of your purchase is: $" + totalPrice);
  });
}

//buyItem();
function showList (){
connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log("  ");
      console.log("Product ID: " + res[i].item_id + " || Product: " + res[i].product_name + " Price: " + res[i].price + " Department: " + res[i].department_name + " Quantity: " + res[i].stock_quantity);
      console.log("======================================================================================")
    }
    //console.log(res[0].product_name);
  });
}
function start(){setTimeout(buyItem, 1000)}
start();

