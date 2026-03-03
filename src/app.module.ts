import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST', 'localhost'),
        port: parseInt(config.get<string>('DATABASE_PORT', '5588'), 10),
        username: config.get<string>('DATABASE_USER', 'postgres'),
        password: config.get<string>('DATABASE_PASSWORD', 'postgres'),
        database: config.get<string>('DATABASE_NAME', 'eventshuffle'),
        schema: config.get<string>('DATABASE_SCHEMA', 'public'),
        autoLoadEntities: true,
        synchronize: false, // Setting to use migrations
        migrationsTableName: 'migrations',
        migrations: ['dist/db/migrations/*{.js}'],
      }),
    }),
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
