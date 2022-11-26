import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
export class UsersController
{
    constructor(private readonly usersService: UsersService) {}

    @Post('/api/user/add')
    index(@Body() body)
    {
        console.log(body);
        return this.usersService.addUser('name', 'pass-hash');
    }
}
