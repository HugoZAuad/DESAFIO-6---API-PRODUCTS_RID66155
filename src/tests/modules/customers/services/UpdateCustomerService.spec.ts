import UpdateCustomerService from '@modules/customers/services/UpdateCustomerService';
import { ICustomerRepositories } from '@modules/customers/domains/repositories/ICreateCustomerRepositories';
import { container } from 'tsyringe';
import 'reflect-metadata';

describe('UpdateCustomerService', () => {
  let updateCustomerService: UpdateCustomerService;
  let customersRepositoriesMock: ICustomerRepositories;

  beforeEach(() => {
    customersRepositoriesMock = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
    } as unknown as ICustomerRepositories;

    container.registerInstance('customerRepositories', customersRepositoriesMock);

    updateCustomerService = container.resolve(UpdateCustomerService);
  });

  it('deve lançar erro se cliente não for encontrado', async () => {
    customersRepositoriesMock.findById = jest.fn().mockResolvedValue(null);

    await expect(updateCustomerService.execute({ id: 1, name: 'Nome', email: 'email@example.com' })).rejects.toThrow('Cliente não encontrado');
  });

  it('deve lançar erro se email já estiver em uso por outro cliente', async () => {
    customersRepositoriesMock.findById = jest.fn().mockResolvedValue({ id: 1, name: 'Nome', email: 'email@example.com' });
    customersRepositoriesMock.findByEmail = jest.fn().mockResolvedValue({ id: 2, name: 'Outro', email: 'email@example.com' });

    await expect(updateCustomerService.execute({ id: 1, name: 'Nome', email: 'email@example.com' })).rejects.toThrow('Já tem um cliente com este e-mail');
  });

  it('deve atualizar cliente com sucesso', async () => {
    const customer = { id: 1, name: 'Nome', email: 'email@example.com' };
    customersRepositoriesMock.findById = jest.fn().mockResolvedValue(customer);
    customersRepositoriesMock.findByEmail = jest.fn().mockResolvedValue(null);
    customersRepositoriesMock.save = jest.fn().mockResolvedValue(customer);

    const result = await updateCustomerService.execute({ id: 1, name: 'Nome Atualizado', email: 'email@novo.com' });

    expect(customersRepositoriesMock.save).toHaveBeenCalled();
    expect(result.name).toBe('Nome Atualizado');
    expect(result.email).toBe('email@novo.com');
  });
});
