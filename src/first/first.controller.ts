import { Controller, Get, Post, Body } from '@nestjs/common';
import { IStory } from '../Interface/story';
import prisma from '../prismaClient';
@Controller('first')
export class FirstController {
  @Get()
  secondHello(): string {
    return 'the first sub api in controller';
  }
  @Post()
  async Story(@Body() value): Promise<any> {
    const { text } = value;
    const storyText = await prisma.story.create({
      data: {
        text: text,
      },
    });
    return storyText;
  }
}
