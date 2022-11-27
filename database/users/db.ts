
const { Client } = require('pg');
import { UsersDB } from './UsersDB'

const conString = 'postgres://postgres:postgres@localhost:5432/ping_pong';
console.log(conString);

async function main() {
    const db = new UsersDB(conString);
    await db.connect();

    console.log(await db.addUser('my-user', 'passHash'));
    console.log(await db.getAllUsers());

    await db.deleteUserByName('my-user');
    console.log(await db.getAllUsers());

    //db.end();
}

(async() => await main())();
