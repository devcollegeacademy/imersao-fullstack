import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { CustomerController } from './customer.controller';

describe('CustomerService', () => {
  let service: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Customer]),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Customer],
          synchronize: true,
        }),
      ],
      controllers: [CustomerController],
      providers: [CustomerService],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const createTest = async () => {
    const customerData = {
      title: 'Dev College Academy',
      zipCode: '62040744',
      number: '54',
      address:
        'R. José Lopes Silva - Coração de Jesus, Sobral - CE, 62040-744, Brazil',
      email: 'atendimento@devcollegeacademy.com',
      active: true,
    } as Customer;

    return await service.create(customerData);
  };

  describe('Customer Test', () => {
    it('should create a customer', async () => {
      const result = await createTest();

      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty(
        'email',
        'atendimento@devcollegeacademy.com',
      );
    });
  });

  describe('readOne', () => {
    it('should read a customer by email', async () => {
      await createTest();
      const email = 'atendimento@devcollegeacademy.com';
      const result = await service.readOne(email);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('email', email);
    });
  });

  describe('readAllByFilter', () => {
    it('should read all customers by filter', async () => {
      await createTest();
      const title = 'Dev College';
      const result = await service.readAllByFilter(title);

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      await createTest();

      const email = 'atendimento@devcollegeacademy.com';
      const customerData = {
        title: 'Dev College Academy',
        zipCode: '62040744',
        number: '54',
        address:
          'R. José Lopes Silva - Coração de Jesus, Sobral - CE, 62040-744, Brazil',
        email: 'atendimento@devcollegeacademy.com',
        active: false,
      } as Customer;

      const result = await service.update(email, customerData);

      expect(result).toBeDefined();
      expect(result.active).toEqual(customerData.active);
    });
  });

  describe('delete', () => {
    it('should delete a customer', async () => {
      await createTest();
      const email = 'atendimento@devcollegeacademy.com';
      await expect(service.delete(email)).resolves.not.toThrow();
    });
  });
});
