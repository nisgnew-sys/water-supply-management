import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReservoirDto } from './dto/create-reservoir.dto';
import { UpdateReservoirDto } from './dto/update-reservoir.dto';
import { Reservoir, ReservoirDocument } from './entities/reservoir.entity';

@Injectable()
export class ReservoirsService {
  constructor(@InjectModel(Reservoir.name) private reservoirModel: Model<ReservoirDocument>) { }

  create(createReservoirDto: CreateReservoirDto) {
    const createdReservoir = new this.reservoirModel(createReservoirDto);
    return createdReservoir.save();
  }

  findAll() {
    return this.reservoirModel.find().exec();
  }

  findOne(id: string) {
    return this.reservoirModel.findById(id).exec();
  }

  update(id: string, updateReservoirDto: UpdateReservoirDto) {
    return this.reservoirModel.findByIdAndUpdate(id, updateReservoirDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.reservoirModel.findByIdAndDelete(id).exec();
  }
}
