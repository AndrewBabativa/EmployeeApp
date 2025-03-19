export class AuthResponseDto {
    accessToken: string;
    expiresIn: number;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  }
  