CREATE INDEX idx_icon_url ON user_group_item (
  icon_url COLLATE BINARY
);

CREATE TABLE IF NOT EXISTS user_img (
  id INTEGER PRIMARY KEY AUTOINCREMENT, -- ID
  url TEXT(255) NOT NULL, -- URL
  type TEXT(30) NOT NULL, -- Type
  user_id INTEGER NOT NULL, -- User ID
  create_at datetime(0) NOT NULL, -- Created Time
  update_at datetime(0) -- Updated Time
);