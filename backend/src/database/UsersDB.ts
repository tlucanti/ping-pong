
const { Client } = require('pg');

export class UsersDB
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
    }

    async getAllUsers()
    {
        const response = await this._db.query(`
            select id, room, username from users
        `);
        return response.rows;
    }

    async addUser(username: string, password_hash: string)
    {
        const response = await this._db.query(`
            insert into
                users
                    (room, username, password_hash)
                values
                    (-1, '${username}', '${password_hash}')
            returning
                id
        `);
        return response.rows[0].id;
    }

    async deleteUserById(id: number)
    {
        await this._db.query(`
            delete from users where id = ${id}
        `);
    }

    async deleteUserByName(username: string)
    {
        await this._db.query(`
            delete from users where username = '${username}'
        `);
    }

    async getUserById(id: number)
    {
        const response = await this._db.query(`
            select * from users where id = ${id}
        `);
        return response.rows;
    }

    async getUserByName(username: string)
    {
        const response = await this._db.query(`
            select * from users where username = '${username}'
        `);
        return response.rows;
    }

    async setUserRoom(id: number, room: number)
    {
        await this._db.query(`
            update users set room = ${room} where id = ${id}
        `);
    }
}

