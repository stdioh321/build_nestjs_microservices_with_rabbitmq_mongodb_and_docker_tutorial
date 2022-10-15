import { NestFactory } from '@nestjs/core';
import { RmqService } from '@app/common';
// import { RmqService } from '../../../libs/common/src/rmq/qmq.service';
import { BillingModule } from './billing.module';

async function bootstrap() {
  const app = await NestFactory.create(BillingModule);
  const rmqService = app.get<RmqService>(RmqService);
  const rmqOptions = rmqService.getOptions('BILLING', false);
  app.connectMicroservice(rmqOptions);
  await app.startAllMicroservices();
}
bootstrap();
