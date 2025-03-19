import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterAuthDto {
  @ApiProperty({ example: 'John', description: 'Nombre del usuario', minLength: 3 })
  @IsString()
  @MinLength(3)
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Apellido del usuario', minLength: 3 })
  @IsString()
  @MinLength(3)
  lastName: string;

  @ApiProperty({ example: 'user@example.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePassword123', description: 'Contraseña del usuario', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
