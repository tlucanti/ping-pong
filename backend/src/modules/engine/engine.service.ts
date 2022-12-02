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

function rand(start, end)
{
    return Math.random() * (end - start) + start;
}

@Injectable()
export class EngineService {

    users: any;
    rooms: any;
    UPDATE_FREQUENCY: number = 1000;
    BOARD_SIZE: number = 0.1;
    VERBOSE_RESPONSE: boolean = true;

    constructor()
    {
        this.users = new UsersDB();
        this.rooms = new RoomsDB();
        this.users.connect();
        this.rooms.connect();
        setInterval(this.__do_update, this.UPDATE_FREQUENCY, this);
    }

    BadRequest(message: string)
    {
        if (this.VERBOSE_RESPONSE)
            console.log(' <<< 400:', message);
        throw new BadRequestException(message);
    }

    NotAcceptable(message: string)
    {
        if (this.VERBOSE_RESPONSE)
            console.log(' <<< 401:', message);
        throw new NotAcceptableException(message);
    }

    async __do_update(self)
    {
        self.updateState()
    }

    async updateState()
    {
        const rooms = await this.rooms.getAllRooms();
        for (const room of rooms) {
            let x = room.ballx + room.speedx;
            let y = room.bally + room.speedy;
            let sx = room.speedx;
            let sy = room.speedy;
            let score1 = room.score1;
            let score2 = room.score2;
            if (y > 1) {
                y = 2 - y;
                sy = -sy;
            } else if (y < 0) {
                y = -y;
                sy = -sy
            }
            if (x > 1) {
                if (Math.abs(room.pos1 - y) < this.BOARD_SIZE) {
                    ++score1;
                    [x, y, sx, sy] = this.resetRoom();
                } else {
                    x = 2 - x;
                    sx = -sx;
                }
            } else if (x < 0) {
                if (Math.abs(room.po2 - y) < this.BOARD_SIZE) {
                    ++score2;
                    [x, y, sx, sy] = this.resetRoom();
                } else {
                    x = -x;
                    sx = -sx;
                }
            }
            /* console.log(x.toFixed(2),
                        y.toFixed(2),
                        sx.toFixed(2),
                        sy.toFixed(2),
                        room.pos1.toFixed(2),
                        room.pos2.toFixed(2),
                        score1,
                        score2); */
            this.rooms.setRoomState(room.id, x, y, sx, sy, score1, score2);
        }
    }


    resetRoom()
    {
        let sx = rand(0.05, 0.1);
        return [
            0.5,
            rand(0.2, 0.8),
            sx,
            0.2 - sx
        ];
    }

    async createRoom(user1: number, user2: number)
    {
        if (user1 === undefined)
            this.BadRequest('field (user1) expected');
        if (user2 === undefined)
            this.BadRequest('field (user2) expected');

        let u1 = await this.users.getUserById(user1);
        let u2 = await this.users.getUserById(user2);
        if (u1.length == 0)
            this.BadRequest(`user ${user1} not exist`);
        if (u2.length == 0)
            this.BadRequest(`user ${user2} not exist`);
        u1 = u1[0];
        u2 = u2[0];
        if (u1.room != -1)
            this.BadRequest(`user ${user1} is already in room`);
        if (u2.room != -1)
            this.BadRequest(`user ${user2} is already in room`);
        const [bx, by, sx, sy] = this.resetRoom();
        const room_id = await this.rooms.createRoom(user1, user2, bx, by, sx, sy);
        await this.users.setUserRoom(user1, room_id);
        await this.users.setUserRoom(user2, room_id);
        return room_id;
    }

    async getRoomState(room_id: number)
    {
        let room = await this.rooms.getRoomById(room_id);
        if (room.length == 0)
            this.BadRequest(`room ${room_id} not exist`)
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
        if (pos === undefined)
            this.BadRequest('expected (position)')
        if (pos < 0 || pos > 1)
            this.NotAcceptable(`board position not in range [0:1]`);

        let user = await this.users.getUserById(id);
        if (user.length == 0)
            this.BadRequest(`user ${id} not exist`);
        user = user[0];
        if (user.room == -1)
            this.BadRequest(`user ${id} not in any room`);
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
            this.BadRequest(`user ${id} not exist`);
        user = user[0];
        if (user.room == -1)
            this.BadRequest(`user ${id} not in room`);
        await this.users.setUserRoom(id, -1);
    }
}
