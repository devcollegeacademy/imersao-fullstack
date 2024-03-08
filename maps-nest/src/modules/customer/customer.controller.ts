import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Redirect,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './customer.entity';
import axios from 'axios';
import { VerifyGoogleGuard } from '../../guard/verify-google/verify-google.guard';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

   @Get('auth/')
  @Redirect()
  auth(): { url: string } {
    return { url: process.env.GOOGLE_AUTH_URI };
  }

  @Post()
  @UseGuards(VerifyGoogleGuard)
  async create(@Body() customerData: Customer): Promise<Customer> {
    return await this.handleServiceError(() =>
      this.customerService.create(customerData),
    );
  }

  @Get()
  @UseGuards(VerifyGoogleGuard)
  async readOne(@Request() req): Promise<Customer> {
    return await this.handleServiceError(() =>
      this.customerService.readOne(req.email),
    );
  }

  @Get('filter/:title?')
  async readAllByFilter(@Param('title') title?: string): Promise<Customer[]> {
    
    return await this.handleServiceError(() =>
      this.customerService.readAllByFilter(title),
    );
  }

  @Put()
  @UseGuards(VerifyGoogleGuard)
  async update(
    @Request() req,
    @Body() customerData: Customer,
  ): Promise<Customer> {
    return await this.handleServiceError(() =>
      this.customerService.update(req.email, customerData),
    );
  }

  @Delete()
  @UseGuards(VerifyGoogleGuard)
  async delete(@Request() req): Promise<void> {
    return await this.handleServiceError(() =>
      this.customerService.delete(req.email),
    );
  }

  @Get('address/:zipCode')
  @UseGuards(VerifyGoogleGuard)
  async getAddress(@Param('zipCode') zipCode: string): Promise<string> {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=AIzaSyBIBkZEexyq3td0QPGZHb9B_-s7-wm6y6I`,
    );
    return response.data.results[0].formatted_address;
  }

  private async handleServiceError<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
