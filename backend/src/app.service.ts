import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getIndex(): string {
    return 'my-hello';
  }

  getLogin(): string {
      return 'login-page';
  }
}
