import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoryController } from './Routes/story/story.controller';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './checkreq.middleware';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, StoryController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('story');
  }
}
