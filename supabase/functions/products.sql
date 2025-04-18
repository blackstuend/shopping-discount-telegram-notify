-- Create enum type for platforms
CREATE TYPE platform_type AS ENUM ('pchome', 'momo');

-- Create the table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  "chatId" INTEGER NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  platforms platform_type[] NOT NULL,
  
  -- Ensure platforms array is not empty
  CONSTRAINT platforms_not_empty CHECK (array_length(platforms, 1) > 0)
);

