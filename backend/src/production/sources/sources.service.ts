import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { Source, SourceDocument } from './entities/source.entity';

@Injectable()
export class SourcesService {
  constructor(@InjectModel(Source.name) private sourceModel: Model<SourceDocument>) { }

  create(createSourceDto: CreateSourceDto) {
    const createdSource = new this.sourceModel(createSourceDto);
    return createdSource.save();
  }

  findAll() {
    return this.sourceModel.find().exec();
  }

  findOne(id: string) {
    return this.sourceModel.findById(id).exec();
  }

  update(id: string, updateSourceDto: UpdateSourceDto) {
    return this.sourceModel.findByIdAndUpdate(id, updateSourceDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.sourceModel.findByIdAndDelete(id).exec();
  }
}
