-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS boupetique_db;
-- Seleccionar la base de datos para trabajar en ella
USE boupetique_db;
CREATE TABLE brands (
   brand_id INT AUTO_INCREMENT PRIMARY KEY,
   brand_name VARCHAR(50) NOT NULL
);
CREATE TABLE categories (
   category_id INT AUTO_INCREMENT PRIMARY KEY,
   category_name VARCHAR(50) NOT NULL
);
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    prescription BOOLEAN DEFAULT FALSE,
    weight DECIMAL(8, 2),
    unit VARCHAR(20),
    url_img VARCHAR(255),
    category_id INT,
    brand_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id)
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY, 
    user_name VARCHAR(100) NOT NULL,
    surnames VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL,
    birthdate DATE,
    password_site VARCHAR(255) NOT NULL                          
);

CREATE TABLE pets_type(
petype_id INT AUTO_INCREMENT PRIMARY KEY,
petype_name VARCHAR(100) NOT NULL
);
-- tabla pets
CREATE TABLE pets (

pet_id INT AUTO_INCREMENT PRIMARY KEY,

pet_name VARCHAR(100) NOT NULL,

pet_age VARCHAR(100) NOT NULL,

pet_weight VARCHAR(100) NOT NULL,

pet_size VARCHAR(100) NOT NULL,

user_id INT,

pet_type_id INT,
-- Relación con users
CONSTRAINT fk_user_id
FOREIGN KEY (user_id)
REFERENCES users (user_id),

CONSTRAINT fk_petype_id
FOREIGN KEY (pet_type_id)
REFERENCES pets_type (petype_id)
);

CREATE TABLE orders ( 
order_Id INT AUTO_INCREMENT Primary Key ,  
Total_amount DECIMAL(8,2) NOT NULL, 
order_date DATETIME NOT NULL, 
status_o VARCHAR(100) NOT NULL,  
payment_id INT, 
user_id INT NOT NULL,
CONSTRAINT fk_orders_user_id
FOREIGN KEY (user_id)
REFERENCES users (user_id)
);

CREATE TABLE payment ( 
payment_id INT AUTO_INCREMENT PRIMARY key, 
order_id INT NOT NULL, 
payment_method VARCHAR (50) NOT NULL, 
amount DECIMAL(10,2) NOT NULL, 
CONSTRAINT fk_payment_order 
FOREIGN KEY (order_id) 
REFERENCES orders (order_id)
);

CREATE TABLE product_details (
detail_order_id INT NOT NULL,
product_id INT NOT NULL,
PRIMARY KEY (detail_order_id, product_id),
FOREIGN KEY (detail_order_id) REFERENCES orders(order_id),
FOREIGN KEY (product_id) REFERENCES products(product_id),
state VARCHAR(100) NOT NULL,
quantity INT NOT NULL,
unit_price_historical INT  
);

-- tabla pets
INSERT INTO pets (pet_name, pet_age, pet_weight, pet_size)
VALUES
('Polo', 'Enter 7 y 8 años', 'Entre 25 y 45 kg', 'Mediana'),
('Doggy', 'Más de 10 años', 'Entre 10 y 25 kg', 'Pequeña'),
('Darwin', 'Más de 10 años', 'Entre 10 y 25 kg', 'Pequeña'),
('Felix', 'Entre 2 y 3 años', 'Entre 2 y 10 kg', 'Minis'),
('Mikey', 'Entre 5 y 6 años', 'Entre 25 y 45 kg', 'Grande'),
('Bibble', 'Menos de 1 años', 'Entre 1 y 3 kg', 'Pequeña'),
('Tambor', 'Entre 9 y 10 años', 'Entre 2 y 10 kg', 'Minis'),
('Peeper', 'Más de 10 años', 'Entre 10 y 25 kg', 'Pequeña'),
('Max', 'Entre 7 y 8 años', 'Entre 25 y 45 kg', 'Grande');

-- tabla pets_type
INSERT INTO pets_type (petype_name)
VALUES
('Perro'), ('Perro'), ('Perro'), ('Gato'), ('Perro'),('Gato'),('Gato'), ('Gato'), ('Perro');

-- tabla ususarios
INSERT INTO users (user_name, surnames, phone_number, email, birthdate, password_site) 
VALUES 
('Sebastian', 'Aldaco', '5551234567', 'el.sebas@email.com', '1998-05-15', 'pass_sebas123'),
('Dayana', 'Jiménez', '5552345678', 'daya.jimenez@email.com', '2000-08-22', 'pass_daya456'),
('Andres', 'Carrizosa', '5553456789', 'carrizosa.andy@email.com', '1995-11-03', 'pass_andy789'),
('Christopher', 'Blanco', '5554567890', 'chris.blanco@email.com', '1997-02-18', 'pass_chris321'),
('Eduardo', 'Olan', '5555678901', 'eduardo.olan@email.com', '1999-09-10', 'pass_olan654'),
('Eduardo', 'Alejandro', '5556789012', 'eduardo.tocayo@email.com', '1996-04-25', 'pass_ale987'),
('Lizbeth', 'Torres', '5557890123', 'liz.torres@email.com', '2001-12-05', 'pass_liz147'),
('Fernanda', 'Jimenez', '5558901234', 'fer.jimenez@email.com', '1998-07-30', 'pass_fer258'),
('Zaira', 'Lamas', '5559012345', 'zai.lamas@email.com', '2002-01-14', 'pass_zai369'),
('Jaime', 'Velazquez', '5550123456', 'jaime.velazquez@email.com', '1994-06-20', 'pass_jaime852');

