import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Consumer, ConsumerSchema } from '../consumers/entities/consumer.entity';
import { Bill, BillSchema } from '../billing/bills/entities/bill.entity';
import { Maintenance, MaintenanceSchema } from '../assets/maintenance/entities/maintenance.entity';
import { Source, SourceSchema } from '../production/sources/entities/source.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Consumer.name, schema: ConsumerSchema },
      { name: Bill.name, schema: BillSchema },
      { name: Maintenance.name, schema: MaintenanceSchema },
      { name: Source.name, schema: SourceSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule { }
