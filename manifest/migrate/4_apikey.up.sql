CREATE TABLE IF NOT EXISTS sys_api_key(
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID
    user_id INTEGER NOT NULL, -- 用户ID
    api_key varchar(255) NOT NULL, -- 密钥
    api_key_name varchar(30) NOT NULL, -- 密钥名称
    status tinyint(1) DEFAULT 1, -- 密钥状态
    expires_at datetime(0), -- 过期时间
    create_at datetime(0) NOT NULL, -- Created Time
    update_at datetime(0) -- Updated Time
);

CREATE INDEX idx_ak_user_id ON sys_api_key (
  user_id COLLATE BINARY
);
CREATE INDEX idx_ak_api_key ON sys_api_key (
  api_key COLLATE BINARY
);
CREATE INDEX idx_ak_status ON sys_api_key (
  status COLLATE BINARY
);