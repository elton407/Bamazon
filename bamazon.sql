CREATE DATABASE Bamazon_DB;
USE Bamazon_DB;
CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) not null,
    department_name VARCHAR(50) not null,
    price INT not null,
    stock_quantity INT (5) not null,
    primary key (item_id)
);

Insert Into products (product_name, department_name, price, stock_quantity)
VALUES ("Mens Coat","Mens",100 ,5),("Women's Coat","Womens",100 ,5),
("Mens Blazer","Men's",95 ,7),("Womens Blazer","Womens",80 ,5),("Leather Shoes","Mens Shoes",60 ,5);