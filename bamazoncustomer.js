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


var initalStock;
var idSelected;
var userQnt;
var quantLeft;
var userInputs = [];

function buyItem(){

    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        
        //console.log(res);

        myItems = res

        var myItemIdlist = [];
       

        for (var i = 0; i < res.length; i++) {
          myItemIdlist.push(myItems[i].item_id);
        }

console.log(myItemIdlist);

inquirer.prompt(
  [{
  name:"itemId",
  type:"input",
  message:"Please select the id of the product you would like to purchase",
  validate: function (value){
   for (var i = 0; i < res.length; i++) {
     if(value == res[i].item_id) {
      return true;
      console.log("response is" + res[i].item_id);
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
    for (var i = 0; i < res.length; i++) {
      if(value <= res[i].stock_quantity){
        //console.log(res[i].stock_quantity);
        userQnt = res[i].stock_quantity;
        return true;
      }//end of if  
    }//end of loop
    return "Sorry that is an insufficient ammount";
  }//ohter validate function
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
      console.log(userInputs);

        var query = "SELECT stock_quantity from products where?";
        connection.query(query, {item_id: results.itemId}, function (err,res){

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
              console.log(quantLeft);
              console.log("USERINPUTID " + idSelected);
              console.log("Your purchase was made successfully!");
              //console.log(res.affectedRows + "ROWS AFFECTED");
              console.log(query1.sql);
              showList();
              //for (var i = 0; i < res.length; i++) {
              //console.log("Product ID: " + res[i].item_id + " || Product: " + res[i].product_name + " Price: " + res[i].price + " Department: " + res[i].department_name + " Quantity: " + res[i].stock_quantity);
              //console.log("======================================================================================")
            //}

            }

            );
});


      buyItem();
    }//end of results function
);//end of .then 


  
});//end of connection query
}//end of buy item function

buyItem();
function showList (){
connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log("Product ID: " + res[i].item_id + " || Product: " + res[i].product_name + " Price: " + res[i].price + " Department: " + res[i].department_name + " Quantity: " + res[i].stock_quantity);
      console.log("======================================================================================")
    }
    //console.log(res[0].product_name);
  });
}

