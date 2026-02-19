import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder/seeder.module';
import { SeederService } from './seeder/seeder.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_URI'),
            }),
            inject: [ConfigService],
        }),
        SeederModule,
    ],
})
class SeederAppModule { }

async function bootstrap() {
    const appContext = await NestFactory.createApplicationContext(SeederAppModule);
    const seeder = appContext.get(SeederService);
    try {
        await seeder.seed();
        console.log('Seeding complete!');
    } catch (error) {
        console.error('Seeding failed', error);
    } finally {
        await appContext.close();
    }
}
bootstrap();
