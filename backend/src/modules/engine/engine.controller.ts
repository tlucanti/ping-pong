import { Controller, Get, Post, Body, Param, Res, HttpStatus, BadRequestException } from '@nestjs/common';
import { EngineService } from './engine.service';
import { Response } from 'express';

@Controller('api/engine')
export class EngineController
{
    constructor(private readonly engineService: EngineService) {}

    @Post('create_room')
    async createRoom(@Body() body, @Res() response: Response)
    {
        console.log('creating room', body);
        if (body.user1 === undefined)
            throw new BadRequestException('field (user1) expected');
        if (body.user2 === undefined)
            throw new BadRequestException('field (user2) expected');
        const content = await this.engineService.createRoom(body.user1, body.user2);
        response.status(HttpStatus.OK).send(JSON.stringify(content));
    }

    @Get('get/:room_id')
    async getRoomState(@Param('room_id') id: number, @Res() response: Response)
    {
        console.log('getting room info', id);
        const content = await this.engineService.getRoomState(id);
        response.status(HttpStatus.OK).send(JSON.stringify(content));
    }

    @Post('move/:user_id')
    async moveBoard(@Body() body, @Param('user_id') id: number, @Res() response: Response)
    {
        console.log(`moving ${id}'s board to`, body);
        if (body.position === undefined)
            throw new BadRequestException('expected (position)')
        const content = await this.engineService.moveBoard(id, 0.3);
        response.status(HttpStatus.OK).send(JSON.stringify(content));
    }

    @Post('exit_room/:user_id')
    async exitRoom(@Param('user_id') id: number, @Res() response: Response)
    {
        console.log(`user ${id} exiting room`);
        const content = await this.engineService.exitRoom(id);
        response.status(HttpStatus.OK).send(JSON.stringify(content));
    }
}
