import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { Maintenance, MaintenanceDocument } from './entities/maintenance.entity';

@Injectable()
export class MaintenanceService {
  constructor(@InjectModel(Maintenance.name) private maintenanceModel: Model<MaintenanceDocument>) { }

  create(createMaintenanceDto: CreateMaintenanceDto) {
    return new this.maintenanceModel(createMaintenanceDto).save();
  }

  findAll() {
    return this.maintenanceModel.find().populate('assetId').exec();
  }

  findOne(id: string) {
    return this.maintenanceModel.findById(id).populate('assetId').exec();
  }

  findByAsset(assetId: string) {
    return this.maintenanceModel.find({ assetId } as any).populate('assetId').exec();
  }

  update(id: string, updateMaintenanceDto: UpdateMaintenanceDto) {
    return this.maintenanceModel.findByIdAndUpdate(id, updateMaintenanceDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.maintenanceModel.findByIdAndDelete(id).exec();
  }
}
