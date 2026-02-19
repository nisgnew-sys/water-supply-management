import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset, AssetDocument } from './entities/asset.entity';

@Injectable()
export class AssetsService {
  constructor(@InjectModel(Asset.name) private assetModel: Model<AssetDocument>) { }

  create(createAssetDto: CreateAssetDto) {
    const createdAsset = new this.assetModel(createAssetDto);
    return createdAsset.save();
  }

  findAll() {
    return this.assetModel.find().exec();
  }

  findOne(id: string) {
    return this.assetModel.findById(id).exec();
  }

  update(id: string, updateAssetDto: UpdateAssetDto) {
    return this.assetModel.findByIdAndUpdate(id, updateAssetDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.assetModel.findByIdAndDelete(id).exec();
  }

  findByFacility(facilityId: string) {
    return this.assetModel.find({ facilityId }).exec();
  }
}
