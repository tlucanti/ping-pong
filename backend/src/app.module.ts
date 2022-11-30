import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { EngineModule } from './modules/engine/engine.module'

@Module({
    imports: [UsersModule, EngineModule],
})
export class AppModule {}

