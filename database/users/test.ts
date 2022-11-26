
import postgres from 'postgres'
import { UsersDB } from './UsersDB'

async function main() {
    const st = 'postgres://postgres:postgres@localhost:5432/ping_pong';
    let db = new UsersDB(postgres(st));

    console.log(await db.getAllUsers());
}

(async() => await main())();

