import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SourcesService } from './sources.service';
import { SourcesController } from './sources.controller';
import { Source, SourceSchema } from './entities/source.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Source.name, schema: SourceSchema }]),
  ],
  controllers: [SourcesController],
  providers: [SourcesService],
})
export class SourcesModule { }