-- tabla categorías
INSERT INTO categories (category_name) 
VALUES ('Alimento Seco'),
('Alimento Húmedo'), ('Juguetes'), ('Accesorios'), ('Higiene y Cuidado'), ('Camas y Muebles'), ('Ropa para Mascotas'), ('Medicamentos'), ('Premios y Snacks'), ('Transportadoras');

-- tabla brands
INSERT INTO brands (brand_name) 
VALUES ('Royal Canin'),
('Purina'), ('Pedigree'), ('Whiskas'), ('Nupec'), ('Hills Science Diet'), ('Pro Plan'), ('Felix'), ('Eukanuba'), ('Orijen');

-- tabla productos
INSERT INTO products (sku,title,price,stock, prescription, weight,url_img,category_id, brand_id) 
VALUES
('1','Open Farm Grain-Free Dry Dog Food',450.00,10,true,10.0,'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSKLNItS0THGAYp_jniqS5gsVP7ACnwBEp4IDM7P3m8POIJfFNC5cxMYzCMw48zbAABI7dKgwuvt-Xh3vK7xRhCfGb-rDDyJA',1,1),
('2','Pet Magic Shampoo Blueberry',346.70,35,false,5.0,'https://liveinthelight.co.uk/cdn/shop/files/Pet-Magic-Shampoo-by-Vermont-Soap_2_580x@2x.jpg?v=1778675960',1,3),
('3','KONA CAVE Cojín Ortopédico Viscoelástico',2014.82,10,false,6.1,'https://www.dogelthy.com/cdn/shop/files/02_MEDIANA_GRIS_PERRO.png?v=1774471024&width=713',1,2),
('4','Juguete Kong Llanta (Traxx)',425.00,50,false,7.5,'https://m.media-amazon.com/images/I/718fOhQbuOL._AC_SY300_SX300_QL70_ML2_.jpg',3,4),
('5','Pet Bath Shampoo',265.00,200,false,0.5,'https://m.media-amazon.com/images/I/71OhwbObrnL._AC_SL1500_.jpg',5,4),
('6','Shampoo Hipoalergenico Artesanal',219.00,100,false,1.50,'https://alnut.mx/wp-content/uploads/2020/05/300x300_PortadaTe1-1.jpg',5,2),
('7','Mueble rascador para gato',1299.0,30,false,6.4,'https://sp345.liverpool.com.mx/i/1184392042_4p.jpg',6,6),
('8','Collar Mexicano para gato',300.00,50,false,0.25,'https://kuhu.com.mx/wp-content/uploads/2025/08/Collar-Gato-04.jpg',7,5),
('9','Mazacan El Mazapan para Perro',900.00,86,false,0.19,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHKZgfi77WeubJz02HcOR7wjEryVHzdUZ2kfQRF_kNEQ&s',1,7);


-- tabla orders
INSERT INTO orders (Total_amount, order_date, status_o, payment_id, user_id ) 
VALUES
(295.6, '2026-10-11 15:00:00', 'Pendiente', 1, 1),  
(1233.6, '2026-10-11 15:10:00', 'enviado', 2, 2),
(499.4, '2026-10-11 17:30:00', 'enviado', 3, 3),
(534.3, '2026-10-12 09:00:00', 'Pendiente', 4, 4),
(311.3, '2026-10-12 11:00:00', 'enviado', 5, 5),
(222.3, '2026-10-12 16:40:00', 'enviado', 6, 6),
(294.50, '2026-10-13 15:00:00', 'Pendiente', 7, 7),
(200.5, '2026-10-14 15:00:00', 'Cancelado', 8, 8),
(299.5, '2026-10-14 18:30:00', 'Pagado', 9, 9);

-- tabla payments
INSERT INTO payment (order_Id, payment_method,amount) 
VALUES 
(1, 'CreditCard',150.50), 
(2, 'OXXO', 200.00), 
(3, 'DebitCard',399.99), 
(4, 'BankTransfer', 580.50), 
(5, 'DebitCard', 2014.82),
(6, 'CreditCard', 89.99), 
(7, 'OXXO', 1050.00), 
(8, 'OXXO', 1800), 
(9, 'BankTransfer', 3200.00);

-- tabla product_details
INSERT INTO product_details (detail_order_id, product_id, state, quantity, unit_price_historical) 
VALUES (1, 3, 'Entregado', 1, 850),
(1, 7, 'Enviado', 2, 450), 
(3, 3, 'Enviado', 1, 150), 
(2, 5, 'Procesando', 3, 850), 
(2, 4, 'Procesando', 1, 200), 
(3, 5, 'Entregado', 4, 50), 
(4, 4, 'Cancelado', 1, 450), 
(4, 6, 'Cancelado', 2, 120), 
(5, 7, 'Entregado', 1, 900), 
(5, 8, 'Entregado', 5, 30);

-- CONSULTAS
SELECT product_id, title
FROM products;

SELECT * FROM product_details;


SELECT product_id
FROM products;
