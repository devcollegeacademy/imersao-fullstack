import { Test, TestingModule } from '@nestjs/testing';
import {
  CanActivate,
  ExecutionContext,
  INestApplication,
  Injectable,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../src/modules/customer/customer.entity';
import { VerifyGoogleGuard } from '../src/guard/verify-google/verify-google.guard';

@Injectable()
export class MockVerifyGoogleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request.email = 'atendimento@devcollegeacademy.com';
    return true;
  }
}

describe('CustomerController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Customer],
          synchronize: true,
        }),
        AppModule,
      ],
    })
      .overrideGuard(VerifyGoogleGuard)
      .useClass(MockVerifyGoogleGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/customer (POST) - Create', async () => {
    const customerData = {
      title: 'Dev College Academy',
      zipCode: '62040744',
      number: '54',
      address:
        'R. José Lopes Silva - Coração de Jesus, Sobral - CE, 62040-744, Brazil',
      email: 'atendimento@devcollegeacademy.com',
      active: true,
    } as Customer;

    const response = await request(app.getHttpServer())
      .post('/customer')
      .send(customerData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email', customerData.email);
  });

  it('/customer (GET) - Read One', async () => {
    const customerData = {
      title: 'Dev College Academy',
      zipCode: '62040744',
      number: '54',
      address:
        'R. José Lopes Silva - Coração de Jesus, Sobral - CE, 62040-744, Brazil',
      email: 'atendimento@devcollegeacademy.com',
      active: true,
    } as Customer;

    await request(app.getHttpServer())
      .post('/customer')
      .send(customerData)
      .expect(201);

    const response = await request(app.getHttpServer())
      .get('/customer')
      .expect(200);

    expect(response.body).toHaveProperty('email', customerData.email);
  });

  it('/customer/filter/:title (GET) - Read All By Filter', async () => {
    const title = 'Dev College Academy';

    await request(app.getHttpServer())
      .post('/customer')
      .send({
        title: title,
        zipCode: '62040744',
        number: '54',
        address:
          'R. José Lopes Silva - Coração de Jesus, Sobral - CE, 62040-744, Brazil',
        email: 'atendimento@devcollegeacademy.com',
        active: true,
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .get(`/customer/filter/${title}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('title', title);
  });

  it('/customer (PUT) - Update', async () => {
    const customerData = {
      title: 'Dev College Academy',
      zipCode: '62040744',
      number: '54',
      address:
        'R. José Lopes Silva - Coração de Jesus, Sobral - CE, 62040-744, Brazil',
      email: 'atendimento@devcollegeacademy.com',
      active: true,
    } as Customer;

    await request(app.getHttpServer())
      .post('/customer')
      .send(customerData)
      .expect(201);

    const updatedCustomerData = { ...customerData, title: 'New Title' };
    const response = await request(app.getHttpServer())
      .put('/customer')
      .send(updatedCustomerData)
      .expect(200);

    expect(response.body).toHaveProperty('title', 'New Title');
  });

  it('/customer (DELETE) - Delete', async () => {
    const customerData = {
      title: 'Dev College Academy',
      zipCode: '62040744',
      number: '54',
      address:
        'R. José Lopes Silva - Coração de Jesus, Sobral - CE, 62040-744, Brazil',
      email: 'atendimento@devcollegeacademy.com',
      active: true,
    } as Customer;

    await request(app.getHttpServer())
      .post('/customer')
      .send(customerData)
      .expect(201);

    await request(app.getHttpServer()).delete('/customer').expect(200);
  });
});
