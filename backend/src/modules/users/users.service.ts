import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersDB } from '../../database/UsersDB'

@Injectable()
export class UsersService {

    db: any;

    constructor()
    {
        this.db = new UsersDB();
        this.db.connect();
    }

    async addUser(username: string, password_hash: string)
    {
        const user = await this.db.getUserByName(username);
        if (user.length != 0)
            throw new BadRequestException(`user ${username} already exist`);
        const id: number = await this.db.addUser(username, password_hash);
        return { id: id };
    }

    async getUserById(id: number)
    {
        let user = await this.db.getUserById(id);
        if (user.length == 0)
            throw new BadRequestException(`user ${id} not exit`);
        user = user[0];
        return {
            id: id,
            username: user.username,
            room: user.room
        };
    }

    async getUserByName(username: string)
    {
        let user = await this.db.getUserByName(username);
        if (user.length == 0)
            throw new BadRequestException(`user ${name} not exist`);
        user = user[0];
        return {
            id: user.id,
            username: user.username,
            room: user.room
        }
    }

    async getAllUsers()
    {
        return await this.db.getAllUsers();
    }
}
