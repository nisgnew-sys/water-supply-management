import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PipelinesService } from './pipelines.service';
import { PipelinesController } from './pipelines.controller';
import { Pipeline, PipelineSchema } from './entities/pipeline.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pipeline.name, schema: PipelineSchema }]),
  ],
  controllers: [PipelinesController],
  providers: [PipelinesService],
})
export class PipelinesModule { }
