
export class UsersDB
{
    _db: any;

    constructor(db: any)
    {
        this._db = db;
    }

    async getAllUsers()
    {
        return await this._db`select * from users`;
    }
}
