import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(customerData: Partial<Customer>): Promise<Customer> {
    try {
      const newCustomer = this.customerRepository.create(customerData);
      return await this.customerRepository.save(newCustomer);
    } catch (error) {
      throw new BadRequestException('Failed to create customer');
    }
  }

  async readAllByFilter(title: string): Promise<Customer[]> {
    try {
      const query = title ? { where: { title: ILike(`%${title}%`), active: true } } : { where: { active: true} };
      return await this.customerRepository.find(query);
    } catch (error) {
      throw new BadRequestException('Failed to fetch customers');
    }
  }

  async readOne(email: string): Promise<Customer> {
    try {
      const customer = await this.customerRepository.findOne({
        where: { email },
      });
      if (!customer) {
        return { email } as Customer;
      }
      return customer;
    } catch (error) {
      throw new NotFoundException('Customer not found');
    }
  }

  async update(
    email: string,
    customerData: Partial<Customer>,
  ): Promise<Customer> {
    try {
      const customer = await this.getCustomerByEmail(email);
      Object.assign(customer, customerData);
      return await this.customerRepository.save(customer);
    } catch (error) {
      throw new NotFoundException('Customer not found');
    }
  }

  async delete(email: string): Promise<void> {
    try {
      const customer = await this.getCustomerByEmail(email);
      await this.customerRepository.delete(customer.id);
    } catch (error) {
      throw new NotFoundException('Customer not found');
    }
  }

  private async getCustomerByEmail(email: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { email },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }
}
