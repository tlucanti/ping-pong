import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/user')
export class UsersController
{
    constructor(private readonly usersService: UsersService) {}

    @Post('add')
    addUser(@Body() body): number
    {
        console.log('lools');
        console.log(body);
        return this.usersService.addUser('name', 'pass-hash');
    }

    @Get('id/:userid')
    getUserById(@Param('userid') id: number)
    {
        console.log('getting user', id);
        return this.usersService.getUserById(id);
    }

    @Get('name/:username')
    getUserByName(@Param('username') username: string)
    {
        console.log('getting user', username);
        return this.usersService.getUserByName(username);
    }

    @Get('all')
    getAllUsers()
    {
        console.log('getting all users');
        return this.usersService.getAllUsers();
    }
}
