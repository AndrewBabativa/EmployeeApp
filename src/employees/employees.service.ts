import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee } from './schema/employee.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PositionsService } from '../positions/positions.service';

@Injectable()
export class EmployeesService {
  private readonly logger = new Logger(EmployeesService.name);

  constructor(
    @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>,
    private readonly positionsService: PositionsService,
  ) { }

  async create(employeeData: CreateEmployeeDto, userId: string): Promise<Employee> {
    const positions = await this.positionsService.getPositions();

    if (!positions.includes(employeeData.jobTitle)) {
      throw new BadRequestException('El puesto de trabajo no es válido.');
    }

    const existingEmployee = await this.employeeModel.findOne({ email: employeeData.email }).lean().exec();
    if (existingEmployee) {
      throw new BadRequestException('Ya existe un empleado con este correo electrónico.');
    }

    try {
      const newEmployee = new this.employeeModel({
        ...employeeData,
        createdBy: userId,
      });

      return await newEmployee.save();
    } catch (error) {
      this.logger.error('Error creando empleado', error.message);
      throw new InternalServerErrorException('Error al guardar el empleado.');
    }
  }

  async findAll(): Promise<Employee[]> {
    try {
      return await this.employeeModel.find().lean().exec();
    } catch (error) {
      this.logger.error('Error obteniendo empleados', error.stack);
      throw new InternalServerErrorException('Error al obtener la lista de empleados.');
    }
  }

  async findOne(id: string): Promise<Employee> {
    try {
      const employee = await this.employeeModel.findById(id).lean().exec();
      if (!employee) throw new NotFoundException(`Empleado con ID ${id} no encontrado.`);
      return employee;
    } catch (error) {
      this.logger.error(`Error obteniendo empleado con ID ${id}`, error.stack);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al obtener el empleado.');
    }
  }

  async update(id: string, updateData: UpdateEmployeeDto): Promise<Employee> {
    try {
      const employee = await this.employeeModel.findByIdAndUpdate(id, updateData, { new: true }).lean().exec();
      if (!employee) throw new NotFoundException(`Empleado con ID ${id} no encontrado.`);
      return employee;
    } catch (error) {
      this.logger.error(`Error actualizando empleado con ID ${id}`, error.stack);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al actualizar el empleado.');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const exists = await this.employeeModel.exists({ _id: id }).exec();
      if (!exists) throw new NotFoundException(`Empleado con ID ${id} no encontrado.`);
      await this.employeeModel.deleteOne({ _id: id }).exec();
    } catch (error) {
      this.logger.error(`Error eliminando empleado con ID ${id}`, error.stack);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Error al eliminar el empleado.');
    }
  }
}
