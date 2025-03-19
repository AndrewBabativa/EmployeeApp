  import { IsString, IsNotEmpty, IsDate, IsEmail, IsOptional } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';

  export class CreateEmployeeDto {
    @ApiProperty({ example: 'John', description: 'Nombre del empleado' })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'Doe', description: 'Apellido del empleado' })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ example: 'Software Engineer', description: 'Título del empleado' })
    @IsString()
    @IsNotEmpty()
    jobTitle: string;

    @ApiProperty({ example: '1990-05-15', description: 'Fecha de nacimiento del empleado', type: 'string', format: 'date' })
    @IsDate()
    @IsNotEmpty()
    birthDate: Date;

    @ApiProperty({ example: 'johndoe@example.com', description: 'Correo del empleado' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'ID del usuario que crea el empleado', required: false })
    @IsOptional()
    createdBy?: string;
  }
