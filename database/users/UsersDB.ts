
const { Client } = require('pg');

export class UsersDB
{
    _db: any;

    constructor(conString: string)
    {
        this._db = new Client(conString);
    }

    async connect()
    {
        await this._db.connect();
    }

    async getAllUsers()
    {
        const response = await this._db.query(`
            select * from users
        `);
        return response.rows;
    }

    async addUser(username: string, password_hash: string)
    {
        return await this._db.query(`
            insert into
                users
                    (username, password_hash)
                values
                    ('${username}', '${password_hash}')
            returning
                id
        `);
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
        return await this._db.query(`
            select * from users where id = ${id}
        `);
    }

    async getUserByName(username: string)
    {
        return await this._db.query(`
            select * from users where name = ${username}
        `);
    }
}

