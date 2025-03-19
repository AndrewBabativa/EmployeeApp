import { Injectable, UnauthorizedException, ConflictException, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './schema/user.schema';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ConfigService } from '@nestjs/config';

const logger = new Logger('AuthService');

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtExpirationTime: string;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtExpirationTime = this.configService.get<string>('JWT_EXPIRATION_TIME', '3600'); 
  }

  async register(registerDto: RegisterAuthDto): Promise<{ message: string }> {
    const { firstName, lastName, email, password } = registerDto;
    
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('El usuario ya está registrado.');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new this.userModel({ firstName, lastName, email, password: hashedPassword });
      await user.save();
      return { message: 'Registro exitoso. Por favor, inicia sesión.' };
    } catch (error) {
      this.logger.error('Error en el registro de usuario', error.stack);
      throw new InternalServerErrorException('No se pudo registrar el usuario.');
    }
  }

  async login(loginDto: LoginAuthDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email }).lean();
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    try {
      return {
        accessToken: this.generateToken(user),
        expiresIn: 3600, 
        user: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      };
    } catch (error) {
      this.logger.error(`Error en el login para el usuario ${loginDto.email}`, error.stack);
      throw new InternalServerErrorException('No se pudo iniciar sesión.');
    }
  }

  private generateToken(user: User): string {
    try {
      logger.log(`Validando generateToken: ${JSON.stringify(user)}`);

      return this.jwtService.sign(
        { username: user.email, userId: user._id },
        { expiresIn: `${this.jwtExpirationTime}s` } 
      );
    } catch (error) {
      this.logger.error(`Error generando token para el usuario ${user.email}`, error.stack);
      throw new InternalServerErrorException('No se pudo generar el token.');
    }
  }
}
