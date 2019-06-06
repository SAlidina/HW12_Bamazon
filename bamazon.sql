DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    item_id INT(50) NOT NULL AUTO INCREMENT,
    product_name VARCHAR(50) NULL,
    price DECIMAL(10,2) NULL,
    stock_quantity INT(50) NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO  products (product_name, price, stock_quantity)
VALUE ("Ream of Paper", 1.50, 30),
("Box of Pens", 5.25, 12),
("Folder", 0.25, 25),
("Box of Pencils", 2.99, 15),
("SketchBook", 10.99, 23),
("College Ruled Notebook", 3.99, 19),
("Marker Set", 8.99, 26),
("Binder", 1.99, 35);

SELECT * FROM products;