import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersDB } from '../../database/UsersDB'

@Injectable()
export class UsersService {

    db: any;
    USERNAME_LENGTH: number = 16;
    USER_PASSWORD_LENGTH: number = 32;
    VERBOSE_RESPONSE: boolean = true;

    constructor()
    {
        this.db = new UsersDB();
        this.db.connect();
    }

    BadRequest(message: string)
    {
        if (this.VERBOSE_RESPONSE)
            console.log(' <<< 400:', message);
        throw new BadRequestException(message);
    }

    async addUser(username: string, password_hash: string)
    {
        username = username.trim();
        password_hash = password_hash.trim();
        if (username === undefined)
            this.BadRequest('field (username) expected');
        if (password_hash === undefined)
            this.BadRequest('field (password_hash) expected');
        if (username.length > this.USERNAME_LENGTH)
            this.BadRequest('username length too big');
        if (password_hash.length > this.USER_PASSWORD_LENGTH)
            this.BadRequest('password_hash length too big');

        const user = await this.db.getUserByName(username);
        if (user.length != 0)
            this.BadRequest(`user ${username} already exist`);
        const id: number = await this.db.addUser(username, password_hash);
        return { id: id };
    }

    async loginUser(username: string, password_hash: string)
    {
        username = username.trim();
        password_hash = password_hash.trim();
        if (username === undefined)
            this.BadRequest('field (username) expected');
        if (password_hash === undefined)
            this.BadRequest('field (password_hash) expected');
        if (username.length > this.USERNAME_LENGTH)
            this.BadRequest('username length too big');
        if (password_hash.length > this.USER_PASSWORD_LENGTH)
            this.BadRequest('password_hash length too big');

        let user = await this.db.getUserByName(username);
        if (user.length == 0)
            this.BadRequest(`user ${username} not exist`);
        user = user[0];
        if (user.password_hash.trim() != password_hash)
            this.BadRequest(`incorrect passord`);
        return { id: user.id };
    }

    async getUserById(id: number)
    {
        let user = await this.db.getUserById(id);
        if (user.length == 0)
            this.BadRequest(`user ${id} not exit`);
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
            this.BadRequest(`user ${name} not exist`);
        user = user[0];
        return {
            id: user.id,
            username: user.username,
            room: user.room
        };
    }

    async getAllUsers()
    {
        return await this.db.getAllUsers();
    }
}
