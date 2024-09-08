CREATE TABLE enterprises (
                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             name VARCHAR(255) NOT NULL
);

INSERT INTO enterprises (name) VALUES ('Компания 1');
INSERT INTO enterprises (name) VALUES ('Компания 2');
INSERT INTO enterprises (name) VALUES ('Компания 3');

CREATE TABLE employees (
                           id BIGINT AUTO_INCREMENT PRIMARY KEY,
                           first_name VARCHAR(255),
                           last_name VARCHAR(255),
                           post VARCHAR(255),
                           enterprise_id BIGINT,
                           FOREIGN KEY (enterprise_id) REFERENCES enterprises(id)
);

INSERT INTO employees (enterprise_id, first_name, last_name, post) VALUES (1, 'Иван', 'Иванов', 'Программист');
INSERT INTO employees (enterprise_id, first_name, last_name, post) VALUES (1, 'Петр', 'Петров', 'Менеджер');