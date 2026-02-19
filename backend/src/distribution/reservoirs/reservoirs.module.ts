import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservoirsService } from './reservoirs.service';
import { ReservoirsController } from './reservoirs.controller';
import { Reservoir, ReservoirSchema } from './entities/reservoir.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reservoir.name, schema: ReservoirSchema }]),
  ],
  controllers: [ReservoirsController],
  providers: [ReservoirsService],
})
export class ReservoirsModule { }
