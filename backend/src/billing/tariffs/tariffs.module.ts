import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TariffsService } from './tariffs.service';
import { TariffsController } from './tariffs.controller';
import { Tariff, TariffSchema } from './entities/tariff.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tariff.name, schema: TariffSchema }]),
  ],
  controllers: [TariffsController],
  providers: [TariffsService],
})
export class TariffsModule { }
