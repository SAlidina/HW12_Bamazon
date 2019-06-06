const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    //mysql username
    user: "root",

    //mysql password
    password: "password",

    database: "bamazon_db"
});

//callback
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId);
    console.log("=============================================");
    displayProd();
})

//function that displays all the products avaialbe for purchase
function displayProd() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id +
                "\ Product Name: " + res[i].product_name +
                "\ Price: " + parseFloat(res[i].price).toFixed(2) +
                "\ Stock: " + res[i].stock_quantity);
        }
        console.log("=============================================");
        //call function after list is displayed
        purchase();
    })
};
//asks user two questions through prompt
function purchase() {
    inquirer.prompt([
        {
            //first question, user must input ID
            name: "IDChoice",
            type: "input",
            message: "What product would you like to purchase? Please enter the item ID: "
        },
        {
            //second question, user must input a valid stock quantity
            name: "quantityChoice",
            type: "input",
            message: "How  many units would you like to purhcase? Please enter a valid number: "
        }
    ])
        .then(function (answer) {
            connection.query("SELECT * FROM products WHERE item_id=?", answer.IDChoice, function (err, res) {
                if (err) throw (err);

                if (res.length === 0) {
                    console.log("\n I'm sorry, that product is no longer in stock. Please select another product.");
                    console.log("=============================================");
                    purchase();
                }

                for (var j = 0; j < res.length; j++) {
                    if (answer.quantityChoice > res[j].stock_quantity) {
                        console.log("<<INSUFFICIENT QUANTITY>> | There is not enough stock, please choose a valid amount." +
                            "\nProduct: " + res[j].product_name +
                            "\nWe only have " + res[j].stock_quantity + " left!");

                        console.log("=============================================");

                        purchase();
                    }
                    else {
                        var totalAmnt = res[j].price * answer.quantityChoice;

                        console.log("\n Product Successfully Purchase!" +
                            "\n Purchase Summary" +
                            "\n Product Name: " + res[j].product_name +
                            "\n Quantity: " + answer.quantityChoice +
                            "\n Price/Unit: " + res[j].price +
                            "\n Total: " + parseFloat(totalAmnt.toFixed(2)));

                        var uptdStock = res[j].stock_quantity - answer.quantityChoice;

                        connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?",
                            [uptdStock, answer.IDChoice],

                            function (err, res) {
                                if (err) throw err;
                            });
                        connection.query("SELECT * FROM products WHERE item_id=?", answer.IDChoice, function (err, res) {
                            if (err) throw err;

                            for (var k = 0; k < res.length; k++) {
                                console.log("\nInventory UPDATED!");
                                console.log("");

                                promptAgain();

                            }
                        });
                    }
                }
            })
        });
};

function promptAgain() {
    inquirer.prompt([
        {
            name: "again",
            type: "confirm",
            message: "Would you like to make another purchase?",
        }
    ])
        .then(function (answer) {
            if (answer.again) {
                purchase();
            }
            else {
                console.log("Thank you, come again!");
                connection.end();
            }
        });
}