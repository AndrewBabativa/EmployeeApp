import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employee } from './schema/employee.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AuthGuard } from '@nestjs/passport';
import { CanActivate } from '@nestjs/common';
import { Types } from 'mongoose';

const mockEmployee: Employee = {
  _id: new Types.ObjectId(),
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  jobTitle: 'Software Engineer',
  birthDate: new Date('1990-05-15'),
  createdBy: new Types.ObjectId(), 
} as Employee;

const mockEmployeesService = {
  create: jest.fn().mockResolvedValue(mockEmployee),
  update: jest.fn().mockResolvedValue({ ...mockEmployee, jobTitle: 'Tech Lead' }),
  findAll: jest.fn().mockResolvedValue([mockEmployee]),
  findOne: jest.fn().mockResolvedValue(mockEmployee),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe('EmployeesController', () => {
  let controller: EmployeesController;
  let service: EmployeesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [
        {
          provide: EmployeesService,
          useValue: mockEmployeesService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn().mockReturnValue(true) } as CanActivate)
      .compile();

    controller = module.get<EmployeesController>(EmployeesController);
    service = module.get<EmployeesService>(EmployeesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an employee', async () => {
    const createEmployeeDto: CreateEmployeeDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      jobTitle: 'Software Engineer',
      birthDate: new Date('1990-05-15'),
    };

    const requestMock = { user: { userId: 'admin-user' } };

    const result = await controller.create(createEmployeeDto, requestMock);

    expect(result).toEqual(mockEmployee);
    expect(service.create).toHaveBeenCalledWith(createEmployeeDto, 'admin-user');
  });

  it('should update an employee', async () => {
    const updateEmployeeDto: UpdateEmployeeDto = { jobTitle: 'Tech Lead' };
    const updatedEmployee = { ...mockEmployee, jobTitle: 'Tech Lead' };

    const result = await controller.update('employeeId123', updateEmployeeDto);

    expect(result).toEqual(updatedEmployee);
    expect(service.update).toHaveBeenCalledWith('employeeId123', updateEmployeeDto);
  });

  it('should get all employees', async () => {
    const result = await controller.findAll();

    expect(result).toEqual([mockEmployee]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should get one employee by ID', async () => {
    const result = await controller.findOne('employeeId123');

    expect(result).toEqual(mockEmployee);
    expect(service.findOne).toHaveBeenCalledWith('employeeId123');
  });

  it('should delete an employee', async () => {
    const result = await controller.remove('employeeId123');

    expect(result).toEqual({ message: 'Empleado con ID employeeId123 eliminado correctamente' });
    expect(service.remove).toHaveBeenCalledWith('employeeId123');
  });
});
