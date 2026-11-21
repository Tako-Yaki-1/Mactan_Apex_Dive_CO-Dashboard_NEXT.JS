-- Mactan Apex Dive Co. — Business Analytics Dashboard
-- MySQL 8 / MariaDB schema and seed data.
-- Import with phpMyAdmin: open the SQL tab, paste this file, then run it.
-- Record counts: customers 60, dive_packages 54,
-- marketing_campaigns 54, sales 400, transactions 400.

CREATE DATABASE IF NOT EXISTS mactan_apex_dive
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mactan_apex_dive;

SET NAMES utf8mb4;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS marketing_campaigns;
DROP TABLE IF EXISTS dive_packages;
DROP TABLE IF EXISTS customers;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE customers (
  customer_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(160) NOT NULL,
  city VARCHAR(80) NOT NULL,
  country VARCHAR(80) NOT NULL,
  customer_type ENUM('Local', 'Domestic', 'International') NOT NULL,
  created_at DATE NOT NULL,
  PRIMARY KEY (customer_id),
  UNIQUE KEY uq_customers_email (email),
  KEY idx_customers_type (customer_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE dive_packages (
  package_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  package_name VARCHAR(120) NOT NULL,
  category VARCHAR(60) NOT NULL,
  price_php DECIMAL(10, 2) NOT NULL,
  duration_hours SMALLINT UNSIGNED NOT NULL,
  difficulty ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (package_id),
  KEY idx_packages_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE marketing_campaigns (
  campaign_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  campaign_name VARCHAR(140) NOT NULL,
  channel VARCHAR(60) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget_php DECIMAL(12, 2) NOT NULL,
  target_country VARCHAR(80) NOT NULL,
  PRIMARY KEY (campaign_id),
  KEY idx_campaigns_channel (channel),
  KEY idx_campaigns_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE sales (
  sale_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  customer_id INT UNSIGNED NOT NULL,
  package_id INT UNSIGNED NOT NULL,
  campaign_id INT UNSIGNED NOT NULL,
  sale_date DATE NOT NULL,
  quantity SMALLINT UNSIGNED NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  booking_channel VARCHAR(40) NOT NULL,
  PRIMARY KEY (sale_id),
  KEY idx_sales_date (sale_date),
  KEY idx_sales_customer (customer_id),
  KEY idx_sales_package (package_id),
  KEY idx_sales_campaign (campaign_id),
  CONSTRAINT fk_sales_customer FOREIGN KEY (customer_id) REFERENCES customers (customer_id),
  CONSTRAINT fk_sales_package FOREIGN KEY (package_id) REFERENCES dive_packages (package_id),
  CONSTRAINT fk_sales_campaign FOREIGN KEY (campaign_id) REFERENCES marketing_campaigns (campaign_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE transactions (
  transaction_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  sale_id INT UNSIGNED NOT NULL,
  payment_date DATE NOT NULL,
  payment_method VARCHAR(40) NOT NULL,
  amount_paid DECIMAL(12, 2) NOT NULL,
  status ENUM('Paid', 'Pending', 'Refunded') NOT NULL,
  PRIMARY KEY (transaction_id),
  KEY idx_transactions_sale (sale_id),
  KEY idx_transactions_status (status),
  CONSTRAINT fk_transactions_sale FOREIGN KEY (sale_id) REFERENCES sales (sale_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

START TRANSACTION;

-- Customers
INSERT INTO customers (customer_id, full_name, email, city, country, customer_type, created_at) VALUES
  (1, 'Noah Santos', 'noah.santos1@yahoo.com', 'Singapore', 'Singapore', 'International', '2025-06-21'),
  (2, 'Noah Sato', 'noah.sato2@gmail.com', 'San Francisco', 'United States', 'International', '2024-10-17'),
  (3, 'Kenji Wei', 'kenji.wei3@outlook.com', 'Shanghai', 'China', 'International', '2025-11-08'),
  (4, 'Sofia Cruz', 'sofia.cruz4@yahoo.com', 'Seoul', 'South Korea', 'International', '2026-08-06'),
  (5, 'James Tanaka', 'james.tanaka5@outlook.com', 'Cordova', 'Philippines', 'Local', '2024-05-31'),
  (6, 'Paolo Garcia', 'paolo.garcia6@outlook.com', 'Consolacion', 'Philippines', 'Local', '2024-06-05'),
  (7, 'Kenji Mendoza', 'kenji.mendoza7@gmail.com', 'Lapu-Lapu City', 'Philippines', 'Local', '2025-08-24'),
  (8, 'Sofia Reyes', 'sofia.reyes8@yahoo.com', 'Mandaue City', 'Philippines', 'Domestic', '2025-07-06'),
  (9, 'Lucas Silva', 'lucas.silva9@yahoo.com', 'Talisay City', 'Philippines', 'Domestic', '2025-07-22'),
  (10, 'Camille Wei', 'camille.wei10@gmail.com', 'Mandaue City', 'Philippines', 'Domestic', '2024-08-30');

INSERT INTO customers (customer_id, full_name, email, city, country, customer_type, created_at) VALUES
  (11, 'Emma Silva', 'emma.silva11@gmail.com', 'Talisay City', 'Philippines', 'Domestic', '2024-02-18'),
  (12, 'Maria Reyes', 'maria.reyes12@gmail.com', 'San Francisco', 'United States', 'International', '2025-09-02'),
  (13, 'Kenji Mendoza', 'kenji.mendoza13@outlook.com', 'Talisay City', 'Philippines', 'Domestic', '2025-04-14'),
  (14, 'Noah Mendoza', 'noah.mendoza14@outlook.com', 'London', 'United Kingdom', 'International', '2025-08-16'),
  (15, 'Liam Lopez', 'liam.lopez15@outlook.com', 'Talisay City', 'Philippines', 'Domestic', '2025-12-22'),
  (16, 'Noah Silva', 'noah.silva16@gmail.com', 'Talisay City', 'Philippines', 'Domestic', '2025-10-07'),
  (17, 'Aya Park', 'aya.park17@gmail.com', 'Lapu-Lapu City', 'Philippines', 'Local', '2024-12-13'),
  (18, 'Chen Nguyen', 'chen.nguyen18@outlook.com', 'Cebu City', 'Philippines', 'Domestic', '2026-05-29'),
  (19, 'James Torres', 'james.torres19@outlook.com', 'Shanghai', 'China', 'International', '2024-08-16'),
  (20, 'Hannah Mendoza', 'hannah.mendoza20@outlook.com', 'Talisay City', 'Philippines', 'Domestic', '2024-04-11');

INSERT INTO customers (customer_id, full_name, email, city, country, customer_type, created_at) VALUES
  (21, 'Noah Lim', 'noah.lim21@gmail.com', 'Cebu City', 'Philippines', 'Domestic', '2026-07-31'),
  (22, 'Noah Mendoza', 'noah.mendoza22@outlook.com', 'Consolacion', 'Philippines', 'Local', '2026-09-18'),
  (23, 'Hannah Lim', 'hannah.lim23@yahoo.com', 'Singapore', 'Singapore', 'International', '2024-08-21'),
  (24, 'Maria Santos', 'maria.santos24@gmail.com', 'Talisay City', 'Philippines', 'Domestic', '2026-04-11'),
  (25, 'Miguel Tanaka', 'miguel.tanaka25@outlook.com', 'Consolacion', 'Philippines', 'Local', '2024-09-18'),
  (26, 'Liam Müller', 'liam.muller26@gmail.com', 'Seoul', 'South Korea', 'International', '2026-10-12'),
  (27, 'Miguel Müller', 'miguel.muller27@gmail.com', 'Singapore', 'Singapore', 'International', '2026-03-02'),
  (28, 'Hannah Cruz', 'hannah.cruz28@outlook.com', 'Tokyo', 'Japan', 'International', '2025-08-04'),
  (29, 'Maria Park', 'maria.park29@gmail.com', 'Seoul', 'South Korea', 'International', '2024-03-17'),
  (30, 'Noah Müller', 'noah.muller30@gmail.com', 'Cordova', 'Philippines', 'Local', '2024-03-20');

INSERT INTO customers (customer_id, full_name, email, city, country, customer_type, created_at) VALUES
  (31, 'Kenji Villanueva', 'kenji.villanueva31@outlook.com', 'Cordova', 'Philippines', 'Local', '2026-06-04'),
  (32, 'James Lim', 'james.lim32@gmail.com', 'Cebu City', 'Philippines', 'Domestic', '2025-06-07'),
  (33, 'Miguel Santos', 'miguel.santos33@yahoo.com', 'Consolacion', 'Philippines', 'Local', '2024-05-20'),
  (34, 'Grace Torres', 'grace.torres34@gmail.com', 'Consolacion', 'Philippines', 'Local', '2025-02-27'),
  (35, 'Isabella Torres', 'isabella.torres35@yahoo.com', 'Cordova', 'Philippines', 'Local', '2024-08-05'),
  (36, 'Isabella Tanaka', 'isabella.tanaka36@yahoo.com', 'Lapu-Lapu City', 'Philippines', 'Local', '2025-03-27'),
  (37, 'Paolo Cruz', 'paolo.cruz37@outlook.com', 'Cebu City', 'Philippines', 'Domestic', '2026-07-12'),
  (38, 'Emma Lopez', 'emma.lopez38@outlook.com', 'Munich', 'Germany', 'International', '2024-08-16'),
  (39, 'Emma Santos', 'emma.santos39@yahoo.com', 'Talisay City', 'Philippines', 'Domestic', '2025-10-02'),
  (40, 'Sofia Lim', 'sofia.lim40@gmail.com', 'Talisay City', 'Philippines', 'Domestic', '2026-05-01');

INSERT INTO customers (customer_id, full_name, email, city, country, customer_type, created_at) VALUES
  (41, 'Lucas Mendoza', 'lucas.mendoza41@yahoo.com', 'San Francisco', 'United States', 'International', '2026-07-27'),
  (42, 'Lucas Lopez', 'lucas.lopez42@yahoo.com', 'Talisay City', 'Philippines', 'Domestic', '2025-01-17'),
  (43, 'Maria Silva', 'maria.silva43@yahoo.com', 'Cordova', 'Philippines', 'Local', '2024-03-02'),
  (44, 'Miguel Mendoza', 'miguel.mendoza44@yahoo.com', 'Shanghai', 'China', 'International', '2024-02-27'),
  (45, 'Noah Reyes', 'noah.reyes45@gmail.com', 'Cebu City', 'Philippines', 'Domestic', '2024-05-05'),
  (46, 'James Park', 'james.park46@outlook.com', 'Tokyo', 'Japan', 'International', '2025-02-25'),
  (47, 'Maria Tanaka', 'maria.tanaka47@gmail.com', 'Seoul', 'South Korea', 'International', '2025-10-12'),
  (48, 'Rafael Reyes', 'rafael.reyes48@yahoo.com', 'Mandaue City', 'Philippines', 'Domestic', '2025-08-26'),
  (49, 'Elena Reyes', 'elena.reyes49@gmail.com', 'San Francisco', 'United States', 'International', '2025-07-20'),
  (50, 'Maria Kim', 'maria.kim50@outlook.com', 'Talisay City', 'Philippines', 'Domestic', '2025-08-03');

INSERT INTO customers (customer_id, full_name, email, city, country, customer_type, created_at) VALUES
  (51, 'Lucas O''Brien', 'lucas.obrien51@yahoo.com', 'Singapore', 'Singapore', 'International', '2025-10-25'),
  (52, 'Paolo Silva', 'paolo.silva52@outlook.com', 'Tokyo', 'Japan', 'International', '2026-06-12'),
  (53, 'James Reyes', 'james.reyes53@gmail.com', 'Mandaue City', 'Philippines', 'Domestic', '2025-06-19'),
  (54, 'Rafael Lim', 'rafael.lim54@yahoo.com', 'Cebu City', 'Philippines', 'Domestic', '2024-02-15'),
  (55, 'Hannah Carter', 'hannah.carter55@outlook.com', 'Talisay City', 'Philippines', 'Domestic', '2025-02-20'),
  (56, 'Rafael Santos', 'rafael.santos56@yahoo.com', 'Cebu City', 'Philippines', 'Domestic', '2026-05-10'),
  (57, 'Sofia Müller', 'sofia.muller57@yahoo.com', 'Consolacion', 'Philippines', 'Local', '2024-08-27'),
  (58, 'Chen Mendoza', 'chen.mendoza58@yahoo.com', 'London', 'United Kingdom', 'International', '2026-08-14'),
  (59, 'Camille Lim', 'camille.lim59@yahoo.com', 'Mandaue City', 'Philippines', 'Domestic', '2026-10-06'),
  (60, 'Olivia Müller', 'olivia.muller60@outlook.com', 'Lapu-Lapu City', 'Philippines', 'Local', '2024-06-19');

-- Dive packages
INSERT INTO dive_packages (package_id, package_name, category, price_php, duration_hours, difficulty, active) VALUES
  (1, 'Fun Dive – House Reef', 'Fun Dive', 3600, 5, 'Beginner', 0),
  (2, 'Fun Dive – Hilutungan', 'Fun Dive', 3700, 6, 'Beginner', 1),
  (3, 'Fun Dive – Nalusuan', 'Fun Dive', 4100, 5, 'Beginner', 1),
  (4, 'Fun Dive – Olango', 'Fun Dive', 4200, 6, 'Beginner', 1),
  (5, 'Fun Dive – Talisay Point', 'Fun Dive', 4200, 5, 'Beginner', 1),
  (6, 'Fun Dive – Marine Sanctuary', 'Fun Dive', 4700, 6, 'Beginner', 1),
  (7, 'Discover Scuba – House Reef', 'Discover Scuba', 4800, 6, 'Beginner', 1),
  (8, 'Discover Scuba – Hilutungan', 'Discover Scuba', 5100, 7, 'Beginner', 1),
  (9, 'Discover Scuba – Nalusuan', 'Discover Scuba', 5200, 6, 'Beginner', 1),
  (10, 'Discover Scuba – Olango', 'Discover Scuba', 5300, 7, 'Beginner', 1);

INSERT INTO dive_packages (package_id, package_name, category, price_php, duration_hours, difficulty, active) VALUES
  (11, 'Discover Scuba – Talisay Point', 'Discover Scuba', 5600, 6, 'Beginner', 1),
  (12, 'Discover Scuba – Marine Sanctuary', 'Discover Scuba', 6200, 7, 'Beginner', 1),
  (13, 'Open Water Course – House Reef', 'Open Water Course', 18200, 24, 'Beginner', 1),
  (14, 'Open Water Course – Hilutungan', 'Open Water Course', 18400, 25, 'Beginner', 0),
  (15, 'Open Water Course – Nalusuan', 'Open Water Course', 18900, 24, 'Beginner', 1),
  (16, 'Open Water Course – Olango', 'Open Water Course', 19100, 25, 'Beginner', 1),
  (17, 'Open Water Course – Talisay Point', 'Open Water Course', 19400, 24, 'Beginner', 1),
  (18, 'Open Water Course – Marine Sanctuary', 'Open Water Course', 19500, 25, 'Beginner', 1),
  (19, 'Advanced Course – House Reef', 'Advanced Course', 15500, 20, 'Intermediate', 1),
  (20, 'Advanced Course – Hilutungan', 'Advanced Course', 16100, 21, 'Intermediate', 1);

INSERT INTO dive_packages (package_id, package_name, category, price_php, duration_hours, difficulty, active) VALUES
  (21, 'Advanced Course – Nalusuan', 'Advanced Course', 16000, 20, 'Intermediate', 1),
  (22, 'Advanced Course – Olango', 'Advanced Course', 16700, 21, 'Intermediate', 1),
  (23, 'Advanced Course – Talisay Point', 'Advanced Course', 16500, 20, 'Intermediate', 1),
  (24, 'Advanced Course – Marine Sanctuary', 'Advanced Course', 16800, 21, 'Intermediate', 1),
  (25, 'Rescue Course – House Reef', 'Rescue Course', 21000, 30, 'Advanced', 1),
  (26, 'Rescue Course – Hilutungan', 'Rescue Course', 21700, 31, 'Advanced', 1),
  (27, 'Rescue Course – Nalusuan', 'Rescue Course', 21900, 30, 'Advanced', 0),
  (28, 'Rescue Course – Olango', 'Rescue Course', 22100, 31, 'Advanced', 1),
  (29, 'Rescue Course – Talisay Point', 'Rescue Course', 22200, 30, 'Advanced', 1),
  (30, 'Rescue Course – Marine Sanctuary', 'Rescue Course', 22600, 31, 'Advanced', 1);

INSERT INTO dive_packages (package_id, package_name, category, price_php, duration_hours, difficulty, active) VALUES
  (31, 'Specialty Course – House Reef', 'Specialty Course', 11800, 16, 'Intermediate', 1),
  (32, 'Specialty Course – Hilutungan', 'Specialty Course', 12100, 17, 'Intermediate', 1),
  (33, 'Specialty Course – Nalusuan', 'Specialty Course', 12200, 16, 'Intermediate', 1),
  (34, 'Specialty Course – Olango', 'Specialty Course', 12500, 17, 'Intermediate', 1),
  (35, 'Specialty Course – Talisay Point', 'Specialty Course', 12700, 16, 'Intermediate', 1),
  (36, 'Specialty Course – Marine Sanctuary', 'Specialty Course', 12800, 17, 'Intermediate', 1),
  (37, 'Island Safari – House Reef', 'Island Safari', 6500, 8, 'Beginner', 1),
  (38, 'Island Safari – Hilutungan', 'Island Safari', 7000, 9, 'Beginner', 1),
  (39, 'Island Safari – Nalusuan', 'Island Safari', 7200, 8, 'Beginner', 1),
  (40, 'Island Safari – Olango', 'Island Safari', 7500, 9, 'Beginner', 0);

INSERT INTO dive_packages (package_id, package_name, category, price_php, duration_hours, difficulty, active) VALUES
  (41, 'Island Safari – Talisay Point', 'Island Safari', 7800, 8, 'Beginner', 1),
  (42, 'Island Safari – Marine Sanctuary', 'Island Safari', 8200, 9, 'Beginner', 1),
  (43, 'Night Dive – House Reef', 'Night Dive', 3900, 4, 'Intermediate', 1),
  (44, 'Night Dive – Hilutungan', 'Night Dive', 4300, 5, 'Intermediate', 1),
  (45, 'Night Dive – Nalusuan', 'Night Dive', 4500, 4, 'Intermediate', 1),
  (46, 'Night Dive – Olango', 'Night Dive', 5000, 5, 'Intermediate', 1),
  (47, 'Night Dive – Talisay Point', 'Night Dive', 4900, 4, 'Intermediate', 1),
  (48, 'Night Dive – Marine Sanctuary', 'Night Dive', 5200, 5, 'Intermediate', 1),
  (49, 'Private Charter – House Reef', 'Private Charter', 24000, 10, 'Advanced', 1),
  (50, 'Private Charter – Hilutungan', 'Private Charter', 24600, 11, 'Advanced', 1);

INSERT INTO dive_packages (package_id, package_name, category, price_php, duration_hours, difficulty, active) VALUES
  (51, 'Private Charter – Nalusuan', 'Private Charter', 24500, 10, 'Advanced', 1),
  (52, 'Private Charter – Olango', 'Private Charter', 24900, 11, 'Advanced', 1),
  (53, 'Private Charter – Talisay Point', 'Private Charter', 25100, 10, 'Advanced', 0),
  (54, 'Private Charter – Marine Sanctuary', 'Private Charter', 25600, 11, 'Advanced', 1);

-- Marketing campaigns
INSERT INTO marketing_campaigns (campaign_id, campaign_name, channel, start_date, end_date, budget_php, target_country) VALUES
  (1, 'Early Bird Google Ads · Mar 2025', 'Google Ads', '2025-03-15', '2025-04-12', 135000, 'Philippines'),
  (2, 'Dry Season Facebook · Apr 2025', 'Facebook', '2025-04-01', '2025-04-29', 55000, 'South Korea'),
  (3, 'Summer Splash Instagram · Dec 2025', 'Instagram', '2025-12-01', '2025-12-29', 90000, 'China'),
  (4, 'Weekend Escape Email · May 2026', 'Email', '2026-05-15', '2026-06-19', 109000, 'Australia'),
  (5, 'Certification Push Travel Fair · Sep 2025', 'Travel Fair', '2025-09-01', '2025-10-06', 84000, 'Philippines'),
  (6, 'Island Safari Klook · Jun 2025', 'Klook', '2025-06-15', '2025-06-29', 110000, 'South Korea'),
  (7, 'Holiday Gift Dive Show · Feb 2025', 'Dive Show', '2025-02-15', '2025-03-08', 93000, 'Japan'),
  (8, 'Rainy Day Deal Referral · Sep 2025', 'Referral', '2025-09-01', '2025-09-29', 24000, 'Australia'),
  (9, 'Peak Season Google Ads · Feb 2026', 'Google Ads', '2026-02-01', '2026-02-15', 83000, 'Germany'),
  (10, 'Loyalty Facebook · Aug 2026', 'Facebook', '2026-08-01', '2026-08-22', 36000, 'United Kingdom');

INSERT INTO marketing_campaigns (campaign_id, campaign_name, channel, start_date, end_date, budget_php, target_country) VALUES
  (11, 'Early Bird Instagram · Sep 2025', 'Instagram', '2025-09-15', '2025-09-29', 108000, 'Philippines'),
  (12, 'Dry Season Email · Aug 2025', 'Email', '2025-08-01', '2025-08-29', 129000, 'Philippines'),
  (13, 'Summer Splash Travel Fair · Aug 2026', 'Travel Fair', '2026-08-15', '2026-09-12', 122000, 'South Korea'),
  (14, 'Weekend Escape Klook · Jul 2026', 'Klook', '2026-07-15', '2026-07-29', 61000, 'South Korea'),
  (15, 'Certification Push Dive Show · Jun 2026', 'Dive Show', '2026-06-15', '2026-07-06', 114000, 'Japan'),
  (16, 'Island Safari Referral · Jul 2026', 'Referral', '2026-07-01', '2026-08-05', 95000, 'Australia'),
  (17, 'Holiday Gift Google Ads · Mar 2026', 'Google Ads', '2026-03-01', '2026-03-22', 31000, 'China'),
  (18, 'Rainy Day Deal Facebook · May 2025', 'Facebook', '2025-05-01', '2025-05-22', 105000, 'Germany'),
  (19, 'Peak Season Instagram · Sep 2025', 'Instagram', '2025-09-15', '2025-10-20', 91000, 'Australia'),
  (20, 'Loyalty Email · Aug 2025', 'Email', '2025-08-01', '2025-08-22', 57000, 'Japan');

INSERT INTO marketing_campaigns (campaign_id, campaign_name, channel, start_date, end_date, budget_php, target_country) VALUES
  (21, 'Early Bird Travel Fair · Aug 2025', 'Travel Fair', '2025-08-01', '2025-09-05', 120000, 'Philippines'),
  (22, 'Dry Season Klook · Sep 2025', 'Klook', '2025-09-01', '2025-09-15', 132000, 'Japan'),
  (23, 'Summer Splash Dive Show · May 2026', 'Dive Show', '2026-05-15', '2026-06-19', 113000, 'Japan'),
  (24, 'Weekend Escape Referral · Jul 2026', 'Referral', '2026-07-15', '2026-07-29', 59000, 'Japan'),
  (25, 'Certification Push Google Ads · Dec 2025', 'Google Ads', '2025-12-01', '2025-12-22', 39000, 'Australia'),
  (26, 'Island Safari Facebook · Jan 2025', 'Facebook', '2025-01-15', '2025-01-29', 77000, 'Australia'),
  (27, 'Holiday Gift Instagram · Dec 2024', 'Instagram', '2024-12-01', '2024-12-15', 120000, 'United States'),
  (28, 'Rainy Day Deal Email · Nov 2024', 'Email', '2024-11-15', '2024-12-20', 28000, 'China'),
  (29, 'Peak Season Travel Fair · Jan 2026', 'Travel Fair', '2026-01-01', '2026-01-29', 66000, 'Australia'),
  (30, 'Loyalty Klook · Jan 2025', 'Klook', '2025-01-15', '2025-02-19', 56000, 'United States');

INSERT INTO marketing_campaigns (campaign_id, campaign_name, channel, start_date, end_date, budget_php, target_country) VALUES
  (31, 'Early Bird Dive Show · Jul 2026', 'Dive Show', '2026-07-01', '2026-08-05', 47000, 'Australia'),
  (32, 'Dry Season Referral · May 2025', 'Referral', '2025-05-01', '2025-06-05', 70000, 'China'),
  (33, 'Summer Splash Google Ads · Sep 2025', 'Google Ads', '2025-09-15', '2025-10-06', 42000, 'Australia'),
  (34, 'Weekend Escape Facebook · May 2026', 'Facebook', '2026-05-01', '2026-05-22', 58000, 'Australia'),
  (35, 'Certification Push Instagram · Jun 2025', 'Instagram', '2025-06-01', '2025-06-15', 60000, 'Philippines'),
  (36, 'Island Safari Email · Jul 2025', 'Email', '2025-07-01', '2025-08-05', 56000, 'China'),
  (37, 'Holiday Gift Travel Fair · Nov 2024', 'Travel Fair', '2024-11-15', '2024-12-13', 50000, 'United Kingdom'),
  (38, 'Rainy Day Deal Klook · May 2026', 'Klook', '2026-05-15', '2026-06-05', 131000, 'Philippines'),
  (39, 'Peak Season Dive Show · Apr 2026', 'Dive Show', '2026-04-15', '2026-05-20', 70000, 'United Kingdom'),
  (40, 'Loyalty Referral · Mar 2025', 'Referral', '2025-03-15', '2025-03-29', 63000, 'Australia');

INSERT INTO marketing_campaigns (campaign_id, campaign_name, channel, start_date, end_date, budget_php, target_country) VALUES
  (41, 'Early Bird Google Ads · Jun 2025', 'Google Ads', '2025-06-01', '2025-06-22', 138000, 'China'),
  (42, 'Dry Season Facebook · Feb 2025', 'Facebook', '2025-02-15', '2025-03-08', 21000, 'Philippines'),
  (43, 'Summer Splash Instagram · Jun 2026', 'Instagram', '2026-06-15', '2026-06-29', 122000, 'South Korea'),
  (44, 'Weekend Escape Email · Dec 2025', 'Email', '2025-12-01', '2025-12-15', 91000, 'Philippines'),
  (45, 'Certification Push Travel Fair · Jul 2026', 'Travel Fair', '2026-07-15', '2026-07-29', 25000, 'Japan'),
  (46, 'Island Safari Klook · Dec 2024', 'Klook', '2024-12-01', '2024-12-15', 80000, 'Germany'),
  (47, 'Holiday Gift Dive Show · May 2025', 'Dive Show', '2025-05-15', '2025-05-29', 83000, 'Japan'),
  (48, 'Rainy Day Deal Referral · Nov 2025', 'Referral', '2025-11-01', '2025-11-15', 23000, 'South Korea'),
  (49, 'Peak Season Google Ads · Feb 2026', 'Google Ads', '2026-02-15', '2026-03-15', 67000, 'Japan'),
  (50, 'Loyalty Facebook · May 2026', 'Facebook', '2026-05-01', '2026-05-29', 80000, 'South Korea');

INSERT INTO marketing_campaigns (campaign_id, campaign_name, channel, start_date, end_date, budget_php, target_country) VALUES
  (51, 'Early Bird Instagram · Jul 2025', 'Instagram', '2025-07-15', '2025-08-05', 64000, 'China'),
  (52, 'Dry Season Email · Jul 2025', 'Email', '2025-07-15', '2025-08-19', 94000, 'Australia'),
  (53, 'Summer Splash Travel Fair · Nov 2024', 'Travel Fair', '2024-11-01', '2024-11-22', 122000, 'United States'),
  (54, 'Weekend Escape Klook · Jan 2025', 'Klook', '2025-01-15', '2025-01-29', 99000, 'United States');

-- Sales
INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (1, 27, 37, 49, '2026-02-22', 1, 6500, 6500, 'Phone'),
  (2, 12, 51, 35, '2025-06-07', 4, 24500, 98000, 'Walk-in'),
  (3, 27, 50, 39, '2026-05-05', 3, 24600, 73800, 'Phone'),
  (4, 2, 27, 35, '2025-06-05', 2, 21900, 43800, 'Facebook'),
  (5, 4, 36, 7, '2025-02-28', 1, 12800, 12800, 'Phone'),
  (6, 15, 16, 7, '2025-03-07', 1, 19100, 19100, 'Facebook'),
  (7, 16, 16, 3, '2025-12-05', 2, 19100, 38200, 'Website'),
  (8, 56, 39, 39, '2026-04-16', 2, 7200, 14400, 'Walk-in'),
  (9, 13, 52, 9, '2026-02-14', 4, 24900, 99600, 'Website'),
  (10, 55, 33, 37, '2024-11-20', 1, 12200, 12200, 'Travel Agency');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (11, 9, 50, 11, '2025-09-28', 4, 24600, 98400, 'Website'),
  (12, 8, 39, 19, '2025-09-24', 1, 7200, 7200, 'Facebook'),
  (13, 30, 18, 26, '2025-01-21', 1, 19500, 19500, 'Walk-in'),
  (14, 60, 31, 48, '2025-11-13', 2, 11800, 23600, 'Walk-in'),
  (15, 39, 45, 27, '2024-12-10', 4, 4500, 18000, 'Website'),
  (16, 9, 27, 24, '2026-07-22', 2, 21900, 43800, 'Phone'),
  (17, 59, 8, 54, '2025-01-23', 2, 5100, 10200, 'Phone'),
  (18, 46, 28, 12, '2025-08-17', 1, 22100, 22100, 'Website'),
  (19, 28, 32, 46, '2024-12-02', 2, 12100, 24200, 'Walk-in'),
  (20, 49, 20, 40, '2025-03-22', 1, 16100, 16100, 'Phone');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (21, 42, 45, 17, '2026-03-04', 3, 4500, 13500, 'Phone'),
  (22, 14, 18, 33, '2025-09-21', 2, 19500, 39000, 'Phone'),
  (23, 21, 49, 29, '2026-01-09', 4, 24000, 96000, 'Facebook'),
  (24, 1, 5, 49, '2026-03-07', 1, 4200, 4200, 'Facebook'),
  (25, 32, 20, 25, '2025-12-04', 1, 16100, 16100, 'Website'),
  (26, 25, 6, 54, '2025-01-28', 1, 4700, 4700, 'Website'),
  (27, 4, 4, 9, '2026-02-13', 1, 4200, 4200, 'Website'),
  (28, 24, 29, 50, '2026-05-07', 2, 22200, 44400, 'Klook'),
  (29, 39, 25, 9, '2026-02-07', 2, 21000, 42000, 'Walk-in'),
  (30, 45, 1, 30, '2025-02-08', 1, 3600, 3600, 'Klook');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (31, 6, 16, 4, '2026-06-16', 2, 19100, 38200, 'Website'),
  (32, 6, 6, 16, '2026-07-10', 1, 4700, 4700, 'Travel Agency'),
  (33, 54, 18, 48, '2025-11-14', 2, 19500, 39000, 'Phone'),
  (34, 40, 51, 38, '2026-05-30', 3, 24500, 73500, 'Walk-in'),
  (35, 8, 42, 39, '2026-05-12', 4, 8200, 32800, 'Website'),
  (36, 1, 10, 40, '2025-03-17', 1, 5300, 5300, 'Travel Agency'),
  (37, 35, 18, 25, '2025-12-06', 1, 19500, 19500, 'Walk-in'),
  (38, 34, 37, 23, '2026-06-13', 3, 6500, 19500, 'Walk-in'),
  (39, 11, 33, 11, '2025-09-19', 1, 12200, 12200, 'Klook'),
  (40, 11, 41, 17, '2026-03-17', 1, 7800, 7800, 'Facebook');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (41, 27, 46, 53, '2024-11-05', 3, 5000, 15000, 'Klook'),
  (42, 52, 12, 50, '2026-05-27', 1, 6200, 6200, 'Website'),
  (43, 25, 19, 17, '2026-03-14', 2, 15500, 31000, 'Travel Agency'),
  (44, 55, 20, 30, '2025-02-08', 2, 16100, 32200, 'Travel Agency'),
  (45, 17, 4, 50, '2026-05-15', 1, 4200, 4200, 'Klook'),
  (46, 55, 18, 6, '2025-06-15', 2, 19500, 39000, 'Website'),
  (47, 3, 19, 46, '2024-12-07', 2, 15500, 31000, 'Facebook'),
  (48, 44, 44, 23, '2026-05-25', 1, 4300, 4300, 'Website'),
  (49, 12, 30, 54, '2025-01-19', 1, 22600, 22600, 'Facebook'),
  (50, 59, 54, 54, '2025-01-23', 2, 25600, 51200, 'Facebook');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (51, 58, 49, 11, '2025-09-17', 1, 24000, 24000, 'Travel Agency'),
  (52, 27, 5, 33, '2025-09-27', 2, 4200, 8400, 'Phone'),
  (53, 7, 42, 39, '2026-04-23', 4, 8200, 32800, 'Walk-in'),
  (54, 12, 44, 23, '2026-06-14', 2, 4300, 8600, 'Travel Agency'),
  (55, 5, 18, 49, '2026-02-28', 1, 19500, 19500, 'Klook'),
  (56, 20, 50, 4, '2026-06-08', 4, 24600, 98400, 'Travel Agency'),
  (57, 7, 38, 35, '2025-06-14', 3, 7000, 21000, 'Travel Agency'),
  (58, 40, 8, 36, '2025-07-02', 2, 5100, 10200, 'Travel Agency'),
  (59, 1, 38, 25, '2025-12-17', 4, 7000, 28000, 'Phone'),
  (60, 2, 53, 37, '2024-11-23', 4, 25100, 100400, 'Walk-in');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (61, 22, 17, 41, '2025-06-01', 1, 19400, 19400, 'Klook'),
  (62, 53, 44, 52, '2025-08-10', 1, 4300, 4300, 'Phone'),
  (63, 25, 27, 44, '2025-12-08', 1, 21900, 21900, 'Walk-in'),
  (64, 18, 3, 1, '2025-03-23', 2, 4100, 8200, 'Walk-in'),
  (65, 1, 44, 44, '2025-12-01', 1, 4300, 4300, 'Walk-in'),
  (66, 15, 21, 17, '2026-03-08', 1, 16000, 16000, 'Website'),
  (67, 33, 17, 27, '2024-12-14', 1, 19400, 19400, 'Website'),
  (68, 1, 14, 40, '2025-03-15', 2, 18400, 36800, 'Travel Agency'),
  (69, 60, 41, 15, '2026-06-20', 2, 7800, 15600, 'Travel Agency'),
  (70, 40, 13, 34, '2026-05-08', 2, 18200, 36400, 'Website');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (71, 22, 27, 25, '2025-12-16', 1, 21900, 21900, 'Website'),
  (72, 42, 34, 10, '2026-08-07', 1, 12500, 12500, 'Phone'),
  (73, 3, 13, 2, '2025-04-28', 1, 18200, 18200, 'Facebook'),
  (74, 41, 37, 26, '2025-01-15', 3, 6500, 19500, 'Website'),
  (75, 46, 31, 50, '2026-05-13', 1, 11800, 11800, 'Travel Agency'),
  (76, 9, 4, 4, '2026-05-15', 1, 4200, 4200, 'Facebook'),
  (77, 19, 11, 11, '2025-09-20', 2, 5600, 11200, 'Walk-in'),
  (78, 11, 39, 22, '2025-09-08', 1, 7200, 7200, 'Klook'),
  (79, 38, 42, 10, '2026-08-04', 3, 8200, 24600, 'Phone'),
  (80, 48, 39, 31, '2026-07-31', 3, 7200, 21600, 'Travel Agency');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (81, 7, 39, 3, '2025-12-25', 1, 7200, 7200, 'Travel Agency'),
  (82, 47, 41, 30, '2025-02-07', 1, 7800, 7800, 'Facebook'),
  (83, 40, 17, 21, '2025-08-26', 2, 19400, 38800, 'Travel Agency'),
  (84, 59, 16, 15, '2026-06-17', 2, 19100, 38200, 'Phone'),
  (85, 49, 42, 14, '2026-07-19', 4, 8200, 32800, 'Walk-in'),
  (86, 26, 6, 47, '2025-05-26', 2, 4700, 9400, 'Phone'),
  (87, 24, 44, 48, '2025-11-01', 2, 4300, 8600, 'Walk-in'),
  (88, 60, 18, 51, '2025-08-02', 2, 19500, 39000, 'Website'),
  (89, 46, 14, 15, '2026-06-29', 1, 18400, 18400, 'Website'),
  (90, 10, 45, 2, '2025-04-11', 2, 4500, 9000, 'Klook');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (91, 50, 39, 21, '2025-08-22', 3, 7200, 21600, 'Travel Agency'),
  (92, 28, 27, 35, '2025-06-03', 1, 21900, 21900, 'Klook'),
  (93, 56, 4, 42, '2025-02-23', 1, 4200, 4200, 'Walk-in'),
  (94, 3, 35, 3, '2025-12-11', 1, 12700, 12700, 'Travel Agency'),
  (95, 12, 4, 27, '2024-12-12', 1, 4200, 4200, 'Facebook'),
  (96, 10, 37, 45, '2026-07-19', 2, 6500, 13000, 'Klook'),
  (97, 9, 20, 47, '2025-05-15', 1, 16100, 16100, 'Website'),
  (98, 20, 39, 40, '2025-03-15', 4, 7200, 28800, 'Travel Agency'),
  (99, 44, 9, 1, '2025-04-11', 1, 5200, 5200, 'Website'),
  (100, 43, 10, 54, '2025-01-24', 1, 5300, 5300, 'Klook');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (101, 31, 38, 11, '2025-09-21', 4, 7000, 28000, 'Walk-in'),
  (102, 31, 38, 42, '2025-02-18', 1, 7000, 7000, 'Phone'),
  (103, 60, 22, 46, '2024-12-10', 2, 16700, 33400, 'Facebook'),
  (104, 33, 36, 27, '2024-12-12', 1, 12800, 12800, 'Facebook'),
  (105, 43, 42, 32, '2025-05-17', 2, 8200, 16400, 'Walk-in'),
  (106, 38, 17, 22, '2025-09-06', 2, 19400, 38800, 'Walk-in'),
  (107, 49, 39, 48, '2025-11-08', 1, 7200, 7200, 'Phone'),
  (108, 45, 32, 35, '2025-06-07', 2, 12100, 24200, 'Website'),
  (109, 31, 28, 37, '2024-12-11', 1, 22100, 22100, 'Facebook'),
  (110, 14, 41, 52, '2025-07-20', 1, 7800, 7800, 'Website');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (111, 16, 44, 5, '2025-10-01', 1, 4300, 4300, 'Phone'),
  (112, 3, 17, 27, '2024-12-02', 1, 19400, 19400, 'Phone'),
  (113, 12, 19, 32, '2025-05-23', 1, 15500, 15500, 'Facebook'),
  (114, 43, 42, 16, '2026-07-09', 1, 8200, 8200, 'Klook'),
  (115, 53, 17, 40, '2025-03-23', 1, 19400, 19400, 'Facebook'),
  (116, 30, 15, 35, '2025-06-13', 1, 18900, 18900, 'Phone'),
  (117, 39, 40, 12, '2025-08-09', 2, 7500, 15000, 'Phone'),
  (118, 33, 5, 13, '2026-08-28', 1, 4200, 4200, 'Travel Agency'),
  (119, 47, 22, 10, '2026-08-15', 1, 16700, 16700, 'Website'),
  (120, 8, 38, 26, '2025-01-21', 2, 7000, 14000, 'Travel Agency');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (121, 16, 17, 49, '2026-02-27', 2, 19400, 38800, 'Travel Agency'),
  (122, 48, 43, 25, '2025-12-05', 2, 3900, 7800, 'Facebook'),
  (123, 28, 39, 5, '2025-09-04', 2, 7200, 14400, 'Walk-in'),
  (124, 39, 14, 40, '2025-03-16', 2, 18400, 36800, 'Klook'),
  (125, 22, 25, 42, '2025-02-28', 1, 21000, 21000, 'Walk-in'),
  (126, 35, 17, 4, '2026-06-09', 2, 19400, 38800, 'Website'),
  (127, 58, 38, 19, '2025-10-10', 3, 7000, 21000, 'Facebook'),
  (128, 18, 32, 9, '2026-02-14', 2, 12100, 24200, 'Facebook'),
  (129, 45, 23, 21, '2025-08-02', 1, 16500, 16500, 'Website'),
  (130, 54, 32, 53, '2024-11-17', 2, 12100, 24200, 'Klook');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (131, 45, 16, 3, '2025-12-21', 2, 19100, 38200, 'Phone'),
  (132, 31, 18, 19, '2025-10-10', 2, 19500, 39000, 'Website'),
  (133, 3, 16, 47, '2025-05-26', 2, 19100, 38200, 'Travel Agency'),
  (134, 17, 5, 23, '2026-06-06', 1, 4200, 4200, 'Walk-in'),
  (135, 15, 17, 20, '2025-08-10', 1, 19400, 19400, 'Phone'),
  (136, 12, 50, 19, '2025-09-18', 4, 24600, 98400, 'Klook'),
  (137, 6, 39, 26, '2025-01-24', 4, 7200, 28800, 'Phone'),
  (138, 21, 17, 42, '2025-03-01', 1, 19400, 19400, 'Phone'),
  (139, 23, 44, 38, '2026-05-29', 2, 4300, 8600, 'Travel Agency'),
  (140, 50, 38, 4, '2026-05-22', 3, 7000, 21000, 'Phone');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (141, 51, 35, 49, '2026-02-27', 1, 12700, 12700, 'Website'),
  (142, 18, 18, 29, '2026-01-26', 1, 19500, 19500, 'Klook'),
  (143, 47, 16, 24, '2026-07-16', 1, 19100, 19100, 'Facebook'),
  (144, 42, 19, 17, '2026-03-08', 1, 15500, 15500, 'Klook'),
  (145, 18, 16, 51, '2025-07-28', 1, 19100, 19100, 'Facebook'),
  (146, 28, 9, 31, '2026-07-15', 1, 5200, 5200, 'Facebook'),
  (147, 22, 41, 26, '2025-01-21', 1, 7800, 7800, 'Travel Agency'),
  (148, 2, 10, 52, '2025-07-26', 1, 5300, 5300, 'Travel Agency'),
  (149, 28, 29, 9, '2026-02-07', 1, 22200, 22200, 'Klook'),
  (150, 1, 34, 3, '2025-12-09', 2, 12500, 25000, 'Website');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (151, 40, 2, 5, '2025-09-06', 1, 3700, 3700, 'Walk-in'),
  (152, 29, 20, 33, '2025-09-30', 2, 16100, 32200, 'Website'),
  (153, 16, 5, 16, '2026-08-04', 2, 4200, 8400, 'Walk-in'),
  (154, 17, 45, 4, '2026-06-11', 3, 4500, 13500, 'Facebook'),
  (155, 43, 19, 1, '2025-04-05', 1, 15500, 15500, 'Walk-in'),
  (156, 3, 29, 53, '2024-11-17', 2, 22200, 44400, 'Walk-in'),
  (157, 47, 35, 18, '2025-05-02', 2, 12700, 25400, 'Walk-in'),
  (158, 5, 50, 16, '2026-07-18', 4, 24600, 98400, 'Website'),
  (159, 23, 39, 23, '2026-06-11', 3, 7200, 21600, 'Travel Agency'),
  (160, 14, 18, 51, '2025-07-26', 2, 19500, 39000, 'Phone');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (161, 51, 37, 47, '2025-05-25', 3, 6500, 19500, 'Travel Agency'),
  (162, 14, 38, 18, '2025-05-09', 4, 7000, 28000, 'Walk-in'),
  (163, 25, 1, 35, '2025-06-07', 1, 3600, 3600, 'Travel Agency'),
  (164, 6, 6, 34, '2026-05-04', 1, 4700, 4700, 'Phone'),
  (165, 16, 43, 49, '2026-02-23', 3, 3900, 11700, 'Facebook'),
  (166, 4, 19, 35, '2025-06-06', 1, 15500, 15500, 'Walk-in'),
  (167, 15, 3, 29, '2026-01-24', 1, 4100, 4100, 'Facebook'),
  (168, 2, 4, 28, '2024-11-27', 2, 4200, 8400, 'Facebook'),
  (169, 21, 48, 41, '2025-06-12', 3, 5200, 15600, 'Facebook'),
  (170, 14, 23, 11, '2025-09-20', 1, 16500, 16500, 'Phone');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (171, 52, 40, 28, '2024-11-30', 3, 7500, 22500, 'Website'),
  (172, 26, 18, 16, '2026-07-05', 2, 19500, 39000, 'Travel Agency'),
  (173, 8, 24, 9, '2026-02-10', 2, 16800, 33600, 'Travel Agency'),
  (174, 13, 17, 52, '2025-08-09', 1, 19400, 19400, 'Walk-in'),
  (175, 32, 16, 43, '2026-06-21', 1, 19100, 19100, 'Facebook'),
  (176, 58, 45, 2, '2025-04-12', 2, 4500, 9000, 'Website'),
  (177, 57, 3, 6, '2025-06-25', 1, 4100, 4100, 'Phone'),
  (178, 59, 2, 22, '2025-09-11', 1, 3700, 3700, 'Travel Agency'),
  (179, 20, 51, 41, '2025-06-14', 3, 24500, 73500, 'Walk-in'),
  (180, 38, 47, 2, '2025-04-01', 4, 4900, 19600, 'Travel Agency');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (181, 12, 14, 17, '2026-03-15', 1, 18400, 18400, 'Website'),
  (182, 16, 14, 30, '2025-01-18', 1, 18400, 18400, 'Phone'),
  (183, 38, 13, 36, '2025-07-24', 1, 18200, 18200, 'Website'),
  (184, 20, 6, 18, '2025-05-15', 2, 4700, 9400, 'Facebook'),
  (185, 57, 3, 32, '2025-05-04', 2, 4100, 8200, 'Facebook'),
  (186, 32, 38, 48, '2025-11-13', 4, 7000, 28000, 'Phone'),
  (187, 49, 17, 31, '2026-07-24', 1, 19400, 19400, 'Walk-in'),
  (188, 59, 37, 38, '2026-05-23', 3, 6500, 19500, 'Facebook'),
  (189, 59, 41, 33, '2025-10-03', 1, 7800, 7800, 'Walk-in'),
  (190, 55, 5, 5, '2025-09-21', 2, 4200, 8400, 'Facebook');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (191, 29, 36, 42, '2025-03-07', 2, 12800, 25600, 'Facebook'),
  (192, 20, 41, 27, '2024-12-13', 3, 7800, 23400, 'Walk-in'),
  (193, 60, 22, 42, '2025-03-01', 1, 16700, 16700, 'Klook'),
  (194, 50, 37, 54, '2025-01-25', 1, 6500, 6500, 'Klook'),
  (195, 12, 38, 9, '2026-02-01', 4, 7000, 28000, 'Travel Agency'),
  (196, 7, 14, 25, '2025-12-01', 1, 18400, 18400, 'Website'),
  (197, 9, 50, 39, '2026-05-14', 2, 24600, 49200, 'Walk-in'),
  (198, 39, 29, 34, '2026-05-02', 2, 22200, 44400, 'Phone'),
  (199, 4, 42, 3, '2025-12-06', 1, 8200, 8200, 'Walk-in'),
  (200, 29, 41, 12, '2025-08-10', 1, 7800, 7800, 'Phone');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (201, 1, 52, 36, '2025-07-18', 2, 24900, 49800, 'Facebook'),
  (202, 1, 33, 35, '2025-06-03', 2, 12200, 24400, 'Facebook'),
  (203, 11, 1, 4, '2026-06-07', 2, 3600, 7200, 'Website'),
  (204, 50, 26, 17, '2026-03-15', 1, 21700, 21700, 'Walk-in'),
  (205, 15, 5, 33, '2025-10-04', 1, 4200, 4200, 'Travel Agency'),
  (206, 17, 47, 39, '2026-04-25', 3, 4900, 14700, 'Phone'),
  (207, 14, 45, 5, '2025-09-25', 2, 4500, 9000, 'Website'),
  (208, 55, 38, 52, '2025-08-03', 1, 7000, 7000, 'Website'),
  (209, 34, 5, 1, '2025-04-11', 2, 4200, 8400, 'Phone'),
  (210, 52, 6, 2, '2025-04-05', 2, 4700, 9400, 'Website');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (211, 49, 37, 51, '2025-07-20', 2, 6500, 13000, 'Website'),
  (212, 56, 6, 13, '2026-08-23', 2, 4700, 9400, 'Facebook'),
  (213, 1, 26, 44, '2025-12-10', 2, 21700, 43400, 'Phone'),
  (214, 27, 54, 5, '2025-09-10', 2, 25600, 51200, 'Walk-in'),
  (215, 34, 21, 6, '2025-06-17', 1, 16000, 16000, 'Website'),
  (216, 11, 21, 48, '2025-11-13', 1, 16000, 16000, 'Website'),
  (217, 45, 6, 49, '2026-03-13', 1, 4700, 4700, 'Website'),
  (218, 40, 37, 28, '2024-11-21', 4, 6500, 26000, 'Klook'),
  (219, 14, 1, 42, '2025-02-21', 2, 3600, 7200, 'Phone'),
  (220, 18, 48, 31, '2026-07-23', 3, 5200, 15600, 'Phone');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (221, 44, 14, 3, '2025-12-07', 2, 18400, 36800, 'Phone'),
  (222, 26, 38, 54, '2025-01-26', 3, 7000, 21000, 'Walk-in'),
  (223, 59, 3, 39, '2026-05-08', 2, 4100, 8200, 'Walk-in'),
  (224, 57, 38, 8, '2025-09-11', 1, 7000, 7000, 'Klook'),
  (225, 60, 37, 44, '2025-12-12', 3, 6500, 19500, 'Walk-in'),
  (226, 21, 25, 28, '2024-12-11', 1, 21000, 21000, 'Website'),
  (227, 21, 38, 8, '2025-09-07', 1, 7000, 7000, 'Travel Agency'),
  (228, 24, 37, 11, '2025-09-15', 2, 6500, 13000, 'Facebook'),
  (229, 23, 41, 1, '2025-04-03', 2, 7800, 15600, 'Phone'),
  (230, 34, 45, 30, '2025-01-15', 1, 4500, 4500, 'Travel Agency');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (231, 43, 16, 38, '2026-05-30', 1, 19100, 19100, 'Walk-in'),
  (232, 55, 54, 26, '2025-01-21', 2, 25600, 51200, 'Klook'),
  (233, 46, 27, 49, '2026-02-16', 2, 21900, 43800, 'Website'),
  (234, 56, 5, 3, '2025-12-28', 1, 4200, 4200, 'Facebook'),
  (235, 24, 51, 34, '2026-05-15', 3, 24500, 73500, 'Phone'),
  (236, 1, 35, 1, '2025-04-01', 1, 12700, 12700, 'Website'),
  (237, 26, 39, 19, '2025-09-28', 1, 7200, 7200, 'Walk-in'),
  (238, 58, 37, 27, '2024-12-02', 3, 6500, 19500, 'Walk-in'),
  (239, 16, 38, 47, '2025-05-27', 2, 7000, 14000, 'Website'),
  (240, 16, 24, 17, '2026-03-14', 1, 16800, 16800, 'Walk-in');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (241, 8, 21, 53, '2024-11-08', 2, 16000, 32000, 'Klook'),
  (242, 19, 21, 43, '2026-06-19', 2, 16000, 32000, 'Klook'),
  (243, 5, 10, 34, '2026-05-05', 2, 5300, 10600, 'Facebook'),
  (244, 23, 15, 53, '2024-11-21', 1, 18900, 18900, 'Facebook'),
  (245, 36, 54, 3, '2025-12-03', 3, 25600, 76800, 'Travel Agency'),
  (246, 14, 17, 50, '2026-05-09', 2, 19400, 38800, 'Klook'),
  (247, 58, 37, 33, '2025-09-19', 1, 6500, 6500, 'Travel Agency'),
  (248, 12, 41, 3, '2025-12-23', 4, 7800, 31200, 'Phone'),
  (249, 49, 37, 30, '2025-02-17', 1, 6500, 6500, 'Website'),
  (250, 23, 25, 48, '2025-11-07', 2, 21000, 42000, 'Facebook');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (251, 26, 26, 12, '2025-08-25', 1, 21700, 21700, 'Walk-in'),
  (252, 59, 37, 11, '2025-09-26', 1, 6500, 6500, 'Travel Agency'),
  (253, 17, 14, 36, '2025-08-01', 1, 18400, 18400, 'Travel Agency'),
  (254, 48, 16, 10, '2026-08-07', 1, 19100, 19100, 'Facebook'),
  (255, 50, 2, 50, '2026-05-09', 1, 3700, 3700, 'Website'),
  (256, 18, 39, 38, '2026-05-23', 1, 7200, 7200, 'Walk-in'),
  (257, 38, 50, 26, '2025-01-25', 1, 24600, 24600, 'Facebook'),
  (258, 54, 38, 30, '2025-02-08', 1, 7000, 7000, 'Facebook'),
  (259, 1, 42, 39, '2026-04-19', 2, 8200, 16400, 'Travel Agency'),
  (260, 54, 41, 43, '2026-06-28', 1, 7800, 7800, 'Travel Agency');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (261, 41, 21, 7, '2025-03-07', 2, 16000, 32000, 'Walk-in'),
  (262, 10, 42, 45, '2026-07-27', 4, 8200, 32800, 'Facebook'),
  (263, 18, 39, 1, '2025-03-16', 3, 7200, 21600, 'Facebook'),
  (264, 11, 49, 16, '2026-08-02', 4, 24000, 96000, 'Klook'),
  (265, 45, 37, 26, '2025-01-25', 3, 6500, 19500, 'Travel Agency'),
  (266, 20, 39, 41, '2025-06-15', 1, 7200, 7200, 'Travel Agency'),
  (267, 41, 28, 27, '2024-12-12', 2, 22100, 44200, 'Website'),
  (268, 54, 7, 43, '2026-06-25', 2, 4800, 9600, 'Website'),
  (269, 17, 13, 25, '2025-12-11', 2, 18200, 36400, 'Walk-in'),
  (270, 23, 34, 47, '2025-05-18', 2, 12500, 25000, 'Website');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (271, 2, 40, 4, '2026-05-29', 1, 7500, 7500, 'Travel Agency'),
  (272, 52, 37, 32, '2025-05-03', 2, 6500, 13000, 'Travel Agency'),
  (273, 45, 38, 4, '2026-05-16', 3, 7000, 21000, 'Website'),
  (274, 22, 49, 18, '2025-05-10', 2, 24000, 48000, 'Website'),
  (275, 32, 17, 32, '2025-05-29', 1, 19400, 19400, 'Website'),
  (276, 23, 28, 50, '2026-05-04', 2, 22100, 44200, 'Klook'),
  (277, 11, 35, 27, '2024-12-13', 2, 12700, 25400, 'Website'),
  (278, 57, 54, 8, '2025-09-07', 3, 25600, 76800, 'Website'),
  (279, 12, 27, 45, '2026-07-16', 2, 21900, 43800, 'Travel Agency'),
  (280, 25, 32, 51, '2025-07-24', 1, 12100, 12100, 'Klook');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (281, 6, 19, 47, '2025-05-18', 2, 15500, 31000, 'Facebook'),
  (282, 46, 34, 1, '2025-03-26', 1, 12500, 12500, 'Walk-in'),
  (283, 60, 15, 31, '2026-07-28', 2, 18900, 37800, 'Walk-in'),
  (284, 28, 8, 15, '2026-06-27', 2, 5100, 10200, 'Phone'),
  (285, 47, 15, 42, '2025-02-23', 1, 18900, 18900, 'Phone'),
  (286, 49, 15, 14, '2026-07-18', 2, 18900, 37800, 'Facebook'),
  (287, 10, 11, 18, '2025-05-17', 2, 5600, 11200, 'Travel Agency'),
  (288, 57, 3, 17, '2026-03-13', 2, 4100, 8200, 'Travel Agency'),
  (289, 50, 37, 45, '2026-07-22', 3, 6500, 19500, 'Phone'),
  (290, 13, 38, 35, '2025-06-12', 4, 7000, 28000, 'Klook');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (291, 53, 12, 7, '2025-02-15', 2, 6200, 12400, 'Website'),
  (292, 35, 6, 4, '2026-05-15', 1, 4700, 4700, 'Travel Agency'),
  (293, 6, 13, 31, '2026-07-29', 2, 18200, 36400, 'Klook'),
  (294, 11, 1, 4, '2026-05-22', 2, 3600, 7200, 'Website'),
  (295, 54, 42, 12, '2025-08-16', 3, 8200, 24600, 'Klook'),
  (296, 56, 6, 53, '2024-11-08', 2, 4700, 9400, 'Travel Agency'),
  (297, 12, 15, 11, '2025-09-21', 1, 18900, 18900, 'Walk-in'),
  (298, 24, 9, 14, '2026-07-17', 2, 5200, 10400, 'Travel Agency'),
  (299, 53, 42, 51, '2025-07-26', 4, 8200, 32800, 'Travel Agency'),
  (300, 49, 38, 3, '2025-12-05', 3, 7000, 21000, 'Website');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (301, 3, 1, 6, '2025-06-25', 2, 3600, 7200, 'Website'),
  (302, 39, 13, 15, '2026-06-26', 1, 18200, 18200, 'Website'),
  (303, 57, 37, 33, '2025-10-03', 2, 6500, 13000, 'Facebook'),
  (304, 9, 25, 3, '2025-12-02', 1, 21000, 21000, 'Facebook'),
  (305, 40, 4, 11, '2025-09-15', 2, 4200, 8400, 'Phone'),
  (306, 56, 40, 27, '2024-12-01', 4, 7500, 30000, 'Travel Agency'),
  (307, 4, 52, 3, '2025-12-21', 4, 24900, 99600, 'Website'),
  (308, 41, 4, 8, '2025-09-06', 2, 4200, 8400, 'Facebook'),
  (309, 8, 39, 45, '2026-07-28', 2, 7200, 14400, 'Klook'),
  (310, 24, 41, 28, '2024-12-12', 2, 7800, 15600, 'Walk-in');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (311, 3, 13, 1, '2025-03-23', 2, 18200, 36400, 'Klook'),
  (312, 27, 6, 30, '2025-02-14', 2, 4700, 9400, 'Walk-in'),
  (313, 31, 39, 46, '2024-12-12', 4, 7200, 28800, 'Klook'),
  (314, 18, 34, 35, '2025-06-09', 1, 12500, 12500, 'Website'),
  (315, 41, 14, 16, '2026-07-14', 1, 18400, 18400, 'Facebook'),
  (316, 48, 39, 3, '2025-12-23', 3, 7200, 21600, 'Travel Agency'),
  (317, 47, 29, 47, '2025-05-21', 1, 22200, 22200, 'Walk-in'),
  (318, 17, 4, 43, '2026-06-25', 2, 4200, 8400, 'Phone'),
  (319, 52, 15, 31, '2026-07-01', 2, 18900, 37800, 'Website'),
  (320, 54, 28, 9, '2026-02-07', 1, 22100, 22100, 'Travel Agency');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (321, 20, 13, 44, '2025-12-06', 2, 18200, 36400, 'Klook'),
  (322, 7, 38, 23, '2026-05-27', 1, 7000, 7000, 'Walk-in'),
  (323, 57, 7, 46, '2024-12-12', 2, 4800, 9600, 'Travel Agency'),
  (324, 45, 50, 40, '2025-03-23', 2, 24600, 49200, 'Phone'),
  (325, 22, 7, 24, '2026-07-26', 1, 4800, 4800, 'Walk-in'),
  (326, 10, 44, 2, '2025-04-25', 1, 4300, 4300, 'Website'),
  (327, 56, 48, 17, '2026-03-14', 1, 5200, 5200, 'Website'),
  (328, 2, 18, 41, '2025-06-01', 2, 19500, 39000, 'Walk-in'),
  (329, 53, 38, 4, '2026-05-15', 3, 7000, 21000, 'Website'),
  (330, 13, 52, 14, '2026-07-27', 1, 24900, 24900, 'Walk-in');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (331, 41, 43, 50, '2026-05-17', 1, 3900, 3900, 'Phone'),
  (332, 18, 9, 14, '2026-07-23', 1, 5200, 5200, 'Travel Agency'),
  (333, 12, 44, 22, '2025-09-07', 3, 4300, 12900, 'Phone'),
  (334, 38, 8, 53, '2024-11-02', 1, 5100, 5100, 'Facebook'),
  (335, 36, 54, 5, '2025-09-25', 2, 25600, 51200, 'Phone'),
  (336, 34, 12, 7, '2025-02-16', 2, 6200, 12400, 'Phone'),
  (337, 16, 26, 42, '2025-03-05', 2, 21700, 43400, 'Facebook'),
  (338, 42, 3, 4, '2026-06-01', 2, 4100, 8200, 'Klook'),
  (339, 21, 45, 15, '2026-06-19', 2, 4500, 9000, 'Website'),
  (340, 14, 30, 26, '2025-01-17', 1, 22600, 22600, 'Travel Agency');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (341, 16, 43, 5, '2025-09-29', 2, 3900, 7800, 'Website'),
  (342, 8, 33, 52, '2025-07-18', 1, 12200, 12200, 'Walk-in'),
  (343, 17, 4, 51, '2025-07-25', 1, 4200, 4200, 'Walk-in'),
  (344, 28, 23, 47, '2025-05-21', 2, 16500, 33000, 'Klook'),
  (345, 50, 14, 7, '2025-02-16', 1, 18400, 18400, 'Website'),
  (346, 32, 50, 43, '2026-06-20', 4, 24600, 98400, 'Website'),
  (347, 50, 42, 31, '2026-07-05', 2, 8200, 16400, 'Website'),
  (348, 19, 16, 50, '2026-05-14', 1, 19100, 19100, 'Klook'),
  (349, 13, 7, 54, '2025-01-17', 2, 4800, 9600, 'Klook'),
  (350, 45, 15, 11, '2025-09-19', 1, 18900, 18900, 'Facebook');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (351, 48, 4, 2, '2025-04-04', 1, 4200, 4200, 'Walk-in'),
  (352, 13, 41, 21, '2025-08-08', 1, 7800, 7800, 'Website'),
  (353, 33, 54, 11, '2025-09-27', 2, 25600, 51200, 'Phone'),
  (354, 31, 37, 44, '2025-12-03', 2, 6500, 13000, 'Phone'),
  (355, 11, 1, 11, '2025-09-28', 1, 3600, 3600, 'Walk-in'),
  (356, 38, 13, 23, '2026-06-02', 2, 18200, 36400, 'Facebook'),
  (357, 28, 23, 49, '2026-03-03', 2, 16500, 33000, 'Facebook'),
  (358, 14, 16, 18, '2025-05-11', 2, 19100, 38200, 'Walk-in'),
  (359, 41, 15, 32, '2025-05-22', 1, 18900, 18900, 'Klook'),
  (360, 53, 37, 26, '2025-01-26', 2, 6500, 13000, 'Phone');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (361, 17, 4, 1, '2025-03-22', 2, 4200, 8400, 'Facebook'),
  (362, 42, 36, 53, '2024-11-21', 2, 12800, 25600, 'Website'),
  (363, 9, 5, 10, '2026-08-07', 2, 4200, 8400, 'Klook'),
  (364, 25, 23, 48, '2025-11-08', 1, 16500, 16500, 'Phone'),
  (365, 8, 52, 9, '2026-02-13', 3, 24900, 74700, 'Website'),
  (366, 48, 38, 30, '2025-01-29', 2, 7000, 14000, 'Walk-in'),
  (367, 56, 38, 44, '2025-12-06', 4, 7000, 28000, 'Klook'),
  (368, 56, 39, 12, '2025-08-17', 1, 7200, 7200, 'Klook'),
  (369, 17, 50, 15, '2026-06-15', 3, 24600, 73800, 'Facebook'),
  (370, 41, 38, 48, '2025-11-05', 4, 7000, 28000, 'Facebook');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (371, 49, 24, 18, '2025-05-08', 1, 16800, 16800, 'Facebook'),
  (372, 24, 39, 29, '2026-01-11', 1, 7200, 7200, 'Facebook'),
  (373, 6, 42, 44, '2025-12-12', 1, 8200, 8200, 'Facebook'),
  (374, 44, 39, 46, '2024-12-14', 1, 7200, 7200, 'Phone'),
  (375, 41, 23, 48, '2025-11-03', 1, 16500, 16500, 'Travel Agency'),
  (376, 58, 43, 25, '2025-12-11', 1, 3900, 3900, 'Phone'),
  (377, 40, 42, 25, '2025-12-02', 3, 8200, 24600, 'Walk-in'),
  (378, 53, 42, 31, '2026-07-14', 4, 8200, 32800, 'Facebook'),
  (379, 5, 6, 27, '2024-12-06', 2, 4700, 9400, 'Klook'),
  (380, 31, 5, 28, '2024-11-24', 1, 4200, 4200, 'Walk-in');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (381, 52, 48, 25, '2025-12-11', 3, 5200, 15600, 'Facebook'),
  (382, 8, 7, 19, '2025-09-27', 2, 4800, 9600, 'Klook'),
  (383, 43, 39, 28, '2024-11-21', 3, 7200, 21600, 'Website'),
  (384, 36, 5, 27, '2024-12-08', 1, 4200, 4200, 'Facebook'),
  (385, 29, 33, 52, '2025-08-15', 2, 12200, 24400, 'Klook'),
  (386, 20, 27, 47, '2025-05-18', 1, 21900, 21900, 'Facebook'),
  (387, 11, 42, 18, '2025-05-16', 1, 8200, 8200, 'Walk-in'),
  (388, 25, 50, 2, '2025-04-22', 4, 24600, 98400, 'Klook'),
  (389, 52, 41, 3, '2025-12-14', 3, 7800, 23400, 'Travel Agency'),
  (390, 8, 3, 30, '2025-01-19', 2, 4100, 8200, 'Klook');

INSERT INTO sales (sale_id, customer_id, package_id, campaign_id, sale_date, quantity, unit_price, total_amount, booking_channel) VALUES
  (391, 51, 41, 22, '2025-09-13', 2, 7800, 15600, 'Phone'),
  (392, 17, 21, 6, '2025-06-27', 2, 16000, 32000, 'Travel Agency'),
  (393, 38, 1, 45, '2026-07-25', 2, 3600, 7200, 'Klook'),
  (394, 9, 30, 54, '2025-01-27', 1, 22600, 22600, 'Travel Agency'),
  (395, 49, 37, 49, '2026-03-14', 4, 6500, 26000, 'Website'),
  (396, 4, 40, 52, '2025-07-25', 2, 7500, 15000, 'Travel Agency'),
  (397, 53, 3, 9, '2026-02-11', 2, 4100, 8200, 'Klook'),
  (398, 40, 39, 17, '2026-03-21', 4, 7200, 28800, 'Travel Agency'),
  (399, 45, 22, 35, '2025-06-10', 1, 16700, 16700, 'Walk-in'),
  (400, 8, 42, 20, '2025-08-01', 3, 8200, 24600, 'Travel Agency');

-- Transactions
INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (1, 1, '2026-02-22', 'GCash', 6500, 'Paid'),
  (2, 2, '2025-06-09', 'Credit Card', 98000, 'Paid'),
  (3, 3, '2026-05-07', 'Cash', 73800, 'Refunded'),
  (4, 4, '2025-06-07', 'GCash', 0, 'Pending'),
  (5, 5, '2025-02-28', 'Maya', 12800, 'Paid'),
  (6, 6, '2025-03-09', 'Cash', 19100, 'Paid'),
  (7, 7, '2025-12-05', 'Maya', 38200, 'Paid'),
  (8, 8, '2026-04-17', 'GCash', 14400, 'Paid'),
  (9, 9, '2026-02-14', 'Cash', 99600, 'Refunded'),
  (10, 10, '2024-11-20', 'Cash', 12200, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (11, 11, '2025-09-29', 'Bank Transfer', 98400, 'Paid'),
  (12, 12, '2025-09-26', 'Credit Card', 7200, 'Refunded'),
  (13, 13, '2025-01-21', 'Bank Transfer', 19500, 'Paid'),
  (14, 14, '2025-11-15', 'Maya', 23600, 'Paid'),
  (15, 15, '2024-12-10', 'GCash', 0, 'Pending'),
  (16, 16, '2026-07-24', 'Cash', 43800, 'Paid'),
  (17, 17, '2025-01-24', 'Bank Transfer', 10200, 'Paid'),
  (18, 18, '2025-08-19', 'Maya', 22100, 'Paid'),
  (19, 19, '2024-12-03', 'GCash', 24200, 'Paid'),
  (20, 20, '2025-03-22', 'Maya', 16100, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (21, 21, '2026-03-04', 'Maya', 13500, 'Paid'),
  (22, 22, '2025-09-21', 'Maya', 39000, 'Paid'),
  (23, 23, '2026-01-11', 'Maya', 96000, 'Paid'),
  (24, 24, '2026-03-08', 'Bank Transfer', 4200, 'Paid'),
  (25, 25, '2025-12-05', 'Bank Transfer', 16100, 'Paid'),
  (26, 26, '2025-01-30', 'Bank Transfer', 4700, 'Paid'),
  (27, 27, '2026-02-13', 'Maya', 4200, 'Paid'),
  (28, 28, '2026-05-08', 'Maya', 44400, 'Paid'),
  (29, 29, '2026-02-07', 'GCash', 42000, 'Paid'),
  (30, 30, '2025-02-09', 'Bank Transfer', 3600, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (31, 31, '2026-06-18', 'Credit Card', 38200, 'Refunded'),
  (32, 32, '2026-07-10', 'Maya', 4700, 'Paid'),
  (33, 33, '2025-11-16', 'Bank Transfer', 0, 'Pending'),
  (34, 34, '2026-05-31', 'Bank Transfer', 0, 'Pending'),
  (35, 35, '2026-05-12', 'Credit Card', 32800, 'Paid'),
  (36, 36, '2025-03-17', 'Credit Card', 5300, 'Paid'),
  (37, 37, '2025-12-06', 'GCash', 19500, 'Paid'),
  (38, 38, '2026-06-14', 'Cash', 19500, 'Paid'),
  (39, 39, '2025-09-21', 'GCash', 12200, 'Paid'),
  (40, 40, '2026-03-19', 'Credit Card', 7800, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (41, 41, '2024-11-06', 'GCash', 15000, 'Paid'),
  (42, 42, '2026-05-27', 'Credit Card', 0, 'Pending'),
  (43, 43, '2026-03-14', 'Credit Card', 31000, 'Refunded'),
  (44, 44, '2025-02-08', 'Bank Transfer', 32200, 'Paid'),
  (45, 45, '2026-05-17', 'GCash', 4200, 'Paid'),
  (46, 46, '2025-06-15', 'Cash', 39000, 'Paid'),
  (47, 47, '2024-12-09', 'Bank Transfer', 31000, 'Paid'),
  (48, 48, '2026-05-25', 'Cash', 4300, 'Paid'),
  (49, 49, '2025-01-21', 'Credit Card', 22600, 'Paid'),
  (50, 50, '2025-01-25', 'Cash', 51200, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (51, 51, '2025-09-18', 'Cash', 0, 'Pending'),
  (52, 52, '2025-09-29', 'GCash', 8400, 'Paid'),
  (53, 53, '2026-04-23', 'Credit Card', 32800, 'Paid'),
  (54, 54, '2026-06-15', 'Maya', 8600, 'Refunded'),
  (55, 55, '2026-03-02', 'Credit Card', 19500, 'Paid'),
  (56, 56, '2026-06-08', 'GCash', 98400, 'Paid'),
  (57, 57, '2025-06-15', 'Maya', 21000, 'Paid'),
  (58, 58, '2025-07-03', 'Bank Transfer', 10200, 'Paid'),
  (59, 59, '2025-12-18', 'Cash', 28000, 'Paid'),
  (60, 60, '2024-11-24', 'GCash', 0, 'Pending');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (61, 61, '2025-06-03', 'GCash', 0, 'Pending'),
  (62, 62, '2025-08-12', 'Cash', 4300, 'Paid'),
  (63, 63, '2025-12-08', 'Bank Transfer', 21900, 'Paid'),
  (64, 64, '2025-03-23', 'Maya', 8200, 'Paid'),
  (65, 65, '2025-12-01', 'Cash', 4300, 'Paid'),
  (66, 66, '2026-03-08', 'Credit Card', 16000, 'Paid'),
  (67, 67, '2024-12-16', 'GCash', 0, 'Pending'),
  (68, 68, '2025-03-16', 'Maya', 36800, 'Paid'),
  (69, 69, '2026-06-22', 'Bank Transfer', 0, 'Pending'),
  (70, 70, '2026-05-09', 'Bank Transfer', 36400, 'Refunded');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (71, 71, '2025-12-18', 'Credit Card', 21900, 'Paid'),
  (72, 72, '2026-08-09', 'Maya', 12500, 'Paid'),
  (73, 73, '2025-04-29', 'Bank Transfer', 18200, 'Paid'),
  (74, 74, '2025-01-16', 'Maya', 19500, 'Paid'),
  (75, 75, '2026-05-13', 'Maya', 11800, 'Paid'),
  (76, 76, '2026-05-17', 'Credit Card', 4200, 'Paid'),
  (77, 77, '2025-09-20', 'GCash', 0, 'Pending'),
  (78, 78, '2025-09-09', 'Bank Transfer', 7200, 'Paid'),
  (79, 79, '2026-08-06', 'Cash', 24600, 'Paid'),
  (80, 80, '2026-07-31', 'GCash', 21600, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (81, 81, '2025-12-26', 'Cash', 7200, 'Paid'),
  (82, 82, '2025-02-09', 'Cash', 7800, 'Paid'),
  (83, 83, '2025-08-26', 'Maya', 0, 'Pending'),
  (84, 84, '2026-06-18', 'Cash', 38200, 'Paid'),
  (85, 85, '2026-07-20', 'Maya', 32800, 'Paid'),
  (86, 86, '2025-05-28', 'GCash', 9400, 'Paid'),
  (87, 87, '2025-11-03', 'Bank Transfer', 8600, 'Paid'),
  (88, 88, '2025-08-03', 'Maya', 39000, 'Paid'),
  (89, 89, '2026-06-30', 'Cash', 18400, 'Paid'),
  (90, 90, '2025-04-13', 'GCash', 9000, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (91, 91, '2025-08-23', 'Cash', 21600, 'Paid'),
  (92, 92, '2025-06-04', 'Bank Transfer', 21900, 'Paid'),
  (93, 93, '2025-02-24', 'Credit Card', 4200, 'Paid'),
  (94, 94, '2025-12-13', 'Bank Transfer', 12700, 'Paid'),
  (95, 95, '2024-12-13', 'Cash', 4200, 'Paid'),
  (96, 96, '2026-07-19', 'Cash', 13000, 'Paid'),
  (97, 97, '2025-05-15', 'Bank Transfer', 16100, 'Paid'),
  (98, 98, '2025-03-15', 'GCash', 28800, 'Refunded'),
  (99, 99, '2025-04-12', 'Credit Card', 0, 'Pending'),
  (100, 100, '2025-01-24', 'GCash', 5300, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (101, 101, '2025-09-21', 'Credit Card', 28000, 'Paid'),
  (102, 102, '2025-02-18', 'Cash', 0, 'Pending'),
  (103, 103, '2024-12-10', 'Maya', 33400, 'Paid'),
  (104, 104, '2024-12-14', 'Cash', 12800, 'Paid'),
  (105, 105, '2025-05-18', 'Bank Transfer', 0, 'Pending'),
  (106, 106, '2025-09-06', 'Cash', 38800, 'Paid'),
  (107, 107, '2025-11-09', 'Credit Card', 7200, 'Refunded'),
  (108, 108, '2025-06-08', 'Credit Card', 24200, 'Paid'),
  (109, 109, '2024-12-12', 'Cash', 22100, 'Paid'),
  (110, 110, '2025-07-20', 'Credit Card', 7800, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (111, 111, '2025-10-03', 'Bank Transfer', 4300, 'Paid'),
  (112, 112, '2024-12-02', 'Maya', 19400, 'Paid'),
  (113, 113, '2025-05-23', 'Cash', 15500, 'Paid'),
  (114, 114, '2026-07-11', 'GCash', 8200, 'Paid'),
  (115, 115, '2025-03-24', 'Maya', 19400, 'Paid'),
  (116, 116, '2025-06-14', 'GCash', 18900, 'Paid'),
  (117, 117, '2025-08-09', 'Maya', 15000, 'Paid'),
  (118, 118, '2026-08-30', 'Maya', 4200, 'Paid'),
  (119, 119, '2026-08-17', 'GCash', 16700, 'Paid'),
  (120, 120, '2025-01-21', 'Credit Card', 0, 'Pending');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (121, 121, '2026-02-27', 'GCash', 38800, 'Paid'),
  (122, 122, '2025-12-06', 'Bank Transfer', 7800, 'Paid'),
  (123, 123, '2025-09-05', 'GCash', 0, 'Pending'),
  (124, 124, '2025-03-17', 'Credit Card', 36800, 'Paid'),
  (125, 125, '2025-03-02', 'Bank Transfer', 21000, 'Paid'),
  (126, 126, '2026-06-10', 'Bank Transfer', 0, 'Pending'),
  (127, 127, '2025-10-10', 'Bank Transfer', 0, 'Pending'),
  (128, 128, '2026-02-16', 'Credit Card', 24200, 'Paid'),
  (129, 129, '2025-08-04', 'Credit Card', 0, 'Pending'),
  (130, 130, '2024-11-19', 'Bank Transfer', 24200, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (131, 131, '2025-12-21', 'Cash', 38200, 'Paid'),
  (132, 132, '2025-10-11', 'Maya', 39000, 'Paid'),
  (133, 133, '2025-05-28', 'Cash', 38200, 'Paid'),
  (134, 134, '2026-06-06', 'Cash', 4200, 'Paid'),
  (135, 135, '2025-08-12', 'Maya', 19400, 'Paid'),
  (136, 136, '2025-09-19', 'Credit Card', 98400, 'Paid'),
  (137, 137, '2025-01-26', 'GCash', 28800, 'Paid'),
  (138, 138, '2025-03-03', 'Maya', 19400, 'Paid'),
  (139, 139, '2026-05-30', 'Cash', 8600, 'Paid'),
  (140, 140, '2026-05-23', 'Maya', 21000, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (141, 141, '2026-02-28', 'Maya', 12700, 'Paid'),
  (142, 142, '2026-01-28', 'GCash', 19500, 'Paid'),
  (143, 143, '2026-07-17', 'Credit Card', 19100, 'Paid'),
  (144, 144, '2026-03-08', 'Cash', 15500, 'Paid'),
  (145, 145, '2025-07-29', 'GCash', 19100, 'Paid'),
  (146, 146, '2026-07-17', 'Bank Transfer', 5200, 'Paid'),
  (147, 147, '2025-01-23', 'Bank Transfer', 7800, 'Paid'),
  (148, 148, '2025-07-28', 'Credit Card', 5300, 'Paid'),
  (149, 149, '2026-02-07', 'GCash', 22200, 'Paid'),
  (150, 150, '2025-12-09', 'Bank Transfer', 25000, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (151, 151, '2025-09-06', 'Bank Transfer', 3700, 'Paid'),
  (152, 152, '2025-10-01', 'Bank Transfer', 32200, 'Paid'),
  (153, 153, '2026-08-06', 'Credit Card', 8400, 'Paid'),
  (154, 154, '2026-06-13', 'Bank Transfer', 13500, 'Paid'),
  (155, 155, '2025-04-07', 'Maya', 15500, 'Paid'),
  (156, 156, '2024-11-19', 'Bank Transfer', 44400, 'Paid'),
  (157, 157, '2025-05-04', 'Bank Transfer', 25400, 'Paid'),
  (158, 158, '2026-07-19', 'Bank Transfer', 98400, 'Paid'),
  (159, 159, '2026-06-13', 'Cash', 21600, 'Paid'),
  (160, 160, '2025-07-26', 'Cash', 39000, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (161, 161, '2025-05-27', 'Credit Card', 19500, 'Paid'),
  (162, 162, '2025-05-10', 'GCash', 28000, 'Paid'),
  (163, 163, '2025-06-08', 'Cash', 3600, 'Paid'),
  (164, 164, '2026-05-04', 'Cash', 4700, 'Paid'),
  (165, 165, '2026-02-23', 'Bank Transfer', 11700, 'Paid'),
  (166, 166, '2025-06-08', 'Cash', 15500, 'Paid'),
  (167, 167, '2026-01-26', 'GCash', 4100, 'Paid'),
  (168, 168, '2024-11-27', 'GCash', 8400, 'Paid'),
  (169, 169, '2025-06-14', 'GCash', 15600, 'Paid'),
  (170, 170, '2025-09-20', 'Bank Transfer', 16500, 'Refunded');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (171, 171, '2024-12-02', 'Maya', 0, 'Pending'),
  (172, 172, '2026-07-06', 'Cash', 39000, 'Paid'),
  (173, 173, '2026-02-11', 'Maya', 33600, 'Paid'),
  (174, 174, '2025-08-11', 'Bank Transfer', 19400, 'Paid'),
  (175, 175, '2026-06-21', 'Maya', 19100, 'Paid'),
  (176, 176, '2025-04-13', 'Credit Card', 9000, 'Paid'),
  (177, 177, '2025-06-25', 'Maya', 4100, 'Paid'),
  (178, 178, '2025-09-13', 'Maya', 3700, 'Paid'),
  (179, 179, '2025-06-15', 'Credit Card', 73500, 'Refunded'),
  (180, 180, '2025-04-03', 'Bank Transfer', 19600, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (181, 181, '2026-03-15', 'GCash', 0, 'Pending'),
  (182, 182, '2025-01-19', 'Credit Card', 18400, 'Paid'),
  (183, 183, '2025-07-26', 'GCash', 18200, 'Paid'),
  (184, 184, '2025-05-16', 'Credit Card', 9400, 'Paid'),
  (185, 185, '2025-05-05', 'Maya', 8200, 'Paid'),
  (186, 186, '2025-11-13', 'GCash', 28000, 'Paid'),
  (187, 187, '2026-07-25', 'Maya', 19400, 'Refunded'),
  (188, 188, '2026-05-23', 'Maya', 19500, 'Paid'),
  (189, 189, '2025-10-03', 'Bank Transfer', 7800, 'Paid'),
  (190, 190, '2025-09-22', 'Bank Transfer', 8400, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (191, 191, '2025-03-08', 'GCash', 25600, 'Paid'),
  (192, 192, '2024-12-15', 'Bank Transfer', 0, 'Pending'),
  (193, 193, '2025-03-03', 'Bank Transfer', 16700, 'Paid'),
  (194, 194, '2025-01-25', 'GCash', 6500, 'Paid'),
  (195, 195, '2026-02-03', 'Maya', 28000, 'Paid'),
  (196, 196, '2025-12-02', 'Maya', 18400, 'Paid'),
  (197, 197, '2026-05-16', 'GCash', 0, 'Pending'),
  (198, 198, '2026-05-04', 'Bank Transfer', 44400, 'Paid'),
  (199, 199, '2025-12-06', 'Cash', 0, 'Pending'),
  (200, 200, '2025-08-10', 'Cash', 7800, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (201, 201, '2025-07-20', 'Maya', 49800, 'Paid'),
  (202, 202, '2025-06-05', 'GCash', 24400, 'Paid'),
  (203, 203, '2026-06-08', 'Credit Card', 7200, 'Paid'),
  (204, 204, '2026-03-15', 'Maya', 21700, 'Paid'),
  (205, 205, '2025-10-04', 'Bank Transfer', 4200, 'Paid'),
  (206, 206, '2026-04-27', 'Credit Card', 14700, 'Paid'),
  (207, 207, '2025-09-25', 'GCash', 9000, 'Paid'),
  (208, 208, '2025-08-05', 'Maya', 7000, 'Paid'),
  (209, 209, '2025-04-12', 'GCash', 8400, 'Paid'),
  (210, 210, '2025-04-06', 'Credit Card', 9400, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (211, 211, '2025-07-22', 'GCash', 13000, 'Paid'),
  (212, 212, '2026-08-25', 'GCash', 0, 'Pending'),
  (213, 213, '2025-12-12', 'Maya', 0, 'Pending'),
  (214, 214, '2025-09-11', 'Bank Transfer', 51200, 'Paid'),
  (215, 215, '2025-06-18', 'Cash', 16000, 'Paid'),
  (216, 216, '2025-11-14', 'GCash', 16000, 'Paid'),
  (217, 217, '2026-03-13', 'Bank Transfer', 4700, 'Paid'),
  (218, 218, '2024-11-21', 'Maya', 26000, 'Paid'),
  (219, 219, '2025-02-22', 'Cash', 0, 'Pending'),
  (220, 220, '2026-07-23', 'Cash', 15600, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (221, 221, '2025-12-09', 'GCash', 36800, 'Paid'),
  (222, 222, '2025-01-28', 'Cash', 21000, 'Paid'),
  (223, 223, '2026-05-10', 'GCash', 8200, 'Paid'),
  (224, 224, '2025-09-13', 'GCash', 7000, 'Paid'),
  (225, 225, '2025-12-14', 'Credit Card', 19500, 'Paid'),
  (226, 226, '2024-12-13', 'Bank Transfer', 21000, 'Paid'),
  (227, 227, '2025-09-09', 'Maya', 7000, 'Paid'),
  (228, 228, '2025-09-15', 'Bank Transfer', 0, 'Pending'),
  (229, 229, '2025-04-03', 'Maya', 15600, 'Paid'),
  (230, 230, '2025-01-16', 'Cash', 4500, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (231, 231, '2026-06-01', 'GCash', 19100, 'Paid'),
  (232, 232, '2025-01-22', 'GCash', 51200, 'Paid'),
  (233, 233, '2026-02-18', 'Maya', 0, 'Pending'),
  (234, 234, '2025-12-28', 'Cash', 4200, 'Refunded'),
  (235, 235, '2026-05-17', 'Credit Card', 73500, 'Paid'),
  (236, 236, '2025-04-01', 'Maya', 12700, 'Paid'),
  (237, 237, '2025-09-29', 'Bank Transfer', 7200, 'Refunded'),
  (238, 238, '2024-12-04', 'Cash', 19500, 'Paid'),
  (239, 239, '2025-05-27', 'Cash', 14000, 'Paid'),
  (240, 240, '2026-03-16', 'Cash', 16800, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (241, 241, '2024-11-10', 'Bank Transfer', 32000, 'Paid'),
  (242, 242, '2026-06-21', 'Cash', 32000, 'Paid'),
  (243, 243, '2026-05-07', 'Credit Card', 10600, 'Paid'),
  (244, 244, '2024-11-21', 'Bank Transfer', 18900, 'Paid'),
  (245, 245, '2025-12-04', 'Bank Transfer', 76800, 'Paid'),
  (246, 246, '2026-05-11', 'Cash', 38800, 'Paid'),
  (247, 247, '2025-09-20', 'Maya', 6500, 'Paid'),
  (248, 248, '2025-12-23', 'Cash', 31200, 'Paid'),
  (249, 249, '2025-02-18', 'Cash', 6500, 'Paid'),
  (250, 250, '2025-11-08', 'Cash', 42000, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (251, 251, '2025-08-26', 'Maya', 21700, 'Paid'),
  (252, 252, '2025-09-28', 'GCash', 6500, 'Paid'),
  (253, 253, '2025-08-02', 'Bank Transfer', 0, 'Pending'),
  (254, 254, '2026-08-07', 'Credit Card', 19100, 'Paid'),
  (255, 255, '2026-05-11', 'Bank Transfer', 3700, 'Paid'),
  (256, 256, '2026-05-25', 'GCash', 7200, 'Paid'),
  (257, 257, '2025-01-25', 'Cash', 0, 'Pending'),
  (258, 258, '2025-02-10', 'Maya', 0, 'Pending'),
  (259, 259, '2026-04-21', 'Cash', 0, 'Pending'),
  (260, 260, '2026-06-28', 'Cash', 7800, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (261, 261, '2025-03-09', 'Credit Card', 32000, 'Paid'),
  (262, 262, '2026-07-28', 'GCash', 32800, 'Paid'),
  (263, 263, '2025-03-16', 'GCash', 21600, 'Paid'),
  (264, 264, '2026-08-04', 'Credit Card', 96000, 'Paid'),
  (265, 265, '2025-01-26', 'Bank Transfer', 19500, 'Paid'),
  (266, 266, '2025-06-16', 'Credit Card', 7200, 'Paid'),
  (267, 267, '2024-12-13', 'Cash', 44200, 'Paid'),
  (268, 268, '2026-06-27', 'Bank Transfer', 9600, 'Paid'),
  (269, 269, '2025-12-12', 'Credit Card', 36400, 'Paid'),
  (270, 270, '2025-05-19', 'Credit Card', 0, 'Pending');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (271, 271, '2026-05-31', 'Maya', 7500, 'Paid'),
  (272, 272, '2025-05-05', 'Credit Card', 13000, 'Paid'),
  (273, 273, '2026-05-17', 'Bank Transfer', 21000, 'Paid'),
  (274, 274, '2025-05-11', 'Cash', 0, 'Pending'),
  (275, 275, '2025-05-30', 'Maya', 19400, 'Paid'),
  (276, 276, '2026-05-06', 'Maya', 44200, 'Refunded'),
  (277, 277, '2024-12-13', 'Maya', 25400, 'Paid'),
  (278, 278, '2025-09-08', 'Bank Transfer', 76800, 'Paid'),
  (279, 279, '2026-07-18', 'Credit Card', 43800, 'Paid'),
  (280, 280, '2025-07-25', 'GCash', 12100, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (281, 281, '2025-05-20', 'Credit Card', 31000, 'Paid'),
  (282, 282, '2025-03-28', 'Cash', 12500, 'Paid'),
  (283, 283, '2026-07-29', 'Cash', 37800, 'Paid'),
  (284, 284, '2026-06-28', 'Cash', 10200, 'Paid'),
  (285, 285, '2025-02-25', 'Maya', 18900, 'Paid'),
  (286, 286, '2026-07-20', 'Cash', 0, 'Pending'),
  (287, 287, '2025-05-18', 'Bank Transfer', 11200, 'Paid'),
  (288, 288, '2026-03-14', 'Credit Card', 0, 'Pending'),
  (289, 289, '2026-07-23', 'Maya', 19500, 'Paid'),
  (290, 290, '2025-06-13', 'Cash', 28000, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (291, 291, '2025-02-15', 'Bank Transfer', 12400, 'Paid'),
  (292, 292, '2026-05-16', 'Maya', 0, 'Pending'),
  (293, 293, '2026-07-31', 'Maya', 36400, 'Refunded'),
  (294, 294, '2026-05-24', 'GCash', 7200, 'Paid'),
  (295, 295, '2025-08-17', 'Credit Card', 24600, 'Paid'),
  (296, 296, '2024-11-09', 'Maya', 9400, 'Paid'),
  (297, 297, '2025-09-21', 'Cash', 18900, 'Refunded'),
  (298, 298, '2026-07-18', 'Cash', 10400, 'Paid'),
  (299, 299, '2025-07-27', 'Bank Transfer', 32800, 'Paid'),
  (300, 300, '2025-12-06', 'Cash', 21000, 'Refunded');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (301, 301, '2025-06-27', 'Credit Card', 7200, 'Paid'),
  (302, 302, '2026-06-28', 'Credit Card', 0, 'Pending'),
  (303, 303, '2025-10-04', 'Cash', 13000, 'Paid'),
  (304, 304, '2025-12-03', 'GCash', 21000, 'Paid'),
  (305, 305, '2025-09-17', 'Bank Transfer', 8400, 'Paid'),
  (306, 306, '2024-12-01', 'GCash', 30000, 'Paid'),
  (307, 307, '2025-12-21', 'Maya', 99600, 'Paid'),
  (308, 308, '2025-09-07', 'Maya', 8400, 'Paid'),
  (309, 309, '2026-07-30', 'GCash', 14400, 'Paid'),
  (310, 310, '2024-12-13', 'Cash', 15600, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (311, 311, '2025-03-25', 'Maya', 36400, 'Paid'),
  (312, 312, '2025-02-14', 'Maya', 9400, 'Paid'),
  (313, 313, '2024-12-13', 'Maya', 28800, 'Paid'),
  (314, 314, '2025-06-10', 'GCash', 12500, 'Paid'),
  (315, 315, '2026-07-15', 'Credit Card', 18400, 'Paid'),
  (316, 316, '2025-12-23', 'Cash', 21600, 'Paid'),
  (317, 317, '2025-05-23', 'Credit Card', 22200, 'Paid'),
  (318, 318, '2026-06-27', 'Maya', 8400, 'Paid'),
  (319, 319, '2026-07-01', 'Bank Transfer', 37800, 'Paid'),
  (320, 320, '2026-02-08', 'GCash', 22100, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (321, 321, '2025-12-07', 'Credit Card', 36400, 'Paid'),
  (322, 322, '2026-05-29', 'Credit Card', 7000, 'Paid'),
  (323, 323, '2024-12-13', 'Bank Transfer', 9600, 'Paid'),
  (324, 324, '2025-03-23', 'Maya', 49200, 'Paid'),
  (325, 325, '2026-07-27', 'GCash', 4800, 'Paid'),
  (326, 326, '2025-04-27', 'Bank Transfer', 4300, 'Paid'),
  (327, 327, '2026-03-15', 'Bank Transfer', 5200, 'Paid'),
  (328, 328, '2025-06-01', 'Maya', 39000, 'Paid'),
  (329, 329, '2026-05-15', 'Cash', 21000, 'Paid'),
  (330, 330, '2026-07-28', 'Cash', 24900, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (331, 331, '2026-05-17', 'Credit Card', 3900, 'Paid'),
  (332, 332, '2026-07-25', 'Maya', 5200, 'Paid'),
  (333, 333, '2025-09-08', 'Credit Card', 12900, 'Refunded'),
  (334, 334, '2024-11-04', 'Cash', 5100, 'Paid'),
  (335, 335, '2025-09-25', 'Cash', 51200, 'Paid'),
  (336, 336, '2025-02-18', 'Cash', 12400, 'Paid'),
  (337, 337, '2025-03-07', 'GCash', 43400, 'Paid'),
  (338, 338, '2026-06-01', 'Bank Transfer', 8200, 'Paid'),
  (339, 339, '2026-06-19', 'Credit Card', 9000, 'Paid'),
  (340, 340, '2025-01-18', 'GCash', 22600, 'Refunded');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (341, 341, '2025-09-30', 'GCash', 7800, 'Paid'),
  (342, 342, '2025-07-20', 'Maya', 12200, 'Paid'),
  (343, 343, '2025-07-26', 'Bank Transfer', 4200, 'Refunded'),
  (344, 344, '2025-05-23', 'GCash', 33000, 'Refunded'),
  (345, 345, '2025-02-16', 'Bank Transfer', 18400, 'Refunded'),
  (346, 346, '2026-06-21', 'GCash', 98400, 'Paid'),
  (347, 347, '2026-07-07', 'Maya', 16400, 'Paid'),
  (348, 348, '2026-05-14', 'GCash', 19100, 'Paid'),
  (349, 349, '2025-01-17', 'Maya', 9600, 'Paid'),
  (350, 350, '2025-09-20', 'GCash', 18900, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (351, 351, '2025-04-06', 'GCash', 4200, 'Paid'),
  (352, 352, '2025-08-08', 'Maya', 7800, 'Paid'),
  (353, 353, '2025-09-27', 'Credit Card', 51200, 'Paid'),
  (354, 354, '2025-12-05', 'Cash', 13000, 'Paid'),
  (355, 355, '2025-09-28', 'Cash', 3600, 'Paid'),
  (356, 356, '2026-06-04', 'GCash', 36400, 'Paid'),
  (357, 357, '2026-03-05', 'Bank Transfer', 33000, 'Paid'),
  (358, 358, '2025-05-13', 'Credit Card', 38200, 'Paid'),
  (359, 359, '2025-05-23', 'Credit Card', 18900, 'Paid'),
  (360, 360, '2025-01-26', 'GCash', 13000, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (361, 361, '2025-03-22', 'Cash', 8400, 'Paid'),
  (362, 362, '2024-11-22', 'Bank Transfer', 25600, 'Paid'),
  (363, 363, '2026-08-07', 'Credit Card', 8400, 'Paid'),
  (364, 364, '2025-11-09', 'Credit Card', 16500, 'Paid'),
  (365, 365, '2026-02-13', 'Cash', 74700, 'Paid'),
  (366, 366, '2025-01-31', 'Cash', 14000, 'Paid'),
  (367, 367, '2025-12-07', 'Bank Transfer', 0, 'Pending'),
  (368, 368, '2025-08-19', 'GCash', 7200, 'Paid'),
  (369, 369, '2026-06-16', 'Credit Card', 73800, 'Paid'),
  (370, 370, '2025-11-07', 'Cash', 28000, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (371, 371, '2025-05-08', 'GCash', 16800, 'Paid'),
  (372, 372, '2026-01-11', 'Cash', 7200, 'Paid'),
  (373, 373, '2025-12-12', 'Maya', 8200, 'Paid'),
  (374, 374, '2024-12-14', 'Maya', 7200, 'Paid'),
  (375, 375, '2025-11-03', 'GCash', 16500, 'Refunded'),
  (376, 376, '2025-12-12', 'Bank Transfer', 3900, 'Paid'),
  (377, 377, '2025-12-02', 'Cash', 24600, 'Paid'),
  (378, 378, '2026-07-16', 'Credit Card', 32800, 'Paid'),
  (379, 379, '2024-12-08', 'Cash', 9400, 'Paid'),
  (380, 380, '2024-11-26', 'Credit Card', 4200, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (381, 381, '2025-12-12', 'Credit Card', 15600, 'Paid'),
  (382, 382, '2025-09-28', 'Bank Transfer', 9600, 'Paid'),
  (383, 383, '2024-11-23', 'Cash', 21600, 'Paid'),
  (384, 384, '2024-12-08', 'Credit Card', 4200, 'Paid'),
  (385, 385, '2025-08-17', 'Credit Card', 24400, 'Paid'),
  (386, 386, '2025-05-19', 'Bank Transfer', 21900, 'Paid'),
  (387, 387, '2025-05-18', 'Maya', 8200, 'Paid'),
  (388, 388, '2025-04-22', 'Bank Transfer', 98400, 'Paid'),
  (389, 389, '2025-12-16', 'Maya', 23400, 'Paid'),
  (390, 390, '2025-01-19', 'GCash', 8200, 'Paid');

INSERT INTO transactions (transaction_id, sale_id, payment_date, payment_method, amount_paid, status) VALUES
  (391, 391, '2025-09-15', 'Cash', 0, 'Pending'),
  (392, 392, '2025-06-28', 'Maya', 32000, 'Paid'),
  (393, 393, '2026-07-25', 'Credit Card', 7200, 'Paid'),
  (394, 394, '2025-01-28', 'Bank Transfer', 22600, 'Paid'),
  (395, 395, '2026-03-16', 'Credit Card', 0, 'Pending'),
  (396, 396, '2025-07-26', 'GCash', 0, 'Pending'),
  (397, 397, '2026-02-13', 'Maya', 0, 'Pending'),
  (398, 398, '2026-03-23', 'GCash', 28800, 'Paid'),
  (399, 399, '2025-06-12', 'Cash', 16700, 'Paid'),
  (400, 400, '2025-08-03', 'Bank Transfer', 24600, 'Paid');

COMMIT;
