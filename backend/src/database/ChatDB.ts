
const { Client } = require('pg');

export class ChatDB
{
    _db: any;

    constructor()
    {
        const conString: string =
            'postgres://postgres:postgres@localhost:5432/ping_pong';
        this._db = new Client(conString);
    }

    async connect()
    {
        await this._db.connect();
        await this._db.query(`
            create table if not exists messages
                (id serial, username char(16), message char(128) )
        `);
    }

    async getAllMessages()
    {
        const response = await this._db.query(`
            select id, username, message from messages
        `);
        return response.rows;
    }

    async sendMessage(username: string, message: string)
    {
        await this._db.query(`
            insert into
                messages
                    (username, message)
                values
                    ('${username}', '${message}')
        `);
    }

    async reset()
    {
        await this._db.query(`
            delete from messages
        `);
    }
}

