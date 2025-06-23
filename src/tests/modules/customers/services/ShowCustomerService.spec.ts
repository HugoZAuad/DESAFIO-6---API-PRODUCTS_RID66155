import ShowCustomerService from '@modules/customers/services/ShowCustomerService';
import { ICustomerRepositories } from '@modules/customers/domains/repositories/ICreateCustomerRepositories';
import { container } from 'tsyringe';
import 'reflect-metadata';

describe('ShowCustomerService', () => {
  let showCustomerService: ShowCustomerService;
  let customersRepositoriesMock: ICustomerRepositories;

  beforeEach(() => {
    customersRepositoriesMock = {
      findById: jest.fn(),
    } as unknown as ICustomerRepositories;

    container.registerInstance('customerRepositories', customersRepositoriesMock);

    showCustomerService = container.resolve(ShowCustomerService);
  });

  it('deve retornar cliente pelo id', async () => {
    const customer = { id: 1, name: 'Cliente Teste', email: 'teste@example.com' };
    customersRepositoriesMock.findById = jest.fn().mockResolvedValue(customer);

    const result = await showCustomerService.execute({ id: 1 });

    expect(result).toEqual(customer);
  });

  it('deve lançar erro se cliente não for encontrado', async () => {
    customersRepositoriesMock.findById = jest.fn().mockResolvedValue(null);

    await expect(showCustomerService.execute({ id: 1 })).rejects.toThrow('Cliente não encontrado');
  });
});
