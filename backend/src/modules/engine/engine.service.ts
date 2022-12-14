import { Injectable, BadRequestException, NotAcceptableException, HttpStatus } from '@nestjs/common';
import { UsersDB } from '../../database/UsersDB'
import { RoomsDB } from '../../database/RoomsDB'

type RoomState = {
    ballx: number,
    bally: number,
    pos1: number,
    pos2: number,
    speedx: number,
    speedy: number,
    score1: number,
    score2: number,
    BOARD_SIZE: number
};

function rand(start, end) {
    return Math.random() * (end - start) + start;
};

function resetRoom() {
    let sx = rand(0.05, 0.1);
    return [
        0.5,
        rand(0.2, 0.8),
        sx,
        0.2 - sx
    ];
};

function updateRoomSingle(room: RoomState): RoomState
{
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
        if (Math.abs(room.pos1 - y) < room.BOARD_SIZE) {
            ++score1;
            [x, y, sx, sy] = resetRoom();
        } else {
            x = 2 - x;
            sx = -sx;
        }
    } else if (x < 0) {
        if (Math.abs(room.pos2 - y) < room.BOARD_SIZE) {
            ++score2;
            [x, y, sx, sy] = resetRoom();
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
    room.ballx = x;
    room.bally = y;
    room.speedx = sx;
    room.speedy = sy;
    room.score1 = score1;
    room.score2 = score2;
    return room;
}

@Injectable()
export class EngineService {

    users: any;
    rooms: any;
    UPDATE_FREQUENCY: number = 100;
    BOARD_SIZE: number = 0.1;
    VERBOSE_RESPONSE: boolean = true;
    next_user: number;
    next_response: any;

    constructor()
    {
        this.users = new UsersDB();
        this.rooms = new RoomsDB();
        this.users.connect();
        this.rooms.connect();
        this.next_user = -1;
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

    printResponse(message)
    {
        if (this.VERBOSE_RESPONSE)
            console.log(' <<<', message);
    }

    async __do_update(self)
    {
        self.updateState()
    }

    async updateState()
    {
        const rooms = await this.rooms.getAllRooms();
        let arg: RoomState = {
            ballx: 0,
            bally: 0,
            pos1: 0,
            pos2: 0,
            speedx: 0,
            speedy: 0,
            score1: 0,
            score2: 0,
            BOARD_SIZE: this.BOARD_SIZE
        };
        for (const room of rooms) {
            arg.ballx = room.ballx;
            arg.bally = room.bally;
            arg.pos1 = room.pos1;
            arg.pos2 = room.pos2;
            arg.speedx = room.speedx;
            arg.speedy = room.speedy;
            arg.score1 = room.score1;
            arg.score2 = room.score2;
            updateRoomSingle(arg);
            this.rooms.setRoomState(room.id,
                                    arg.ballx,
                                    arg.bally,
                                    arg.speedx,
                                    arg.speedy,
                                    arg.score1,
                                    arg.score2);
        }
    }

    async startGame(user: number, response)
    {
        let u = await this.users.getUserById(user);
        if (u.length == 0)
            this.BadRequest(`user ${user} not exist`);
        u = u[0];
        if (u.room != -1)
            this.BadRequest(`user ${user} already in room`);
        if (this.next_user == -1) {
            this.next_user = user;
            this.next_response = response;
        } else {
            if (this.next_user == user)
                this.BadRequest(`user ${user} already in room`);
            const room_id = await this.createRoom(user, this.next_user);
            const content = { room_id: room_id };
            this.printResponse(content);
            this.next_response.status(HttpStatus.OK).send(JSON.stringify(content));
            this.printResponse(content);
            response.status(HttpStatus.OK).send(JSON.stringify(content));
            this.next_user = -1;
        }
    }

    async createRoom(user1: number, user2: number)
    {
        let u1 = await this.users.getUserById(user1);
        let u2 = await this.users.getUserById(user2);
        u1 = u1[0];
        u2 = u2[0];
        const [bx, by, sx, sy] = resetRoom();
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
                posy: room.bally,
                speedx: room.speedx,
                speedy: room.speedy
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
        let room = await this.rooms.getRoomById(user.room);
        room = room[0];
        this.rooms.deleteRoomById(user.room);
        this.users.setUserRoom(room.user1, -1);
        this.users.setUserRoom(room.user2, -1);
        return "ok";
    }

    async resetDatabase()
    {
        this.users.reset();
        this.rooms.reset();
    }
}
