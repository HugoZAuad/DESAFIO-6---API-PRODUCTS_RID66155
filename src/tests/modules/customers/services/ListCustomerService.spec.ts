import ListCustomerService from '@modules/customers/services/ListCustomerService';
import { ICustomerRepositories } from '@modules/customers/domains/repositories/ICreateCustomerRepositories';
import { container } from 'tsyringe';
import AppError from '@shared/errors/AppError';

describe('ListCustomerService', () => {
  let listCustomerService: ListCustomerService;
  let customersRepositoriesMock: ICustomerRepositories;

  beforeEach(() => {
    customersRepositoriesMock = {
      findAndCount: jest.fn(),
    } as unknown as ICustomerRepositories;

    container.registerInstance('customerRepositories', customersRepositoriesMock);

    listCustomerService = container.resolve(ListCustomerService);
  });

  it('deve retornar lista paginada de clientes', async () => {
    const customers = [{ id: 1, name: 'Cliente 1', email: 'cliente1@example.com' }];
    customersRepositoriesMock.findAndCount = jest.fn().mockResolvedValue([customers, 1]);

    const result = await listCustomerService.execute(1, 10);

    expect(result.data).toEqual(customers);
    expect(result.total).toBe(1);
    expect(result.per_page).toBe(10);
    expect(result.current_Page).toBe(1);
    expect(result.total_pages).toBe(1);
    expect(result.next_page).toBeNull();
    expect(result.prev_page).toBeNull();
  });

  it('deve lançar erro se nenhum cliente for encontrado', async () => {
    customersRepositoriesMock.findAndCount = jest.fn().mockResolvedValue([[], 0]);

    await expect(listCustomerService.execute(1, 10)).rejects.toThrow(
      new AppError('Cliente não encontrado', 404),
    );
  });
});
