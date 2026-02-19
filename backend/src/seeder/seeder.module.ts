import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeederService } from './seeder.service';
import { User, UserSchema } from '../users/entities/user.entity';
import { Source, SourceSchema } from '../production/sources/entities/source.entity';
import { TreatmentPlant, TreatmentPlantSchema } from '../production/treatment-plants/entities/treatment-plant.entity';
import { Reservoir, ReservoirSchema } from '../distribution/reservoirs/entities/reservoir.entity';
import { Pipeline, PipelineSchema } from '../distribution/pipelines/entities/pipeline.entity';
import { Valve, ValveSchema } from '../distribution/valves/entities/valve.entity';
import { Consumer, ConsumerSchema } from '../consumers/entities/consumer.entity';
import { Asset, AssetSchema } from '../assets/entities/asset.entity';
import { Tariff, TariffSchema } from '../billing/tariffs/entities/tariff.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Source.name, schema: SourceSchema },
            { name: TreatmentPlant.name, schema: TreatmentPlantSchema },
            { name: Reservoir.name, schema: ReservoirSchema },
            { name: Pipeline.name, schema: PipelineSchema },
            { name: Valve.name, schema: ValveSchema },
            { name: Consumer.name, schema: ConsumerSchema },
            { name: Asset.name, schema: AssetSchema },
            { name: Tariff.name, schema: TariffSchema },
        ]),
    ],
    providers: [SeederService],
    exports: [SeederService],
})
export class SeederModule { }
