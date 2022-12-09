import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { EngineModule } from './modules/engine/engine.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
    imports: [UsersModule, EngineModule, ChatModule],
})
export class AppModule {}

