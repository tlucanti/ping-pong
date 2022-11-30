import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/user')
export class UsersController
{
    constructor(private readonly usersService: UsersService) {}

    @Post('add')
    async addUser(@Body() body)
    {
        console.log('lools');
        console.log(body);
        return await this.usersService.addUser('name', 'pass-hash');
    }

    @Get('get/id/:userid')
    async getUserById(@Param('userid') id: number)
    {
        console.log('getting user', id);
        return await this.usersService.getUserById(id);
    }

    @Get('get/name/:username')
    async getUserByName(@Param('username') username: string)
    {
        console.log('getting user', username);
        return await this.usersService.getUserByName(username);
    }

    @Get('get/all')
    async getAllUsers()
    {
        console.log('getting all users');
        return await this.usersService.getAllUsers();
    }
}
