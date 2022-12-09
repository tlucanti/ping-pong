import { Injectable, BadRequestException } from '@nestjs/common';
import { ChatDB } from '../../database/ChatDB'

@Injectable()
export class ChatService {

    db: any;
    VERBOSE_RESPONSE: boolean = true;

    constructor()
    {
        this.db = new ChatDB();
        this.db.connect();
    }

    BadRequest(message: string)
    {
        if (this.VERBOSE_RESPONSE)
            console.log(' <<< 400:', message);
        throw new BadRequestException(message);
    }

    async getAllMessages()
    {
        return await this.db.getAllMessages();
    }

    async sendMessage(username: string, message: string)
    {
        if (username === undefined)
            this.BadRequest('field (username) expected');
        if (message === undefined)
            this.BadRequest('field (message) expected');
        username = username.trim();
        message = message.trim();
        if (message.length > 128)
            this.BadRequest('message is too long');
        await this.db.sendMessage(username, message);
    }

    async resetDatabase()
    {
        this.db.reset();
    }
}
