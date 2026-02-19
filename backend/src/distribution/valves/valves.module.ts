import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ValvesService } from './valves.service';
import { ValvesController } from './valves.controller';
import { Valve, ValveSchema } from './entities/valve.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Valve.name, schema: ValveSchema }]),
  ],
  controllers: [ValvesController],
  providers: [ValvesService],
})
export class ValvesModule { }
