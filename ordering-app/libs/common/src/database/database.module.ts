import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        return {
          uri: uri,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
