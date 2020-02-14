INSERT INTO departments(name)
	VALUES ("Engineering"), ("Accounting");
    
INSERT INTO roles(title, salary, depart_id)
	VALUES ('Project Engineer', 110000, 1),
    ('Business Analyst', 86000, 2),
    ('Feild Engineer', 87000, 1);
    
INSERT INTO employees(first_name, last_name, role_id)
	VALUES ('Renee', 'Mitchell-Matsuyama', 1),
    ('Phill', 'Mitchell-Matsuyama', 3),
    ('Starfish', 'Turgeon', 2),
    ('Jay','Elkino', 3);