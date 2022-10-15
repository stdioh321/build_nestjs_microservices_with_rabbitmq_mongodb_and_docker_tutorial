import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FilterQuery } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { BILLING_SERVICE } from './constants/services';
import { CreateOrderRequest } from './dto/create-order.request';
import { OrdersRepository } from './orders.repository';
import { Order } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}

  async createOrder(data: CreateOrderRequest): Promise<any> {
    // return await this.ordersRepository.create(data);
    try {
      const order = await this.ordersRepository.create(data);

      const prom = await lastValueFrom(
        this.billingClient.emit('order_created', data),
      );
      this.logger.log('PROM: ', prom);
      return order;
    } catch (error) {
      this.logger.error('TUDO ERRADO ', error);
    }
  }
  async getOrders(filterQuery: FilterQuery<Order> = {}): Promise<Order[]> {
    return await this.ordersRepository.find(filterQuery);
  }
}
