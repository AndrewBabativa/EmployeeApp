import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee } from './schema/employee.schema';
import { AuthGuard } from '@nestjs/passport';
import { Logger } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

const logger = new Logger('EmployeesController');

@Controller('employees')
@ApiTags('Employees')
@ApiBearerAuth()
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Crear un nuevo empleado' })
  @ApiResponse({ status: 201, description: 'Empleado creado correctamente', type: Employee })
  async create(@Body() employeeData: CreateEmployeeDto, @Request() req): Promise<Employee> {
    logger.log(`Datos recibidos: ${JSON.stringify(employeeData)}`);
    return this.employeesService.create(employeeData, req.user.userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Actualizar un empleado por ID' })
  @ApiResponse({ status: 200, description: 'Empleado actualizado correctamente', type: Employee })
  async update(@Param('id') id: string, @Body() updateData: UpdateEmployeeDto): Promise<Employee> {
    return this.employeesService.update(id, updateData);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtener todos los empleados' })
  @ApiResponse({ status: 200, description: 'Lista de empleados obtenida con éxito', type: [Employee] })
  async findAll(): Promise<Employee[]> {
    return this.employeesService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtener un empleado por ID' })
  @ApiResponse({ status: 200, description: 'Empleado encontrado', type: Employee })
  async findOne(@Param('id') id: string): Promise<Employee> {
    return this.employeesService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Eliminar un empleado por ID' })
  @ApiResponse({ status: 200, description: 'Empleado eliminado correctamente' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.employeesService.remove(id);
    return { message: `Empleado con ID ${id} eliminado correctamente` };
  }
}
