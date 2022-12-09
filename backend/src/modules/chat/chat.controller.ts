import { Controller, Get, Post, Body, Param, Res, HttpStatus,
    BadRequestException, Put, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Response } from 'express';

@Controller('api/chat')
export class ChatController
{
    VERBOSE_REQUEST: boolean = true;
    VERBOSE_RESPONSE: boolean = true;

    constructor(private readonly chatService: ChatService) {}

    printRequest(...params)
    {
        if (this.VERBOSE_REQUEST)
            console.log(' >>>', ...params);
    }

    printResponse(message: any)
    {
        if (this.VERBOSE_RESPONSE)
            console.log(' <<<', message);
    }

    BadRequest(message: string)
    {
        if (this.VERBOSE_RESPONSE)
            console.log(' <<< 400:', message);
        throw new BadRequestException(message);
    }

    asInt(v: any): number
    {
        if (!(/^\d+$/.test(v)))
            this.BadRequest(`expected number, got '${v}'`);
        return parseInt(v);
    }

    @Get('get/all')
    async getAllMessages(@Res() response: Response)
    {
        this.printRequest('getting all messages');
        const content = await this.chatService.getAllMessages();
        this.printResponse(content);
        response.status(HttpStatus.OK).send(JSON.stringify(content));
    }

    @Post('send')
    async sendMessage(@Body() body, @Res() response: Response)
    {
        this.printRequest('sending message', body);
        await this.chatService.sendMessage(body.username, body.message);
        this.printResponse('ok');
        response.status(HttpStatus.OK).send('ok');

    }

    @Get('reset')
    async resetDatabase(@Res() response: Response)
    {
        this.printRequest('resetting messages');
        this.chatService.resetDatabase();
        this.printResponse('ok')
        response.status(HttpStatus.OK).send('ok');
    }
}
