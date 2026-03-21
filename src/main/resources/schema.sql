-- IPL Auction System - Full SQL Schema

CREATE DATABASE IF NOT EXISTS ipl_auction;
USE ipl_auction;

-- Admin Users
CREATE TABLE IF NOT EXISTS admin_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_ADMIN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admin_username (username)
) ENGINE=InnoDB;

-- Teams
CREATE TABLE IF NOT EXISTS team (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(150) NOT NULL UNIQUE,
    team_logo VARCHAR(500),
    owner_name VARCHAR(150) NOT NULL,
    owner_image VARCHAR(500),
    total_purse DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    remaining_purse DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_team_name (team_name)
) ENGINE=InnoDB;

-- Players
CREATE TABLE IF NOT EXISTS player (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    player_name VARCHAR(150) NOT NULL,
    age INT NOT NULL,
    role VARCHAR(100) NOT NULL,
    native_place VARCHAR(150),
    current_address VARCHAR(500),
    team_represented VARCHAR(150),
    dob DATE,
    phone_number VARCHAR(20),
    base_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    player_image VARCHAR(500),
    status ENUM('AVAILABLE','SOLD','UNSOLD') NOT NULL DEFAULT 'AVAILABLE',
    sold_price DECIMAL(15,2),
    sold_to_team_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sold_to_team_id) REFERENCES team(id) ON DELETE SET NULL,
    INDEX idx_player_status (status),
    INDEX idx_player_name (player_name),
    INDEX idx_sold_to_team (sold_to_team_id)
) ENGINE=InnoDB;

-- Auctions
CREATE TABLE IF NOT EXISTS auction (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    player_id BIGINT NOT NULL,
    current_bid DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    highest_bid_team_id BIGINT,
    status ENUM('ACTIVE','COMPLETED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES player(id) ON DELETE CASCADE,
    FOREIGN KEY (highest_bid_team_id) REFERENCES team(id) ON DELETE SET NULL,
    INDEX idx_auction_status (status),
    INDEX idx_auction_player (player_id)
) ENGINE=InnoDB;

-- Bids
CREATE TABLE IF NOT EXISTS bid (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    auction_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,
    bid_amount DECIMAL(15,2) NOT NULL,
    bid_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (auction_id) REFERENCES auction(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES team(id) ON DELETE CASCADE,
    INDEX idx_bid_auction (auction_id),
    INDEX idx_bid_team (team_id),
    INDEX idx_bid_time (bid_time)
) ENGINE=InnoDB;

-- Default admin user (password: admin123)
INSERT IGNORE INTO admin_user (username, password, email, role)
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin@ipl.com', 'ROLE_ADMIN');
