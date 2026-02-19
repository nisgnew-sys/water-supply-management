import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateConsumerDto } from './dto/create-consumer.dto';
import { UpdateConsumerDto } from './dto/update-consumer.dto';
import { Consumer, ConsumerDocument } from './entities/consumer.entity';

@Injectable()
export class ConsumersService {
  constructor(@InjectModel(Consumer.name) private consumerModel: Model<ConsumerDocument>) { }

  create(createConsumerDto: CreateConsumerDto) {
    const createdConsumer = new this.consumerModel(createConsumerDto);
    return createdConsumer.save();
  }

  findAll() {
    return this.consumerModel.find().exec();
  }

  findOne(id: string) {
    return this.consumerModel.findById(id).exec();
  }

  update(id: string, updateConsumerDto: UpdateConsumerDto) {
    return this.consumerModel.findByIdAndUpdate(id, updateConsumerDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.consumerModel.findByIdAndDelete(id).exec();
  }
}
