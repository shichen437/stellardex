CREATE TABLE IF NOT EXISTS sys_notify(
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID
    user_id INTEGER NOT NULL, -- 用户ID
    title varchar(255) NOT NULL, -- 标题
    content text NOT NULL, -- 内容
    type tinyint(2) DEFAULT 0, -- 通知类型
    status tinyint(1) DEFAULT 0, -- 通知状态
    create_at datetime(0) NOT NULL, -- Created Time
    update_at datetime(0) -- Updated Time
);

CREATE INDEX idx_sn_user_id ON sys_notify (
  user_id COLLATE BINARY
);
CREATE INDEX idx_sn_type ON sys_notify (
  type COLLATE BINARY
);
CREATE INDEX idx_sn_status ON sys_notify (
  status COLLATE BINARY
);

CREATE TABLE IF NOT EXISTS user_subscription(
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID
    user_id INTEGER NOT NULL, -- 用户ID
    title varchar(50) NOT NULL, -- 订阅标题
    amount real NOT NULL, -- 金额
    cycle_num tinyint(2) NOT NULL DEFAULT 1, -- 周期数
    cycle_type tinyint(1) DEFAULT 0, -- 周期类型: 0:永久 1:年 2:季 3:月 4:周
    cycle_day tinyint(2) DEFAULT 0, -- 周期天: 0: 自然月 1:30天 2: 31天
    start_date datetime(0) NOT NULL DEFAULT 0, -- 开始日期
    next_date datetime(0), -- 下次日期
    currency INTEGER NOT NULL, -- 币种
    category varchar(255), -- 分类
    site text, -- 站点
    status tinyint(1) DEFAULT 0, -- 订阅状态
    create_at datetime(0) NOT NULL, -- Created Time
    update_at datetime(0) -- Updated Time
);

CREATE INDEX idx_sub_user_id ON user_subscription (
  user_id COLLATE BINARY
);
CREATE INDEX idx_sub_status ON user_subscription (
  status COLLATE BINARY
);
CREATE INDEX idx_sub_category ON user_subscription (
  category COLLATE BINARY
);
CREATE INDEX idx_sub_site ON user_subscription (
  site COLLATE BINARY
);

CREATE TABLE IF NOT EXISTS sys_currency(
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID
    code varchar(255) NOT NULL unique, -- 币种代码
    symbol varchar(10) NOT NULL, -- 币种符号
    is_default tinyint(1) NOT NULL DEFAULT 0, -- 是否默认
    rate real NOT NULL DEFAULT 1, -- 汇率
    sort tinyint(2) NOT NULL DEFAULT 99, -- 排序
    create_at datetime(0) NOT NULL, -- Created Time
    update_at datetime(0) -- Updated Time
);
CREATE INDEX idx_currency_sort ON sys_currency (
  sort COLLATE BINARY
);
INSERT INTO sys_currency(id, code, symbol, is_default, rate, sort, create_at) VALUES (1, 'CNY', '¥', 1, 1, 99, datetime('now', 'localtime'));
INSERT INTO sys_currency(id, code, symbol, is_default, rate, sort, create_at) VALUES (2, 'USD', '$', 0, 0.14, 1, datetime('now', 'localtime'));
INSERT INTO sys_currency(id, code, symbol, is_default, rate, sort, create_at) VALUES (3, 'EUR', '€', 0, 0.10, 2, datetime('now', 'localtime'));
