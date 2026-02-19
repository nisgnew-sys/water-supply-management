import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/entities/user.entity';
import { Source, SourceDocument } from '../production/sources/entities/source.entity';
import { TreatmentPlant, TreatmentPlantDocument } from '../production/treatment-plants/entities/treatment-plant.entity';
import { Reservoir, ReservoirDocument } from '../distribution/reservoirs/entities/reservoir.entity';
import { Pipeline, PipelineDocument } from '../distribution/pipelines/entities/pipeline.entity';
import { Valve, ValveDocument } from '../distribution/valves/entities/valve.entity';
import { Consumer, ConsumerDocument } from '../consumers/entities/consumer.entity';
import { Asset, AssetDocument } from '../assets/entities/asset.entity';
import { Tariff, TariffDocument } from '../billing/tariffs/entities/tariff.entity';

@Injectable()
export class SeederService {
    private readonly logger = new Logger(SeederService.name);

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Source.name) private sourceModel: Model<SourceDocument>,
        @InjectModel(TreatmentPlant.name) private wtpModel: Model<TreatmentPlantDocument>,
        @InjectModel(Reservoir.name) private reservoirModel: Model<ReservoirDocument>,
        @InjectModel(Pipeline.name) private pipelineModel: Model<PipelineDocument>,
        @InjectModel(Valve.name) private valveModel: Model<ValveDocument>,
        @InjectModel(Consumer.name) private consumerModel: Model<ConsumerDocument>,
        @InjectModel(Asset.name) private assetModel: Model<AssetDocument>,
        @InjectModel(Tariff.name) private tariffModel: Model<TariffDocument>,
    ) { }

    async seed() {
        await this.seedUsers();
        const sourceIds = await this.seedSources();
        const wtpIds = await this.seedWTPs(sourceIds);
        await this.seedReservoirs();
        const pipelineIds = await this.seedPipelines();
        await this.seedValves(pipelineIds);
        await this.seedConsumers();
        await this.seedAssets(wtpIds);
        await this.seedTariffs();
        this.logger.log('=== All seeding complete! ===');
    }

    /* ──────────────── USERS ──────────────── */
    private async seedUsers() {
        const adminEmail = 'admin@example.com';
        const existingAdmin = await this.userModel.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await this.userModel.create({
                name: 'System Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN',
                isActive: true,
            });
            this.logger.log('✓ Admin user created');
        } else {
            this.logger.log('– Admin user already exists');
        }
    }

    /* ──────────────── WATER SOURCES ──────────────── */
    private async seedSources(): Promise<string[]> {
        if (await this.sourceModel.countDocuments() > 0) {
            this.logger.log('– Sources already exist, skipping');
            const existing = await this.sourceModel.find().select('_id').lean();
            return existing.map((s: any) => s._id.toString());
        }

        const data = [
            { name: 'Brahmaputra River Intake – Pandu', type: 'RIVER_INTAKE', location: { type: 'Point', coordinates: [91.7195, 26.1700] }, maxCapacityMld: 130, isActive: true },
            { name: 'Deepor Beel Lake Intake', type: 'LAKE', location: { type: 'Point', coordinates: [91.6550, 26.1267] }, maxCapacityMld: 25, isActive: true },
            { name: 'Manas River Intake – Barpeta', type: 'RIVER_INTAKE', location: { type: 'Point', coordinates: [91.0000, 26.5000] }, maxCapacityMld: 40, isActive: true },
            { name: 'Dispur Borewell Cluster (12 wells)', type: 'BOREWELL', location: { type: 'Point', coordinates: [91.7898, 26.1445] }, maxCapacityMld: 8, isActive: true },
            { name: 'Silsako Spring – Sonitpur', type: 'SPRING', location: { type: 'Point', coordinates: [92.8000, 26.6300] }, maxCapacityMld: 3.5, isActive: false },
            { name: 'Dighalipukhuri Lake Intake – Jorhat', type: 'LAKE', location: { type: 'Point', coordinates: [94.2167, 26.7509] }, maxCapacityMld: 12, isActive: true },
        ];
        const docs = await this.sourceModel.insertMany(data);
        this.logger.log(`✓ ${docs.length} water sources seeded`);
        return docs.map((d: any) => d._id.toString());
    }

    /* ──────────────── TREATMENT PLANTS (WTPs) ──────────────── */
    private async seedWTPs(sourceIds: string[]): Promise<string[]> {
        if (await this.wtpModel.countDocuments() > 0) {
            this.logger.log('– WTPs already exist, skipping');
            const existing = await this.wtpModel.find().select('_id').lean();
            return existing.map((p: any) => p._id.toString());
        }

        const data = [
            { name: 'Pandu WTP (Conventional)', location: { type: 'Point', coordinates: [91.7180, 26.1690] }, maxCapacityMld: 130, sourceId: sourceIds[0], status: 'OPERATIONAL' },
            { name: 'Deepor Beel WTP', location: { type: 'Point', coordinates: [91.6560, 26.1280] }, maxCapacityMld: 22, sourceId: sourceIds[1], status: 'OPERATIONAL' },
            { name: 'Barpeta WTP', location: { type: 'Point', coordinates: [91.0050, 26.5020] }, maxCapacityMld: 35, sourceId: sourceIds[2], status: 'OPERATIONAL' },
            { name: 'Dispur Borewell Package Plant', location: { type: 'Point', coordinates: [91.7900, 26.1440] }, maxCapacityMld: 7.5, sourceId: sourceIds[3], status: 'MAINTENANCE' },
            { name: 'Jorhat WTP', location: { type: 'Point', coordinates: [94.2180, 26.7500] }, maxCapacityMld: 10, sourceId: sourceIds.length > 5 ? sourceIds[5] : sourceIds[0], status: 'OPERATIONAL' },
        ];
        const docs = await this.wtpModel.insertMany(data);
        this.logger.log(`✓ ${docs.length} treatment plants seeded`);
        return docs.map((d: any) => d._id.toString());
    }

    /* ──────────────── RESERVOIRS (Storage Tanks) ──────────────── */
    private async seedReservoirs() {
        if (await this.reservoirModel.countDocuments() > 0) {
            this.logger.log('– Reservoirs already exist, skipping');
            return;
        }
        const data = [
            { name: 'Pandu CWR (Clear Water Reservoir)', type: 'CWR', location: { type: 'Point', coordinates: [91.7190, 26.1695] }, capacityLiters: 18000000, zoneId: 'ZONE-A-PANDU', status: 'OPERATIONAL' },
            { name: 'Dispur OHT', type: 'OHT', location: { type: 'Point', coordinates: [91.7900, 26.1445] }, capacityLiters: 5000000, zoneId: 'ZONE-B-DISPUR', status: 'OPERATIONAL' },
            { name: 'Chandmari GSR', type: 'GSR', location: { type: 'Point', coordinates: [91.7650, 26.1820] }, capacityLiters: 10000000, zoneId: 'ZONE-C-CHANDMARI', status: 'OPERATIONAL' },
            { name: 'Kamakhya ESR', type: 'ESR', location: { type: 'Point', coordinates: [91.7050, 26.1650] }, capacityLiters: 3500000, zoneId: 'ZONE-A-PANDU', status: 'MAINTENANCE' },
            { name: 'Barpeta OHT', type: 'OHT', location: { type: 'Point', coordinates: [91.0050, 26.5020] }, capacityLiters: 7200000, zoneId: 'ZONE-D-BARPETA', status: 'OPERATIONAL' },
            { name: 'Jorhat GSR', type: 'GSR', location: { type: 'Point', coordinates: [94.2170, 26.7500] }, capacityLiters: 4000000, zoneId: 'ZONE-E-JORHAT', status: 'OPERATIONAL' },
            { name: 'Deepor Beel CWR', type: 'CWR', location: { type: 'Point', coordinates: [91.6555, 26.1270] }, capacityLiters: 8000000, zoneId: 'ZONE-F-DEEPORBEEL', status: 'OPERATIONAL' },
        ];
        const docs = await this.reservoirModel.insertMany(data);
        this.logger.log(`✓ ${docs.length} reservoirs seeded`);
    }

    /* ──────────────── PIPELINES ──────────────── */
    private async seedPipelines(): Promise<string[]> {
        if (await this.pipelineModel.countDocuments() > 0) {
            this.logger.log('– Pipelines already exist, skipping');
            const existing = await this.pipelineModel.find().select('_id').lean();
            return existing.map((p: any) => p._id.toString());
        }

        const data = [
            { name: 'Pandu – Dispur Trunk Main', material: 'DI', diameterMm: 600, location: { type: 'LineString', coordinates: [[91.7180, 26.1690], [91.7900, 26.1445]] }, zoneId: 'ZONE-A-PANDU', status: 'OPERATIONAL' },
            { name: 'Dispur – Chandmari Distribution', material: 'HDPE', diameterMm: 300, location: { type: 'LineString', coordinates: [[91.7900, 26.1445], [91.7650, 26.1820]] }, zoneId: 'ZONE-B-DISPUR', status: 'OPERATIONAL' },
            { name: 'Chandmari – Panbazar Feeder', material: 'PVC', diameterMm: 200, location: { type: 'LineString', coordinates: [[91.7650, 26.1820], [91.7480, 26.1880]] }, zoneId: 'ZONE-C-CHANDMARI', status: 'OPERATIONAL' },
            { name: 'Pandu – Kamakhya Rising Main', material: 'STEEL', diameterMm: 450, location: { type: 'LineString', coordinates: [[91.7180, 26.1690], [91.7050, 26.1650]] }, zoneId: 'ZONE-A-PANDU', status: 'MAINTENANCE' },
            { name: 'Barpeta WTP – Town Distribution', material: 'DI', diameterMm: 350, location: { type: 'LineString', coordinates: [[91.0050, 26.5020], [91.0100, 26.5050]] }, zoneId: 'ZONE-D-BARPETA', status: 'OPERATIONAL' },
            { name: 'Deepor Beel – Six Mile Feeder', material: 'HDPE', diameterMm: 250, location: { type: 'LineString', coordinates: [[91.6560, 26.1280], [91.7100, 26.1500]] }, zoneId: 'ZONE-F-DEEPORBEEL', status: 'OPERATIONAL' },
            { name: 'Jorhat Town Distribution Main', material: 'PVC', diameterMm: 200, location: { type: 'LineString', coordinates: [[94.2180, 26.7500], [94.2200, 26.7520]] }, zoneId: 'ZONE-E-JORHAT', status: 'OPERATIONAL' },
            { name: 'Zoo Road Sub-Main', material: 'HDPE', diameterMm: 150, location: { type: 'LineString', coordinates: [[91.7650, 26.1820], [91.7700, 26.1750]] }, zoneId: 'ZONE-C-CHANDMARI', status: 'LEAKAGE' },
        ];
        const docs = await this.pipelineModel.insertMany(data);
        this.logger.log(`✓ ${docs.length} pipelines seeded`);
        return docs.map((d: any) => d._id.toString());
    }

    /* ──────────────── VALVES ──────────────── */
    private async seedValves(pipelineIds: string[]) {
        if (await this.valveModel.countDocuments() > 0) {
            this.logger.log('– Valves already exist, skipping');
            return;
        }

        const data = [
            { name: 'Pandu Trunk Main Sluice SV-001', type: 'SLUICE', location: { type: 'Point', coordinates: [91.7300, 26.1600] }, pipelineId: pipelineIds[0], status: 'OPEN' },
            { name: 'Dispur Junction Air Valve AV-002', type: 'AIR', location: { type: 'Point', coordinates: [91.7850, 26.1450] }, pipelineId: pipelineIds[1], status: 'OPEN' },
            { name: 'Chandmari NRV NR-003', type: 'NON_RETURN', location: { type: 'Point', coordinates: [91.7650, 26.1810] }, pipelineId: pipelineIds[2], status: 'OPEN' },
            { name: 'Kamakhya Scour Valve SC-004', type: 'SCOUR', location: { type: 'Point', coordinates: [91.7060, 26.1645] }, pipelineId: pipelineIds[3], status: 'CLOSED' },
            { name: 'Barpeta Main Sluice SV-005', type: 'SLUICE', location: { type: 'Point', coordinates: [91.0080, 26.5035] }, pipelineId: pipelineIds[4], status: 'OPEN' },
            { name: 'Deepor Beel Flow Meter FM-006', type: 'FLOW_METER', location: { type: 'Point', coordinates: [91.6800, 26.1400] }, pipelineId: pipelineIds[5], status: 'OPEN' },
            { name: 'Zoo Road Air Valve AV-007', type: 'AIR', location: { type: 'Point', coordinates: [91.7680, 26.1780] }, pipelineId: pipelineIds[7], status: 'PARTIAL' },
            { name: 'Jorhat NRV NR-008', type: 'NON_RETURN', location: { type: 'Point', coordinates: [94.2190, 26.7510] }, pipelineId: pipelineIds[6], status: 'OPEN' },
            { name: 'Pandu CWR Outlet SV-009', type: 'SLUICE', location: { type: 'Point', coordinates: [91.7195, 26.1695] }, pipelineId: pipelineIds[0], status: 'OPEN' },
            { name: 'Dispur–Chandmari PRV FM-010', type: 'FLOW_METER', location: { type: 'Point', coordinates: [91.7780, 26.1630] }, pipelineId: pipelineIds[1], status: 'FAULTY' },
        ];
        const docs = await this.valveModel.insertMany(data);
        this.logger.log(`✓ ${docs.length} valves seeded`);
    }

    /* ──────────────── CONSUMERS ──────────────── */
    private async seedConsumers() {
        if (await this.consumerModel.countDocuments() > 0) {
            this.logger.log('– Consumers already exist, skipping');
            return;
        }

        const data = [
            { name: 'Rajesh Kumar Sharma', email: 'rajesh.sharma@mail.com', phone: '9876543210', address: 'H.No. 12, Pandu Ward 1, Guwahati', location: { type: 'Point', coordinates: [91.7195, 26.1700] }, category: 'RESIDENTIAL', isActive: true },
            { name: 'Ananya Borah', email: 'ananya.borah@mail.com', phone: '9876543211', address: 'Flat 4B, Dispur Apartments, Dispur', location: { type: 'Point', coordinates: [91.7898, 26.1445] }, category: 'RESIDENTIAL', isActive: true },
            { name: 'Hotel Paradise', email: 'hotel.paradise@mail.com', phone: '9876543212', address: 'GS Road, Chandmari, Guwahati', location: { type: 'Point', coordinates: [91.7650, 26.1820] }, category: 'COMMERCIAL', isActive: true },
            { name: 'Assam Textiles Ltd.', email: 'assam.textiles@mail.com', phone: '9876543213', address: 'Industrial Area, Barpeta Road', location: { type: 'Point', coordinates: [91.0050, 26.5020] }, category: 'INDUSTRIAL', isActive: true },
            { name: 'GMC Primary School', email: 'gmc.school@mail.com', phone: '9876543214', address: 'Panbazar, Guwahati-01', location: { type: 'Point', coordinates: [91.7480, 26.1880] }, category: 'INSTITUTIONAL', isActive: true },
            { name: 'Sanjay Deka', email: 'sanjay.deka@mail.com', phone: '9876543215', address: 'H.No. 45, Zoo Road, Guwahati', location: { type: 'Point', coordinates: [91.7700, 26.1750] }, category: 'RESIDENTIAL', isActive: true },
            { name: 'Priya Kalita', email: 'priya.kalita@mail.com', phone: '9876543216', address: 'Jorhat Town, Ward 5', location: { type: 'Point', coordinates: [94.2190, 26.7510] }, category: 'RESIDENTIAL', isActive: true },
            { name: 'City Mall Guwahati', email: 'citymall.ghy@mail.com', phone: '9876543217', address: 'Christian Basti, GS Road, Guwahati', location: { type: 'Point', coordinates: [91.7780, 26.1620] }, category: 'COMMERCIAL', isActive: true },
            { name: 'GMCH Hospital', email: 'gmch.ghy@mail.com', phone: '9876543218', address: 'Bhangagarh, Guwahati', location: { type: 'Point', coordinates: [91.7770, 26.1500] }, category: 'INSTITUTIONAL', isActive: true },
            { name: 'Dipak Baruah', email: 'dipak.baruah@mail.com', phone: '9876543219', address: 'Kamakhya Gate, Guwahati', location: { type: 'Point', coordinates: [91.7050, 26.1650] }, category: 'RESIDENTIAL', isActive: false },
            { name: 'Barpeta Rice Mills', email: 'barpeta.ricemills@mail.com', phone: '9876543220', address: 'Barpeta Industrial Area', location: { type: 'Point', coordinates: [91.0100, 26.5050] }, category: 'INDUSTRIAL', isActive: true },
            { name: 'Meera Hazarika', email: 'meera.hazarika@mail.com', phone: '9876543221', address: 'Six Mile, Guwahati', location: { type: 'Point', coordinates: [91.7100, 26.1500] }, category: 'RESIDENTIAL', isActive: true },
        ];
        const docs = await this.consumerModel.insertMany(data);
        this.logger.log(`✓ ${docs.length} consumers seeded`);
    }

    /* ──────────────── ASSETS ──────────────── */
    private async seedAssets(wtpIds: string[]) {
        if (await this.assetModel.countDocuments() > 0) {
            this.logger.log('– Assets already exist, skipping');
            return;
        }

        const data = [
            { name: 'Centrifugal Pump #1', type: 'PUMP', model: 'KSB Mega 80-250', serialNumber: 'KSB-2024-45021', installationDate: new Date('2023-06-15'), facilityType: 'WTP', facilityId: wtpIds[0], status: 'OPERATIONAL' },
            { name: 'Chlorination Unit CU-01', type: 'PUMP', model: 'Wallace & Tiernan V-10K', serialNumber: 'EVQ-2024-8801', installationDate: new Date('2023-08-10'), facilityType: 'WTP', facilityId: wtpIds[0], status: 'OPERATIONAL' },
            { name: 'Flow Meter FM-03', type: 'SENSOR', model: 'Endress+Hauser Promag W', serialNumber: 'EH-2024-FM03', installationDate: new Date('2024-01-20'), facilityType: 'DISTRIBUTION', facilityId: 'ZONE-B-DISPUR', status: 'UNDER_MAINTENANCE' },
            { name: 'Butterfly Valve V-12', type: 'VALVE', model: 'Kirloskar BV-300', serialNumber: 'KBL-2023-V12', installationDate: new Date('2022-11-05'), facilityType: 'DISTRIBUTION', facilityId: 'ZONE-C-CHANDMARI', status: 'OPERATIONAL' },
            { name: 'Diesel Generator DG-2', type: 'GENERATOR', model: 'Cummins C500D5', serialNumber: 'CUM-2024-DG02', installationDate: new Date('2024-03-01'), facilityType: 'WTP', facilityId: wtpIds[0], status: 'OPERATIONAL' },
            { name: 'Pressure Sensor PS-08', type: 'SENSOR', model: 'WIKA S-20', serialNumber: 'WK-2024-PS08', installationDate: new Date('2024-06-15'), facilityType: 'WTP', facilityId: wtpIds.length > 2 ? wtpIds[2] : wtpIds[0], status: 'SCRAPPED' },
            { name: 'Submersible Pump SP-04', type: 'PUMP', model: 'Grundfos SP 30-8', serialNumber: 'GRF-2024-SP04', installationDate: new Date('2024-02-10'), facilityType: 'SOURCE', facilityId: 'DISPUR-BW', status: 'OPERATIONAL' },
            { name: 'SCADA RTU Unit', type: 'SENSOR', model: 'Schneider Easergy T300', serialNumber: 'SCH-2024-RTU01', installationDate: new Date('2024-05-01'), facilityType: 'WTP', facilityId: wtpIds[0], status: 'OPERATIONAL' },
        ];
        const docs = await this.assetModel.insertMany(data);
        this.logger.log(`✓ ${docs.length} assets seeded`);
    }

    /* ──────────────── TARIFFS ──────────────── */
    private async seedTariffs() {
        if (await this.tariffModel.countDocuments() > 0) {
            this.logger.log('– Tariffs already exist, skipping');
            return;
        }
        const data = [
            {
                category: 'DOMESTIC',
                effectiveDate: new Date(),
                isActive: true,
                slabs: [
                    { minLiters: 0, maxLiters: 15000, ratePerKL: 5 },
                    { minLiters: 15001, maxLiters: 30000, ratePerKL: 10 },
                    { minLiters: 30001, maxLiters: 999999, ratePerKL: 20 }
                ]
            },
            {
                category: 'COMMERCIAL',
                effectiveDate: new Date(),
                isActive: true,
                slabs: [
                    { minLiters: 0, maxLiters: 999999, ratePerKL: 50 }
                ]
            },
            {
                category: 'INDUSTRIAL',
                effectiveDate: new Date(),
                isActive: true,
                slabs: [
                    { minLiters: 0, maxLiters: 50000, ratePerKL: 35 },
                    { minLiters: 50001, maxLiters: 999999, ratePerKL: 60 }
                ]
            },
            {
                category: 'INSTITUTIONAL',
                effectiveDate: new Date(),
                isActive: true,
                slabs: [
                    { minLiters: 0, maxLiters: 999999, ratePerKL: 15 }
                ]
            }
        ];
        await this.tariffModel.insertMany(data);
        this.logger.log('✓ Tariffs seeded');
    }
}
