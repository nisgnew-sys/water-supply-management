import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTreatmentPlantDto } from './dto/create-treatment-plant.dto';
import { UpdateTreatmentPlantDto } from './dto/update-treatment-plant.dto';
import { TreatmentPlant, TreatmentPlantDocument } from './entities/treatment-plant.entity';

@Injectable()
export class TreatmentPlantsService {
  constructor(@InjectModel(TreatmentPlant.name) private plantModel: Model<TreatmentPlantDocument>) { }

  create(createTreatmentPlantDto: CreateTreatmentPlantDto) {
    const createdPlant = new this.plantModel(createTreatmentPlantDto);
    return createdPlant.save();
  }

  findAll() {
    return this.plantModel.find().populate('sourceId', 'name').exec();
  }

  findOne(id: string) {
    return this.plantModel.findById(id).populate('sourceId').exec();
  }

  update(id: string, updateTreatmentPlantDto: UpdateTreatmentPlantDto) {
    return this.plantModel.findByIdAndUpdate(id, updateTreatmentPlantDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.plantModel.findByIdAndDelete(id).exec();
  }
}
