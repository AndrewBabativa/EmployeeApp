import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './schema/user.schema';

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: Model<User>;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(() => {
    userModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as any; 

    jwtService = {
      sign: jest.fn(() => 'mockedToken'),
    } as any;

    configService = {
      get: jest.fn(() => '3600'),
    } as any;

    authService = new AuthService(userModel, jwtService, configService);
  });

  it('debe registrar un usuario y devolver un mensaje', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValue(null);
    jest.spyOn(userModel, 'create').mockImplementation(async (user: any) => {
      return Object.assign(
        { _id: 'mockedId', save: jest.fn() }, 
        user
      );
    });
    
    
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashedPassword'));

    const result = await authService.register({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result).toEqual({ message: 'Registro exitoso. Por favor, inicia sesión.' });
  });

  it('debe lanzar error si el usuario ya existe', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValue({ email: 'test@example.com' });

    await expect(
      authService.register({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow('El usuario ya está registrado.');
  });

  it('debe validar login y devolver un token', async () => {
    jest.spyOn(userModel, 'findOne').mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        _id: 'mockedId',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'hashedPassword',
      }),
    } as any);

    jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

    const result = await authService.login({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result).toEqual({
      accessToken: 'mockedToken',
      expiresIn: 3600,
      user: {
        id: 'mockedId',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
      },
    });
  });

  it('debe lanzar error si las credenciales son incorrectas', async () => {
    jest.spyOn(userModel, 'findOne').mockReturnValue({
      lean: jest.fn().mockResolvedValue(null), 
    } as any);

    await expect(
      authService.login({
        email: 'test@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow('Usuario no encontrado.');
  });
});
