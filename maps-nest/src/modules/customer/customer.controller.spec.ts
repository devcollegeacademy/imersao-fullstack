import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';

describe('CustomerController', () => {
  let controller: CustomerController;

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

    controller = module.get<CustomerController>(CustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    return await controller.create(customerData);
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
      const result = await controller.readOne({ email });

      expect(result).toBeDefined();
      expect(result).toHaveProperty('email', email);
    });
  });

  describe('readAllByFilter', () => {
    it('should read all customers by filter', async () => {
      await createTest();
      const title = 'Dev College';
      const result = await controller.readAllByFilter(title);

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

      const result = await controller.update({ email }, customerData);

      expect(result).toBeDefined();
      expect(result.active).toEqual(customerData.active);
    });
  });

  describe('delete', () => {
    it('should delete a customer', async () => {
      await createTest();
      const email = 'atendimento@devcollegeacademy.com';
      await expect(controller.delete({ email })).resolves.not.toThrow();
    });
  });

  describe('getAddress', () => {
    it('should get address from zip code', async () => {
      const zipCode = '62040744';
      const result = await controller.getAddress(zipCode);

      expect(result).toBeDefined();
      expect(result).toContain(
        'R. José Lopes Silva - Coração de Jesus, Sobral - CE, 62040-744, Brazil',
      );
    });
  });
});
