import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { Bill, BillDocument } from './entities/bill.entity';

@Injectable()
export class BillsService {
  constructor(@InjectModel(Bill.name) private billModel: Model<BillDocument>) { }

  create(createBillDto: CreateBillDto) {
    return new this.billModel(createBillDto).save();
  }

  findAll() {
    return this.billModel.find()
      .populate('consumerId')
      .populate('connectionId')
      .sort({ billDate: -1 })
      .exec();
  }

  findOne(id: string) {
    return this.billModel.findById(id)
      .populate('consumerId')
      .populate('connectionId')
      .exec();
  }

  findByConsumer(consumerId: string) {
    return this.billModel.find({ consumerId } as any).sort({ billDate: -1 }).exec();
  }

  update(id: string, updateBillDto: UpdateBillDto) {
    return this.billModel.findByIdAndUpdate(id, updateBillDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.billModel.findByIdAndDelete(id).exec();
  }
}
