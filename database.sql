-- Scripts para la base de datos

CREATE DATABASE rotary_club;
USE rotary_club;

CREATE TABLE roles(
    role_id TINYINT NOT NULL,
    role_name VARCHAR(30) NOT NULL,
    PRIMARY KEY(role_id)
)ENGINE=InnoDB;

CREATE TABLE tags(
    tag_id INT NOT NULL,
    tag_name VARCHAR(30) NOT NULL,
    tag_description VARCHAR(100) NOT NULL,
    PRIMARY KEY(tag_id)
)ENGINE=InnoDB;

CREATE TABLE categories(
    category_id INT AUTO_INCREMENT NOT NULL,
    category_name VARCHAR(70) NOT NULL,
    PRIMARY KEY(category_id)
)ENGINE=InnoDB;


CREATE TABLE users(
    user_id INT AUTO_INCREMENT NOT NULL,
    role_id TINYINT NOT NULL,
    firts_name VARCHAR(70) NOT NULL,
    last_name VARCHAR(70) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(11) NOT NULL,
    country VARCHAR(20) NOT NULL,
    address VARCHAR(70 NOT NULL),
    created_at DATETIME DEFAULT NOW(),
    updated_at DATETIME DEFAULT NOW(),
    last_login DATETIME DEFAULT NOW(),
    PRIMARY KEY(user_id),
    FOREIGN KEY(role_id) REFERENCES roles(role_id)
)ENGINE=InnoDB;


CREATE TABLE posts(
    post_id INT AUTO_INCREMENT NOT NULL,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content text COLLATE utf8_unicode_ci NOT NULL,
    updated_at DATETIME DEFAULT NOW(),
    published_at DATETIME DEFAULT NOW(),
    published TINYINT(1) DEFAULT 0,
    PRIMARY KEY(post_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(category_id) REFERENCES categories(category_id)
)ENGINE=InnoDB;

CREATE TABLE agendas(
    post_id INT NOT NULL,
    PRIMARY KEY(post_id),
    FOREIGN KEY(post_id) REFERENCES posts(post_id)
)ENGINE=InnoDB;

CREATE TABLE images(
    image_id INT AUTO_INCREMENT NOT NULL,
    post_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    upload_at DATETIME DEFAULT NOW(),
    PRIMARY KEY(image_id),
    FOREIGN KEY(post_id) REFERENCES posts(post_id)
)ENGINE=InnoDB;

CREATE TABLE posts_tags(
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY(post_id, tag_id),
    FOREIGN KEY(post_id) REFERENCES posts(post_id),
    FOREIGN KEY (tag_id) REFERENCES tags(tag_id)
)ENGINE=InnoDB;

ALTER TABLE users ADD COLUMN active TINYINT(1) DEFAULT 1;


-- Seeders de la base de datos para poblarla

-- Tabla de roles
INSERT INTO roles( role_name ) VALUES('Administrador');

-- Tabla de usuarios
INSERT INTO users( role_id, first_name, last_name, email, password ) VALUES( 0, 'Angel Jose', 'Castillo Portillo', '123456', 'correo@gmail.com' );

-- Tabla de categorias
INSERT INTO categories( category_name ) VALUES( 'Educación' );