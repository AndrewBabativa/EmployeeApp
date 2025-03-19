import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue({ message: 'Usuario registrado con éxito' }),
            login: jest.fn().mockResolvedValue({
              accessToken: 'mockedToken',
              expiresIn: 3600,
              user: {
                id: 'mockedId',
                firstName: 'John',
                lastName: 'Doe',
                email: 'test@example.com',
              },
            } as AuthResponseDto),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('debe registrar un usuario y devolver un mensaje de éxito', async () => {
    const registerDto: RegisterAuthDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'password123',
    };

    await expect(authController.register(registerDto)).resolves.toEqual({
      message: 'Usuario registrado con éxito',
    });
    expect(authService.register).toHaveBeenCalledWith(registerDto);
  });

  it('debe iniciar sesión y devolver un token', async () => {
    const loginDto: LoginAuthDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    await expect(authController.login(loginDto)).resolves.toEqual({
      accessToken: 'mockedToken',
      expiresIn: 3600,
      user: {
        id: 'mockedId',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
      },
    });
    expect(authService.login).toHaveBeenCalledWith(loginDto);
  });
});
