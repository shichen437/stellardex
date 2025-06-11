CREATE TABLE IF NOT EXISTS user_bookmark(
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID
    user_id int(11) NOT NULL, -- 用户ID
    author varchar(50), -- 作者
    content_html text NOT NULL, -- 书签html内容
    excerpt varchar(255), -- 摘要
    published_at datetime(0), -- 发布时间
    reading_time int(11), -- 阅读时间
    source_url varchar(255) NOT NULL, -- 书签源地址
    title varchar(100) NOT NULL, -- 书签标题
    word_count int(11), -- 字数
    content_text text NOT NULL, -- 书签text内容
    cover_image_url varchar(255), -- 封面图片地址
    site_name varchar(50), -- 网站名称
    status tinyint(1) DEFAULT 0, -- 书签状态
    is_archive tinyint(1) DEFAULT 0, -- 是否归档
    is_starred tinyint(1) DEFAULT 0, -- 是否收藏
    create_at datetime(0) NOT NULL, -- Created Time
    update_at datetime(0) -- Updated Time
);

CREATE INDEX idx_ub_user_id ON user_bookmark (
  user_id COLLATE BINARY
);
CREATE INDEX idx_ub_status ON user_bookmark (
  status COLLATE BINARY
);
CREATE INDEX idx_ub_archive ON user_bookmark (
  is_archive COLLATE BINARY
);
CREATE INDEX idx_ub_star ON user_bookmark (
  is_starred COLLATE BINARY
);
CREATE INDEX idx_ub_content_text ON user_bookmark (
  content_text COLLATE BINARY
);
CREATE INDEX idx_ub_excerpt ON user_bookmark (
  excerpt COLLATE BINARY
);
CREATE INDEX idx_ub_title ON user_bookmark (
  title COLLATE BINARY
);
CREATE INDEX idx_ub_site_name ON user_bookmark (
  site_name COLLATE BINARY
);
CREATE INDEX idx_ub_author ON user_bookmark (
  author COLLATE BINARY
);

CREATE TABLE IF NOT EXISTS bookmark_label(
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID
    user_id int(11) NOT NULL, -- 用户ID
    name varchar(50) NOT NULL, -- 标签名称
    create_at datetime(0) NOT NULL, -- Created Time
    update_at datetime(0) -- Updated Time
);
CREATE INDEX idx_bl_user_id ON bookmark_label (
  user_id COLLATE BINARY
);
CREATE INDEX idx_bl_name ON bookmark_label (
  name COLLATE BINARY
);

CREATE TABLE IF NOT EXISTS bookmark_label_relation(
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID
    bookmark_id int(11) NOT NULL, -- 书签ID
    label_id int(11) NOT NULL -- 标签ID
);
CREATE INDEX idx_blr_bookmark_id ON bookmark_label_relation (
  bookmark_id COLLATE BINARY
);
CREATE INDEX idx_blr_label_id ON bookmark_label_relation (
  label_id COLLATE BINARY
);

CREATE TABLE IF NOT EXISTS user_custom_selector(
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID
    user_id int(11) NOT NULL, -- 用户ID
    domain varchar(100) NOT NULL, -- 域名
    title varchar(255), -- 书签标题
    byline varchar(255), -- 作者
    excerpt varchar(255), -- 摘要
    content varchar(255) NOT NULL, -- 书签html内容
    published_time varchar(255), -- 发布时间
    cookie text, -- Cookie
    create_at datetime(0) NOT NULL, -- Created Time
    update_at datetime(0) -- Updated Time
);

CREATE INDEX idx_cs_user_id ON user_custom_selector (
  user_id COLLATE BINARY
);
CREATE INDEX idx_cs_domain ON user_custom_selector (
  domain COLLATE BINARY
);