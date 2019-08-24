DROP DATABASE bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	product_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255),
	price DECIMAL(7,2), -- 9 digits is 4 bytes per
	stock INTEGER
);

CREATE TABLE orders (
	order_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME NOT NULL DEFAULT(NOW()),
    total_cost DECIMAL(7,2)
);

CREATE TABLE sub_orders (
	product_id INTEGER NOT NULL,
    order_id INTEGER NOT NULL,
	FOREIGN KEY (product_id) REFERENCES products(product_id),
	FOREIGN KEY (order_id) REFERENCES orders(order_id),
	quantity INTEGER
);
	

INSERT INTO products ( name, price, stock )
	VALUES 
		( 'foo', 11.29, 7 ),
		( 'bar', 14.99, 23 ),
        ( 'this', 5.99, 1 ),
        ( 'that', 6.27, 15 ),
        ( 'stuff', 8.72, 50 );
        
INSERT INTO orders ( total_cost )
	VALUES
		( 11 ),
        ( 12 ),
        ( 13 ),
        ( 28 ),
        ( 32 ),
		( 5 ),
        ( 5 ),
        ( 5 );
        
INSERT INTO sub_orders ( order_id, product_id, quantity )
	VALUES 
		( 1, 1, 2 ), -- 2 foos
        ( 1, 2, 1),  -- 1 bar
        ( 2, 4, 4),
        ( 3, 1, 1),
        ( 3, 2, 1),
        ( 3, 3, 1),
        ( 3, 4, 1),
        ( 4, 2, 3),
        ( 4, 3, 3),
        ( 5, 4, 1),
        ( 5, 1, 2),
        ( 5, 2, 1),
        ( 6, 1, 3),
        ( 6, 3, 2),
        ( 7, 1, 1),
        ( 8, 3, 4);
        
SELECT * FROM products;

SELECT sub_orders.product_id, SUM(quantity) AS popularity
	FROM orders
	INNER JOIN sub_orders
		ON orders.order_id = sub_orders.order_id
	JOIN products
		ON products.product_id = sub_orders.product_id
	WHERE orders.created_at > NOW() - INTERVAL 1 WEEK
	GROUP BY sub_orders.product_id;



 -- Want to see that 9 '1's have been ordered
 -- Won't return anything with 0 orders in the last week
WITH popularity AS (
	SELECT sub_orders.product_id, SUM(quantity) AS popularity
	FROM orders
	INNER JOIN sub_orders
		ON orders.order_id = sub_orders.order_id
	JOIN products
		ON products.product_id = sub_orders.product_id
	
	GROUP BY sub_orders.product_id
    ORDER BY SUM(quantity) FILTER(WHERE orders.created_at > NOW() - INTERVAL 1 WEEK)
)
SELECT products.name, products.product_id
	FROM popularity
    RIGHT JOIN products
		ON products.product_id = popularity.product_id
	ORDER BY popularity DESC;
