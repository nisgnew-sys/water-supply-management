import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Consumer, ConsumerDocument } from '../consumers/entities/consumer.entity';
import { Bill, BillDocument } from '../billing/bills/entities/bill.entity';
import { Maintenance, MaintenanceDocument } from '../assets/maintenance/entities/maintenance.entity';
import { Source, SourceDocument } from '../production/sources/entities/source.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Consumer.name) private consumerModel: Model<ConsumerDocument>,
    @InjectModel(Bill.name) private billModel: Model<BillDocument>,
    @InjectModel(Maintenance.name) private maintenanceModel: Model<MaintenanceDocument>,
    @InjectModel(Source.name) private sourceModel: Model<SourceDocument>,
  ) { }

  async getDashboardStats() {
    const totalConsumers = await this.consumerModel.countDocuments();
    const activeConsumers = await this.consumerModel.countDocuments({ status: 'ACTIVE' });

    // Revenue Stats
    const totalRevenue = await this.billModel.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const paidRevenue = await this.billModel.aggregate([
      { $match: { status: 'PAID' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const pendingRevenue = await this.billModel.aggregate([
      { $match: { status: { $in: ['PENDING', 'OVERDUE'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Maintenance Stats
    const pendingMaintenance = await this.maintenanceModel.countDocuments({ status: { $in: ['SCHEDULED', 'IN_PROGRESS'] } });

    // Source Capacity (Just as an example of aggregation)
    const totalCapacity = await this.sourceModel.aggregate([
      { $group: { _id: null, total: { $sum: '$capacityMLD' } } }
    ]);

    return {
      consumers: {
        total: totalConsumers,
        active: activeConsumers
      },
      revenue: {
        totalTarget: totalRevenue[0]?.total || 0,
        collected: paidRevenue[0]?.total || 0,
        pending: pendingRevenue[0]?.total || 0
      },
      maintenance: {
        pendingTasks: pendingMaintenance
      },
      waterSupply: {
        totalCapacityMLD: totalCapacity[0]?.total || 0
      }
    };
  }
}
