import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {

    addUser(name: string, pass_hash: string) {
        console.log('added user:', name);
    }

}
