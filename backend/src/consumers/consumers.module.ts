import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsumersService } from './consumers.service';
import { ConsumersController } from './consumers.controller';
import { Consumer, ConsumerSchema } from './entities/consumer.entity';
import { ConnectionsModule } from './connections/connections.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Consumer.name, schema: ConsumerSchema }]),
    ConnectionsModule,
  ],
  controllers: [ConsumersController],
  providers: [ConsumersService],
})
export class ConsumersModule { }
