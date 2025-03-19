import { IsString, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmployeeDto {
  @ApiProperty({ example: 'John', description: 'Nuevo nombre del empleado', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'Nuevo apellido del empleado', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'Senior Developer', description: 'Nuevo título del empleado', required: false })
  @IsString()
  @IsOptional()
  jobTitle?: string;

  @ApiProperty({ example: '1990-05-15', description: 'Nueva fecha de nacimiento del empleado', type: 'string', format: 'date', required: false })
  @IsDate()
  @IsOptional()
  birthDate?: Date;
}
