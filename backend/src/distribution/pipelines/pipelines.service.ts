import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';
import { Pipeline, PipelineDocument } from './entities/pipeline.entity';

@Injectable()
export class PipelinesService {
  constructor(@InjectModel(Pipeline.name) private pipelineModel: Model<PipelineDocument>) { }

  create(createPipelineDto: CreatePipelineDto) {
    const createdPipeline = new this.pipelineModel(createPipelineDto);
    return createdPipeline.save();
  }

  findAll() {
    return this.pipelineModel.find().exec();
  }

  findOne(id: string) {
    return this.pipelineModel.findById(id).exec();
  }

  update(id: string, updatePipelineDto: UpdatePipelineDto) {
    return this.pipelineModel.findByIdAndUpdate(id, updatePipelineDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.pipelineModel.findByIdAndDelete(id).exec();
  }
}
