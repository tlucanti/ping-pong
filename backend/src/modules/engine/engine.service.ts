import { Injectable, BadRequestException, NotAcceptableException } from '@nestjs/common';
import { UsersDB } from '../../database/UsersDB'
import { RoomsDB } from '../../database/RoomsDB'

function trunc(a)
{
    if (a < 0)
        return 0
    else if (a > 1)
        return 1;
    return a;
}

@Injectable()
export class EngineService {

    users: any;
    rooms: any;
    timer: any;

    constructor()
    {
        this.users = new UsersDB();
        this.rooms = new RoomsDB();
        this.users.connect();
        this.rooms.connect();
        this.timer = setInterval(this.updateState, 1000, this.rooms);
    }

    async updateState(db)
    {
        const balls = await db.getAllBalls();
        for (const ball of balls) {
            let x = ball.ballx + ball.speedx;
            let y = ball.bally + ball.speedy;
            let sx = ball.speedx;
            let sy = ball.speedy;
            if (x > 1) {
                x = 2 - x;
                sx = -sx;
            } else if (x < 0) {
                x = -x;
                sx = -sx;
            }
            if (y > 1) {
                y = 2 - y;
                sy = -sy;
            } else if (y < 0) {
                y = -y;
                sy = -sy
            }
            //console.log(x, y, sx, sy);
            db.setBallState(ball.id, x, y, sx, sy);
        }
    }

    async createRoom(user1: number, user2: number)
    {
        let u1 = await this.users.getUserById(user1);
        let u2 = await this.users.getUserById(user2);
        if (u1.length == 0)
            throw new BadRequestException(`user ${user1} not exist`);
        if (u2.length == 0)
            throw new BadRequestException(`user ${user2} not exist`);
        u1 = u1[0];
        u2 = u2[0];
        if (u1.room != -1)
            throw new BadRequestException(`user ${user1} is already in room`);
        if (u2.room != -1)
            throw new BadRequestException(`user ${user2} is already in room`);
        const ballStartX = 0.5;
        const ballStartY = 0.5;
        const ballStartSpeedX = 0.5;
        const ballStartSpeedY = 0.5;
        const room_id = await this.rooms.createRoom(user1,
                                                    user2,
                                                    ballStartX,
                                                    ballStartY,
                                                    ballStartSpeedX,
                                                    ballStartSpeedY);
        await this.users.setUserRoom(user1, room_id);
        await this.users.setUserRoom(user2, room_id);
        return room_id;
    }

    async getRoomState(room_id: number)
    {
        let room = await this.rooms.getRoomById(room_id);
        if (room.length == 0)
            throw new BadRequestException(`room ${room_id} not exist`)
        room = room[0];
        return {
            user1: {
                id: room.user1,
                board_position: room.pos1,
                score: room.score1
            },
            user2: {
                id: room.user2,
                board_position: room.pos2,
                score: room.score2
            },
            ball: {
                posx: room.ballx,
                posy: room.bally
            }
        };
    }

    async moveBoard(id: number, pos: number)
    {
        if (pos < 0 || pos > 1)
            throw new NotAcceptableException(`board position not in range [0:1]`);
        let user = await this.users.getUserById(id);
        if (user.length == 0)
            throw new BadRequestException(`user ${id} not exist`);
        user = user[0];
        if (user.room == -1)
            throw new BadRequestException(`user ${id} not in any room`);
        let room = await this.rooms.getRoomById(user.room);
        room = room[0];
        if (room.user1 == id) {
            await this.rooms.setUser1BoardPosition(user.room, pos);
        } else {
            await this.rooms.setUser2BoardPosition(user.room, pos);
        }
    }

    async exitRoom(id: number)
    {
        let user = await this.users.getUserById(id);
        if (user.length == 0)
            throw new BadRequestException(`user ${id} not exist`);
        user = user[0];
        if (user.room == -1)
            throw new BadRequestException(`user ${id} not in room`);
        await this.users.setUserRoom(id, -1);
    }
}
