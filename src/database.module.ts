import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');

        if (!uri) {
          throw new Error('❌ MONGO_URI no está definido. Verifica el archivo .env');
        }

        Logger.log(`✅ Conectando a MongoDB en: ${uri}`, 'DatabaseModule');
        return { uri };
      },
    }),
  ],
})
export class DatabaseModule {}
