-- Scripts para la base de datos

CREATE DATABASE rotary_club;
USE rotary_club;

CREATE TABLE users(
    user_id INT AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(70) UNIQUE NOT NULL,
    phone VARCHAR(11) NOT NULL,
    address VARCHAR(70) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT NOW(),
    updated_at DATETIME DEFAULT NOW(),
    last_login DATETIME DEFAULT NOW(),
    role_id TINYINT NOT NULL,
    active TINYINT(1) DEFAULT 1,
    PRIMARY KEY(user_id)
);

CREATE TABLE posts(
    post_id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    category_id TINYINT NULL DEFAULT 1,
    title VARCHAR(100) NOT NULL,
    published_at DATETIME DEFAULT NOW(),
    updated_at DATETIME DEFAULT NOW(),
    content TEXT NULL,
    description VARCHAR(170) NOT NULL,
    published TINYINT(1) DEFAULT 0,
    profile VARCHAR(255) NULL,
    PRIMARY KEY(post_id)
);

CREATE TABLE entries(
    post_id INT NOT NULL,
    entry_date DATETIME DEFAULT NOW(),
    PRIMARY KEY(post_id)
);

CREATE TABLE images(
    image_id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    post_id INT NOT NULL,
    upload_at DATETIME DEFAULT NOW(),
    PRIMARY KEY(image_id)
);

CREATE TABLE codes(
    code_id SMALLINT AUTO_INCREMENT,
    user_id INT NOT NULL,
    code VARCHAR(6) NOT NULL,
    PRIMARY KEY(code_id)
);

CREATE TABLE roles(
    role_id TINYINT AUTO_INCREMENT,
    role VARCHAR(30) NOT NULL,
    PRIMARY KEY(role_id)
);

CREATE TABLE categories(
    category_id TINYINT AUTO_INCREMENT,
    category VARCHAR(20) NOT NULL,
    PRIMARY KEY(category_id)
);

CREATE TABLE posts_tags(
    tag_id SMALLINT NOT NULL,
    post_id INT NOT NULL,
    PRIMARY KEY(tag_id, post_id)
);

CREATE TABLE tags(
    tag_id SMALLINT AUTO_INCREMENT,
    tag_content VARCHAR(20) NOT NULL,
    tag_description VARCHAR(100) NOT NULL,
    PRIMARY KEY(tag_id)
);

ALTER TABLE codes ADD FOREIGN KEY(user_id) REFERENCES users(user_id);
ALTER TABLE users ADD FOREIGN KEY(role_id) REFERENCES roles(role_id);
ALTER TABLE posts ADD FOREIGN KEY(user_id) REFERENCES users(user_id);
ALTER TABLE posts ADD FOREIGN KEY(category_id) REFERENCES categories(category_id);
ALTER TABLE images ADD FOREIGN KEY(post_id) REFERENCES posts(post_id);
ALTER TABLE posts_tags ADD FOREIGN KEY(tag_id) REFERENCES tags(tag_id);
ALTER TABLE posts_tags ADD FOREIGN KEY(post_id) REFERENCES posts(post_id);
ALTER TABLE entries ADD FOREIGN KEY(post_id) REFERENCES posts(post_id);



-- Seeders de la base de datos para poblarla

-- Tabla de roles
INSERT INTO roles( role ) VALUES('Administrador');

-- Tabla de usuarios
INSERT INTO users( role_id, name, last_name, email, password, phone, address ) VALUES( 1, 'Angel Jose', 'Castillo Portillo', '123456', 'correo@gmail.com', '50496556526','Colonia villa adela, Tegucigalpa, Honduras' );
-- Tabla de categorias
INSERT INTO categories( category ) VALUES( 'Educación' );

-- Tabla de tags
INSERT INTO tags (tag_content, tag_description) VALUES ( 'Ayuda Benefica', 'Hemos recibido o hemos realizado una ayuda benefica' );
INSERT INTO tags (tag_content, tag_description) VALUES ( 'Visitas', 'Hemos realizado una visita' );