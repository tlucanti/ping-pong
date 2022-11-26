
require('dotenv').config();
const { Client } = require('pg');


const PG_USER = process.env.PG_USER;
const PG_PASSWD = process.env.PG_PASS;
const PG_DB = process.env.PG_DB;
const conString = `postgres://${PG_USER}:${PG_PASS}@localhost:5432/${PG_DB}`;
console.log(conString);

async function main() {
    const st = 'postgres://postgres:postgres@localhost:5432/users';
    const usersDB = new Client({
        user: 'postgres',
        password: 'postgres',
        host: 'localhost',
        database: 'users',
        port: 5432
    });
    console.log('created client');

    usersDB.connect()
        .then(() => console.log('connected'))
        .catch((err) => console.error('connection error'));

    const res = await usersDB.query('SELECT * from users;');
    console.log('queried');

    //const res = await client.query('SELCT $1::text as message', ['Hello world!'])
    //console.log(res.rows[0].message);
    usersDB.end();
}

(async() => await main())();
