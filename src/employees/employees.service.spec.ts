import { EmployeesService } from './employees.service';
import { BadRequestException } from '@nestjs/common';

describe('EmployeesService', () => {
  let service: EmployeesService;
  let employeeModel: any;
  let positionsService: any;

  const mockEmployee = {
    firstName: 'John',
    lastName: 'Doe',
    jobTitle: 'sw admin',
    birthDate: new Date('1990-05-15'),
    email: 'john.doe@example.com',
    createdBy: 'admin-user',
    save: jest.fn().mockResolvedValue(true), 
  };

  beforeEach(() => {
    employeeModel = function (data: any) {
      return {
        ...data,
        save: jest.fn().mockResolvedValue(mockEmployee),
      };
    };

    employeeModel.findOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
    });

    employeeModel.create = jest.fn().mockResolvedValue(mockEmployee); 

    positionsService = {
      getPositions: jest.fn().mockResolvedValue(['scrum master', 'sw admin']),
    };

    service = new EmployeesService(employeeModel, positionsService);
  });

  it('should create an employee successfully', async () => {
    const employeeData = { ...mockEmployee };

    await service.create(employeeData, '123456789');

    expect(employeeModel.findOne).toHaveBeenCalledWith({ email: employeeData.email });
  });

  it('should throw an error if the email is already registered', async () => {
    employeeModel.findOne.mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockEmployee),
      }),
    });

    const employeeData = { ...mockEmployee };

    await expect(service.create(employeeData, '123456789')).rejects.toThrow(
      new BadRequestException('Ya existe un empleado con este correo electrónico.'),
    );
  }); 
  
});
