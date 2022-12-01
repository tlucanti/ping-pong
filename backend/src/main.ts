import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
const cors=require("cors");

async function bootstrap() {
    const corsOptions = {
        origin:'*',
        credentials:true,            //access-control-allow-credentials:true
        optionSuccessStatus:200,
    };

    const app = await NestFactory.create(AppModule);
    app.use('/', express.static('../frontend'));
    app.use(cors(corsOptions)) // Use this after the variable declaration
    await app.listen(3000);
}

bootstrap();

