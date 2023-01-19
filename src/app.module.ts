import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirstController } from './first/first.controller';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './checkreq.middleware';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, FirstController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('first');
  }
}
