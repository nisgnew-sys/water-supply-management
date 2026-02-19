import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SourcesModule } from './production/sources/sources.module';
import { TreatmentPlantsModule } from './production/treatment-plants/treatment-plants.module';
import { ReservoirsModule } from './distribution/reservoirs/reservoirs.module';
import { PipelinesModule } from './distribution/pipelines/pipelines.module';
import { ValvesModule } from './distribution/valves/valves.module';
import { ConsumersModule } from './consumers/consumers.module';
import { AssetsModule } from './assets/assets.module';
import { TariffsModule } from './billing/tariffs/tariffs.module';
import { BillsModule } from './billing/bills/bills.module';
import { PaymentsModule } from './billing/payments/payments.module';
import { AnalyticsModule } from './analytics/analytics.module';

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
    UsersModule,
    AuthModule,
    SourcesModule,
    TreatmentPlantsModule,
    ReservoirsModule,
    PipelinesModule,
    ValvesModule,
    ConsumersModule,
    AssetsModule,
    TariffsModule,
    BillsModule,
    PaymentsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
