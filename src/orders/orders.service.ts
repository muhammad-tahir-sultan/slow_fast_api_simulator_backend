import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MongoRepository } from 'typeorm'; // Import MongoRepository
import { Order } from './entities/order.entity';
import { faker } from '@faker-js/faker';

@Injectable()
export class OrdersService {
    // Optimizations State
    private useIndexing = true; // Default to fast

    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
    ) { }

    // Toggle Indexing (Simulating Slow/Fast DB)
    async setIndexing(enabled: boolean) {
        this.useIndexing = enabled;
        const mongoRepo = this.ordersRepository as MongoRepository<Order>;

        try {
            if (enabled) {
                // Create Index
                await mongoRepo.createCollectionIndex({ userId: 1 });
                console.log('✅ Index CREATED on userId');
            } else {
                // Drop Index
                // Note: The index name usually generated is userId_1, 
                // but we should wrap in try-catch in case it doesn't exist.
                if (await mongoRepo.collectionIndexExists("userId_1")) {
                    await mongoRepo.dropCollectionIndex("userId_1");
                    console.log('❌ Index DROPPED on userId');
                }
            }
        } catch (e) {
            console.error('Indexing toggle error (ignore if index missing):', e.message);
        }
        return this.useIndexing;
    }

    findAll() {
        return this.ordersRepository.find();
    }

    // Updated to handle userId as string (MongoDB ObjectId string)
    findAllByUserId(userId: string) {
        return this.ordersRepository.find({ where: { userId } });
    }

    async findOrdersByUserIds(userIds: string[]) {
        return this.ordersRepository.find({
            where: {
                userId: { $in: userIds } as any
            }
        });
    }

    async seed(userIds: any[]) { // Expecting ObjectIds
        const orders: Order[] = [];
        for (let i = 0; i < 2000; i++) { // Increased to 2000 for better "Slow" demo
            // Convert ObjectId to string for simple reference storage
            const userId = userIds[Math.floor(Math.random() * userIds.length)].toString();
            const order = this.ordersRepository.create({
                totalAmount: parseFloat(faker.commerce.price()),
                userId: userId
            });
            orders.push(order);
        }
        await this.ordersRepository.save(orders);
        return true;
    }
}
