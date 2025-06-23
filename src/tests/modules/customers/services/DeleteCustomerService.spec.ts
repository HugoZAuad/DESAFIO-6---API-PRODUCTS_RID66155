import DeleteCustomerService from '@modules/customers/services/DeleteCustomerService';
import { ICustomerRepositories } from '@modules/customers/domains/repositories/ICreateCustomerRepositories';
import { container } from 'tsyringe';
import 'reflect-metadata';

describe('DeleteCustomerService', () => {
  let deleteCustomerService: DeleteCustomerService;
  let customersRepositoriesMock: ICustomerRepositories;

  beforeEach(() => {
    customersRepositoriesMock = {
      findById: jest.fn(),
      remove: jest.fn(),
    } as unknown as ICustomerRepositories;

    container.registerInstance('customerRepositories', customersRepositoriesMock);

    deleteCustomerService = container.resolve(DeleteCustomerService);
  });

  it('deve lançar erro se o cliente não for encontrado', async () => {
    customersRepositoriesMock.findById = jest.fn().mockResolvedValue(null);
    await expect(deleteCustomerService.execute({ id: 1 })).rejects.toThrow('Clienten não encontrado.');
  });

  it('deve deletar o cliente com sucesso', async () => {
    const customer = { id: 1, name: 'Cliente Teste', email: 'teste@example.com' };
    customersRepositoriesMock.findById = jest.fn().mockResolvedValue(customer);
    customersRepositoriesMock.remove = jest.fn().mockResolvedValue(undefined);

    await deleteCustomerService.execute({ id: 1 });

    expect(customersRepositoriesMock.remove).toHaveBeenCalledWith(customer);
  });
});
