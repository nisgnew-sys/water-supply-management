import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { Connection, ConnectionDocument } from './entities/connection.entity';

@Injectable()
export class ConnectionsService {
  constructor(@InjectModel(Connection.name) private connectionModel: Model<ConnectionDocument>) { }

  create(createConnectionDto: CreateConnectionDto) {
    const createdConnection = new this.connectionModel({
      ...createConnectionDto,
      consumerRef: createConnectionDto.consumerId
    });
    return createdConnection.save();
  }

  findAll() {
    return this.connectionModel.find().populate('consumerRef').exec();
  }

  findOne(id: string) {
    return this.connectionModel.findById(id).populate('consumerRef').exec();
  }

  update(id: string, updateConnectionDto: UpdateConnectionDto) {
    return this.connectionModel.findByIdAndUpdate(id, updateConnectionDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.connectionModel.findByIdAndDelete(id).exec();
  }
}
