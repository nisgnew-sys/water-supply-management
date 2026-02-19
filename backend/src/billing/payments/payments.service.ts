import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment, PaymentDocument } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>) { }

  create(createPaymentDto: CreatePaymentDto) {
    // Ideally update bill status on payment creation
    return new this.paymentModel(createPaymentDto).save();
  }

  findAll() {
    return this.paymentModel.find()
      .populate('billId')
      .populate('consumerId')
      .sort({ paymentDate: -1 })
      .exec();
  }

  findOne(id: string) {
    return this.paymentModel.findById(id)
      .populate('billId')
      .populate('consumerId')
      .exec();
  }

  findByConsumer(consumerId: string) {
    return this.paymentModel.find({ consumerId } as any).sort({ paymentDate: -1 }).exec();
  }

  update(id: string, updatePaymentDto: UpdatePaymentDto) {
    return this.paymentModel.findByIdAndUpdate(id, updatePaymentDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.paymentModel.findByIdAndDelete(id).exec();
  }
}
