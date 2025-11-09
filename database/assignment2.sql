-- Assignment 2 - Task One (robust version)
-- File: assignment2.sql
-- Notes:
--  - Single statement per task (1~6)
--  - UPDATE/DELETE of single record use the PRIMARY KEY
--  - Path update is idempotent (won't double-insert "/vehicles/")

-- 1) Insert Tony Stark (account_id & account_type handled automatically)
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2) Promote Tony Stark to Admin (locate by PK)
UPDATE account
   SET account_type = 'Admin'
 WHERE account_id = (
   SELECT account_id FROM account WHERE account_email = 'tony@starkent.com'
 );

-- 3) Delete Tony Stark (locate by PK)
DELETE FROM account
 WHERE account_id = (
   SELECT account_id FROM account WHERE account_email = 'tony@starkent.com'
 );

-- 4) Update GM Hummer description using REPLACE()
--    change 'small interiors' -> 'a huge interior'
UPDATE inventory
   SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
 WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5) INNER JOIN: Sport vehicles (should return exactly two rows if seed data has 2 'Sport')
SELECT i.inv_make,
       i.inv_model,
       c.classification_name
  FROM inventory AS i
  JOIN classification AS c
    ON i.classification_id = c.classification_id
 WHERE c.classification_name = 'Sport';

-- 6) Update image paths to include '/vehicles' (idempotent single statement)
--    Example final path: /images/vehicles/a-car-name.jpg
UPDATE inventory
   SET inv_image     = REPLACE(inv_image,     '/images/', '/images/vehicles/'),
       inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
 WHERE (inv_image     LIKE '/images/%' AND inv_image     NOT LIKE '/images/vehicles/%')
    OR (inv_thumbnail LIKE '/images/%' AND inv_thumbnail NOT LIKE '/images/vehicles/%');
