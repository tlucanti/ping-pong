
//const { postgres } = require('postgres');
import postgres from 'postgres';

async function main()
{
    const st = 'postgres://postgres:postgres@localhost:5432/ping_pong';
    const db = postgres(st);
    console.log(db);

    const xs = await db`select * from users`;
    console.log(xs);
}

(async() => await main())();

