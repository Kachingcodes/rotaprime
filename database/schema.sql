CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    lastname VARCHAR(100) NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    gender VARCHAR(20),
    phone VARCHAR(30),
    email VARCHAR(255),
    dob DATE,
    occupation VARCHAR(150),
    address TEXT,
    position_id INTEGER REFERENCES positions(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending'
        CHECK (status IN ('Pending', 'Accepted', 'Rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO positions (name) VALUES
    ('President'),
    ('President-Elect'),
    ('Treasurer'),
    ('Secretary'),
    ('Membership Director'),
    ('Rotary Foundation Chair'),
    ('Service Project Chair'),
    ('Public Image Chair'),
    ('Club Admin'),
    ('Club Adviser'),
    ('Welfare Secretary');