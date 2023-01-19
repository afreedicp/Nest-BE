import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  HttpCode,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Story as IStory } from '@prisma/client';
import prisma from '../prismaClient';
@Controller('first')
export class FirstController {
  @Get()
  async allStory(): Promise<IStory[]> {
    const storyText = await prisma.story.findMany({});
    return storyText;
  }
  @Get(':id')
  async getStory(@Param('id') id: string): Promise<IStory> {
    console.log(id);
    try {
      const storyText = await prisma.story.findUniqueOrThrow({
        where: {
          id: Number(id),
        },
      });
      return storyText;
    } catch (error) {
      throw new NotFoundException();
    }
  }
  @Post('/addStory')
  @HttpCode(200)
  async createStory(@Body() value): Promise<IStory> {
    try {
      const { text, creator } = value;
      let storyConfig = { text, creatorId: creator };

      const storyText = await prisma.story.create({
        data: storyConfig,
      });
      return storyText;
    } catch (error) {
      throw new BadRequestException();
    }
  }
  @Patch('/updateStory/:id')
  async updateStory(@Param('id') id: string, @Body() value): Promise<IStory> {
    try {
      const { text } = value;
      if (!text) {
        throw new NotFoundException('text not found');
      }
      const updateStory = await prisma.story.update({
        where: {
          id: Number(id),
        },
        data: {
          text: text,
        },
      });
      if (!updateStory) {
        throw new NotFoundException();
      } else {
        return updateStory;
      }
    } catch (error) {
      throw new NotFoundException();
    }
  }
  @Delete('/deleteStory/:id')
  async DeleteStory(@Param('id') id: string): Promise<IStory> {
    const deleteStory = await prisma.story.delete({
      where: {
        id: Number(id),
      },
    });
    return deleteStory;
  }
}
