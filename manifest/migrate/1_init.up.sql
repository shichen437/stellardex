CREATE TABLE IF NOT EXISTS sys_user(
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID
    username varchar(30) NOT NULL unique, -- 用户名
    password varchar(255) NOT NULL, -- 用户密码
    nickname varchar(30) NOT NULL, -- 昵称
    sex tinyint(1) DEFAULT 1, -- 性别
    email varchar(50), -- 邮箱
    mobile varchar(20), -- 手机号
    status tinyint(1) DEFAULT 1, -- 用户状态
    avatar varchar(255) DEFAULT NULL, -- 头像
    create_at datetime(0) NOT NULL, -- Created Time
    update_at datetime(0) -- Updated Time
);

CREATE TABLE IF NOT EXISTS sys_role(
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID
    role_name varchar(45) NOT NULL unique, -- 角色名称
    role_name_en varchar(45) NOT NULL unique, -- 角色英文名称
    create_by INTEGER NOT NULL, -- Created By
    create_at datetime(0) NOT NULL, -- Created Time
    update_at datetime(0) -- Updated Time
);

CREATE TABLE IF NOT EXISTS sys_user_role(
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID
    user_id int(11) NOT NULL, -- User ID
    role_id int(11) NOT NULL -- Role ID
);

CREATE TABLE IF NOT EXISTS user_group(
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID
    user_id int(11) NOT NULL, -- User ID
    group_name varchar(45) NOT NULL, -- 分组名称
    display_type varchar(45) NOT NULL, -- 展示类型
    is_show tinyint(1) NOT NULL, -- 是否显示
    order_num tinyint(2) NOT NULL, -- Order
    create_at datetime(0) NOT NULL, -- Created Time
    update_at datetime(0) -- Updated Time
);

CREATE TABLE IF NOT EXISTS user_group_item(
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID
    group_id int(11) NOT NULL, -- Group ID
    title varchar(45) NOT NULL, -- 标题
    url varchar(255) NOT NULL, -- URL
    lan_url varchar(255), -- Lan URL
    description varchar(100), -- 描述
    icon_type varchar(45) NOT NULL, -- 图标类型
    icon_url varchar(45), -- 图标地址
    bg_color varchar(45) NOT NULL, -- 背景色
    opacity real, -- 透明度
    order_num int(4) NOT NULL, -- Order
    create_at datetime(0) NOT NULL, -- Created Time
    update_at datetime(0) -- Updated Time
);

CREATE TABLE IF NOT EXISTS user_settings(
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID
    user_id int(11) NOT NULL unique, -- User ID
    interface_config json, -- 界面设置
    module_config json, -- 组件设置
    site_config json, -- 站点设置
    group_config json, -- 分组设置
    create_at datetime(0) NOT NULL, -- Created Time
    update_at datetime(0) -- Updated Time
);

INSERT INTO sys_role(id, role_name, role_name_en, create_by, create_at) VALUES (1, '管理员', 'admin', 1, datetime('now', 'localtime'));
INSERT INTO sys_role(id, role_name, role_name_en, create_by, create_at) VALUES (2, '用户', 'user', 1, datetime('now', 'localtime'));

INSERT INTO sys_user_role(id, user_id, role_id) VALUES (1, 1, 1);
