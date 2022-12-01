
const { Client } = require('pg');

export class RoomsDB
{
    _db: any;

    constructor()
    {
        const conString: string =
            'postgres://postgres:postgres@localhost:5432/ping_pong';
        this._db = new Client(conString);
    }

    async connect()
    {
        await this._db.connect();
    }

    async createRoom(user1: number,
                     user2: number,
                     ballx: number,
                     bally: number,
                     speedx: number,
                     speedy: number)
    {
        const response = await this._db.query(`
            insert into
                rooms
                    (user1, user2, score1, score2, pos1, pos2, ballx, bally, speedx, speedy)
                values
                    (${user1}, ${user2}, 0, 0, 0.5, 0.5, ${ballx}, ${bally}, ${speedx}, ${speedy})
            returning
                id
        `);
        return response.rows[0].id;
    }
    async deleteRoomById(id: number)
    {
        await this._db.query(`
            delete from rooms where id = ${id}
        `);
    }

    async getAllRooms()
    {
        //console.log('reading balls');
        const response = await this._db.query(`
            select * from rooms
        `);
        return response.rows;
    }

    async getRoomById(id: number)
    {
        const response = await this._db.query(`
            select * from rooms where id = ${id}
        `);
        return response.rows;
    }

    async setUser1BoardPosition(room_id: number, position: number)
    {
        await this._db.query(`
            update rooms set pos1 = ${position} where id = ${room_id}
        `);
    }

    async setUser2BoardPosition(room_id: number, position: number)
    {
        await this._db.query(`
            update rooms set pos2 = ${position} where id = ${room_id}
        `);
    }

    async setRoomState(room_id: number,
                       ballx: number,
                       bally: number,
                       speedx: number,
                       speedy: number,
                       score1: number,
                       score2: number)
    {
        await this._db.query(`
            update rooms set
                ballx = ${ballx},
                bally = ${bally},
                speedx = ${speedx},
                speedy = ${speedy},
                score1 = ${score1},
                score2 = ${score2}
            where id = ${room_id}
        `);
    }
}

