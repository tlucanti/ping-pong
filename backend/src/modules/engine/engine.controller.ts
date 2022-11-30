import { Controller, Get, Post, Body, Param, Response, Header } from '@nestjs/common';
import { EngineService } from './engine.service';

@Controller('api/engine')
export class EngineController
{
    constructor(private readonly engineService: EngineService) {}

    @Post('create_room')
    async createRoom(@Body() body): Promise<number>
    {
        console.log('creating room');
        console.log(body);
        return await this.engineService.createRoom(1, 2);
    }

    @Get('get/:room_id')
    @Header('Cache-Control', 'none')
    async getRoomState(@Param('room_id') id: number)
    {
        console.log('getting room info', id);
        return await this.engineService.getRoomState(id);
    }

    @Post('move/:user_id')
    async moveBoard(@Body() body, @Param('user_id') id: number)
    {
        console.log(`moving ${id}'s board to`, body);
        return await this.engineService.moveBoard(id, 0.3);
    }
}
