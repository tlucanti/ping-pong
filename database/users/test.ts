
import postgres from 'postgres'
import { UsersDB } from './UsersDB'

async function main() {
    const st = 'postgres://postgres:postgres@localhost:5432/ping_pong';
    console.log('connecting');
    let db = new UsersDB(postgres(st));
    //console.log(await db.getAllUsers());
    //console.log(await db.getUserById(0));
    //console.log(await db.getUserByName('user0'))
    console.log(await db.getUserCount());

    console.log(await db.addUser('generated-user', 'pass-hash', 'GENERATED-TOKEN'));
    console.log(await db.getAllUsers());
}

(async() => await main())();

