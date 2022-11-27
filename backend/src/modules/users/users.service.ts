import { Injectable } from '@nestjs/common';
import { UsersDB } from '../../database/UsersDB'

@Injectable()
export class UsersService {

    db: any;

    constructor()
    {
        this.db = new UsersDB();
        this.db.connect();
    }

    addUser(username: string, password_hash: string): number
    {
        return this.db.addUser(username, password_hash);
    }

    getUserById(id: number)
    {
        return this.db.getUserById(id);
    }

    getUserByName(username: string)
    {
        return this.db.getUserByName(username);
    }

    getAllUsers()
    {
        return this.db.getAllUsers();
    }
}
