import ListCustomerService from "@modules/customers/services/ListCustomerService";
import ShowCustomerService from "@modules/customers/services/ShowCustomerService";
import CreateCustomerService from "@modules/customers/services/CreateCustomerService";
import UpdateCustomerService from "@modules/customers/services/UpdateCustomerService";
import DeleteCustomerService from "@modules/customers/services/DeleteCustomerService";
import { Request, Response } from "express";
import { container } from "tsyringe";
import AppError from "@shared/errors/AppError";

export default class CustomerControllers {
  async index(request: Request, response: Response): Promise<Response> {
    try {
      const page = parseInt(request.query.page as string) || 1;
      const limit = parseInt(request.query.limit as string) || 10;
      const listCustomer = container.resolve(ListCustomerService);
      const customers = await listCustomer.execute(page, limit);
      return response.json(customers);
    } catch (error) {
      return response.status(500).json({ error: (error as Error).message });
    }
  }

  async show(request: Request, response: Response): Promise<Response> {
    try {
      const id = Number(request.params.id);
      const showCustomer = container.resolve(ShowCustomerService);
      const customer = await showCustomer.execute({ id });
      return response.json(customer);
    } catch (error) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({ error: error.message });
      }
      return response.status(500).json({ error: (error as Error).message });
    }
  }

  async create(request: Request, response: Response): Promise<Response> {
    try {
      const { name, email } = request.body;
      const createCustomer = container.resolve(CreateCustomerService);
      const customer = await createCustomer.execute({ name, email });
      return response.status(201).json(customer);
    } catch (error) {
      return response.status(500).json({ error: (error as Error).message });
    }
  }

  async update(request: Request, response: Response): Promise<Response> {
    try {
      const { name, email } = request.body;
      const id = Number(request.params.id);
      const updateCustomer = container.resolve(UpdateCustomerService);
      const customer = await updateCustomer.execute({ id, name, email });
      return response.json(customer);
    } catch (error) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({ error: error.message });
      }
      return response.status(500).json({ error: (error as Error).message });
    }
  }

  async delete(request: Request, response: Response): Promise<Response> {
    try {
      const id = Number(request.params.id);
      const deleteCustomer = container.resolve(DeleteCustomerService);
      await deleteCustomer.execute({ id });
      return response.status(204).json();
    } catch (error) {
      return response.status(500).json({ error: (error as Error).message });
    }
  }
}
