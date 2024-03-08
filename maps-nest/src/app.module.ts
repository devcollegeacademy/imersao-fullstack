import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './modules/customer/customer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './modules/customer/customer.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [    
    ConfigModule.forRoot({
      envFilePath: '.env'      
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Customer],
      synchronize: true,
    }),
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
