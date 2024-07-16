DROP TABLE IF EXISTS Space;

CREATE TABLE IF NOT EXISTS Space (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid TEXT NOT NULL,
    slug TEXT NOT NULL,
    metaDatabaseId TEXT NOT NULL,
    postDatabaseId TEXT NOT NULL,
    title TEXT NOT NULL,
    state TEXT NOT NULL
);

INSERT INTO
    Space (uid,slug,metaDatabaseId, postDatabaseId, title, state)
VALUES
    ('문팅팅','slug','Alfreds Futterkiste', 'Maria Anders','title', 'state'),
    ('허준무','slug','Around the Horn', 'Thomas Hardy','title','state'),
    ('권준원' ,'slug','Bs Beverages', 'Victoria Ashworth','title','state'),
    ('김민성','slug','Bs Beverages', 'Random Name','title','state');