-- Drop and recreate Users, niches, listings, users_listings, photos, messages, conversations table

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS niches CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS users_listings CASCADE;
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address TEXT NOT NULL
);

CREATE TABLE niches (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL
);

CREATE TABLE listings (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  created TIMESTAMP,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  condition BOOLEAN NOT NULL DEFAULT TRUE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  niche_id INTEGER REFERENCES niches(id) ON DELETE CASCADE
);

CREATE TABLE users_listings (
  id SERIAL PRIMARY KEY NOT NULL,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY NOT NULL,
  photo_1 VARCHAR(255) NOT NULL,
  photo_2 VARCHAR(255),
  photo_3 VARCHAR(255),
  photo_4 VARCHAR(255),
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY NOT NULL,
  created_time TIMESTAMP,
  receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE
);

CREATE TABLE conversations (
  id SERIAL PRIMARY KEY NOT NULL,
  message TEXT NOT NULL,
  created_time TIMESTAMP,
  message_id INTEGER REFERENCES messages(id) ON DELETE CASCADE,
  owner_id INTEGER REFERENCES messages(sender_id) ON DELETE CASCADE
);
