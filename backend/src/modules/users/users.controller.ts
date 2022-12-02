import { Controller, Get, Post, Put, Body, Param, Header, HttpStatus, Req, Res, HttpCode,
    HttpException, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';

@Controller('api/user')
export class UsersController
{
    VERBOSE_REQUEST: boolean = true;
    VERBOSE_RESPONSE: boolean = true;

    constructor(private readonly usersService: UsersService) {}

    printRequest(...params)
    {
        if (this.VERBOSE_REQUEST)
            console.log(' >>> ', ...params);
    }

    printResponse(message: any)
    {
        if (this.VERBOSE_RESPONSE)
            console.log(' <<< ', message);
        return message;
    }

    @Put('add')
    async addUser(@Body() body, @Res() response: Response)
    {
        this.printRequest('adding new user', body);
        const content = await this.usersService.addUser(body.username, body.password_hash);
        this.printResponse(content);
        response.status(HttpStatus.OK).send(JSON.stringify(content));
    }

    @Post('login')
    async userLogin(@Body() body, @Res() response: Response)
    {
        this.printRequest('log in user', body);
        const content = await this.usersService.loginUser(body.username, body.password_hash);
        this.printResponse(content);
        response.status(HttpStatus.OK).send(JSON.stringify(content));
    }

    @Get('get/id/:userid')
    async getUserById(@Param('userid') id: number, @Res() response: Response)
    {
        this.printRequest('getting user', id);
        const content = await this.usersService.getUserById(id);
        this.printResponse(content);
        response.status(HttpStatus.OK).send(JSON.stringify(content));
    }

    @Get('get/name/:username')
    async getUserByName(@Param('username') username: string, @Res() response: Response)
    {
        this.printRequest('getting user', username);
        const content =  await this.usersService.getUserByName(username);
        this.printResponse(content);
        response.status(HttpStatus.OK).send(JSON.stringify(content));
    }

    @Get('get/all')
    async getAllUsers(@Res() response: Response)
    {
        this.printRequest('getting all users');
        const content = await this.usersService.getAllUsers();
        this.printResponse(content);
        response.status(HttpStatus.OK).send(JSON.stringify(content));
    }
}
