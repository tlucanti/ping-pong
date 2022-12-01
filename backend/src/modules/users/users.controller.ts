import { Controller, Get, Post, Body, Param, Header, HttpStatus, Req, Res, HttpCode,
    HttpException, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';

@Controller('api/user')
export class UsersController
{
    USERNAME_LENGTH: number = 16;
    USER_PASSWORD_LENGTH: number = 32;

    constructor(private readonly usersService: UsersService) {}

    @Post('add')
    async addUser(@Body() body, @Res() response: Response)
    {
        console.log('adding new user', body);
        if (body.username === undefined)
            throw new BadRequestException('field (username) expected');
        if (body.password_hash === undefined)
            throw new BadRequestException('field (password_hash) expected');
        if (body.username.length > this.USERNAME_LENGTH)
            throw new BadRequestException('username length too big');
        if (body.password_hash > this.USER_PASSWORD_LENGTH)
            throw new BadRequestException('password_hash length too big');
        const content = await this.usersService.addUser(body.username, body.password_hash);
        response.status(HttpStatus.OK).send(JSON.stringify(content));
    }

    @Get('get/id/:userid')
    async getUserById(@Param('userid') id: number, @Res() response: Response)
    {
        console.log('getting user', id);
        const content = await this.usersService.getUserById(id);
        response.status(HttpStatus.OK).send(JSON.stringify(content));
    }

    @Get('get/name/:username')
    async getUserByName(@Param('username') username: string, @Res() response: Response)
    {
        console.log('getting user', username);
        const content =  await this.usersService.getUserByName(username);
        response.status(HttpStatus.OK).send(JSON.stringify(content));
    }

    @Get('get/all')
    async getAllUsers(@Res() response: Response)
    {
        console.log('getting all users');
        const content = await this.usersService.getAllUsers();
        response.status(HttpStatus.OK).send(JSON.stringify(content));
    }
}
