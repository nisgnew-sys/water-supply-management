import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { Tariff, TariffDocument } from './entities/tariff.entity';

@Injectable()
export class TariffsService {
  constructor(@InjectModel(Tariff.name) private tariffModel: Model<TariffDocument>) { }

  create(createTariffDto: CreateTariffDto) {
    // Ideally check if a tariff for this category and date already exists
    return new this.tariffModel(createTariffDto).save();
  }

  findAll() {
    return this.tariffModel.find().sort({ effectiveDate: -1 }).exec();
  }

  findOne(id: string) {
    return this.tariffModel.findById(id).exec();
  }

  getActiveTariff(category: string) {
    return this.tariffModel.findOne({ category, isActive: true }).sort({ effectiveDate: -1 }).exec();
  }

  update(id: string, updateTariffDto: UpdateTariffDto) {
    return this.tariffModel.findByIdAndUpdate(id, updateTariffDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.tariffModel.findByIdAndDelete(id).exec();
  }
}
