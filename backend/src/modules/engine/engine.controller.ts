import { Controller, Get, Post, Body, Param, Res, HttpStatus,
    BadRequestException, Put, Delete } from '@nestjs/common';
import { EngineService } from './engine.service';
import { Response } from 'express';

@Controller('api/engine')
export class EngineController
{
    VERBOSE_REQUEST: boolean = true;
    VERBOSE_RESPONSE: boolean = true;

    constructor(private readonly engineService: EngineService) {}

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

    @Put('start/:id')
    async startGame(@Param('id') id: number, @Res() response: Response)
    {
        this.printRequest('starting game', id);
        id = this.asInt(id);
        await this.engineService.startGame(id, response);
        //this.printResponse(content);
        //response.status(HttpStatus.OK).send(JSON.stringify(content));
    }

    @Get('get/:room_id')
    async getRoomState(@Param('room_id') id: number, @Res() response: Response)
    {
        this.printRequest('getting room info', id);
        id = this.asInt(id);
        const content = await this.engineService.getRoomState(id);
        this.printResponse(content);
        response.status(HttpStatus.OK).send(JSON.stringify(content));
    }

    @Post('move/:user_id')
    async moveBoard(@Body() body, @Param('user_id') id: number, @Res() response: Response)
    {
        this.printRequest(`moving ${id}'s board to`, body);
        id = this.asInt(id);
        const content = await this.engineService.moveBoard(id, body.position);
        this.printResponse(content);
        response.status(HttpStatus.OK).send(JSON.stringify(content));
    }

    @Delete('exit_room/:user_id')
    async exitRoom(@Param('user_id') id: number, @Res() response: Response)
    {
        this.printRequest(`user ${id} exiting room`);
        id = this.asInt(id);
        const content = await this.engineService.exitRoom(id);
        this.printResponse(content);
        response.status(HttpStatus.OK).send(JSON.stringify(content));
    }

    @Get('reset')
    async restartDatabase(@Res() response: Response)
    {
        this.printRequest('resetting rooms');
        this.engineService.restartDatabase();
        this.printResponse("ok")
        response.status(HttpStatus.OK).send("ok");
    }
}
