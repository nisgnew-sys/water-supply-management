import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateValveDto } from './dto/create-valve.dto';
import { UpdateValveDto } from './dto/update-valve.dto';
import { Valve, ValveDocument } from './entities/valve.entity';

@Injectable()
export class ValvesService {
  constructor(@InjectModel(Valve.name) private valveModel: Model<ValveDocument>) { }

  create(createValveDto: CreateValveDto) {
    const createdValve = new this.valveModel(createValveDto);
    return createdValve.save();
  }

  findAll() {
    return this.valveModel.find().exec();
  }

  findOne(id: string) {
    return this.valveModel.findById(id).exec();
  }

  update(id: string, updateValveDto: UpdateValveDto) {
    return this.valveModel.findByIdAndUpdate(id, updateValveDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.valveModel.findByIdAndDelete(id).exec();
  }
}
