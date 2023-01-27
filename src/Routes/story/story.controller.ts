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
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Thought, Creator, Title } from '@prisma/client';
import prisma from '../../prismaClient';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class StoryEntity {
  id: number;
  @Expose()
  text: string;
  @Expose()
  creatorId: number;

  constructor(partial: Partial<StoryEntity>) {
    Object.assign(this, partial);
  }
}
@Controller('story')
export class StoryController {
  @Get()
  @HttpCode(200)
  async allStory(): Promise<Thought[]> {
    const storyText = await prisma.thought.findMany({
      include: {
        creator: true,
        Title: true,
      },
    });
    return storyText;
  }
  @Get(':id')
  @HttpCode(200)
  async getStory(@Param('id') id: string): Promise<Thought> {
    try {
      const storyText = await prisma.thought.findUniqueOrThrow({
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
  async createStory(@Body() value): Promise<Title> {
    try {
      let { title, creator, text } = value;

      let createCreator;
      if (!creator) {
        let Creator = {
          name: 'anonimous',
        };
        createCreator = await prisma.creator.create({
          data: Creator,
        });
      } else {
        let creatorConfig = { name: creator };
        createCreator = await prisma.creator.create({
          data: creatorConfig,
        });
      }

      let thoughtConfig = { text: text, creatorId: createCreator.id };
      const thoughtText = await prisma.thought.create({
        data: thoughtConfig,
      });

      let config = {
        title,
        creatorId: createCreator.id,
        thoughtId: thoughtText.id,
      };

      const createTitle = await prisma.title.create({
        data: config,
        include: {
          creator: {
            select: {
              name: true,
            },
          },
          thought: {
            select: {
              text: true,
            },
          },
        },
      });

      return createTitle;
    } catch (error) {
      throw new BadRequestException();
    }
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('/updateStory/:id')
  @HttpCode(200)
  async updateStory(@Param('id') id: string, @Body() value): Promise<Thought> {
    try {
      const { text } = value;

      if (!text) {
        throw new NotFoundException('text not found');
      }
      const updateStory = await prisma.thought.update({
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
        return new StoryEntity(updateStory);
      }
    } catch (error) {
      throw new NotFoundException();
    }
  }
  @Delete('/deleteStory/:id')
  @HttpCode(200)
  async DeleteStory(@Param('id') id: string): Promise<Thought> {
    const deleteStory = await prisma.thought.delete({
      where: {
        id: Number(id),
      },
    });
    if (deleteStory) {
      return deleteStory;
    } else {
      throw new NotFoundException();
    }
  }
  @Delete('/deleteCreator/:id')
  @HttpCode(200)
  async DeleteCreator(
    @Param('id') id: string,
  ): Promise<{ deletedCreator: Creator; deleteStory: { count: number } }> {
    const creator = await prisma.creator.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (!creator) {
      throw new NotFoundException();
    }
    const deleteStory = await prisma.thought.deleteMany({
      where: {
        creatorId: creator.id,
      },
    });
    const deletedCreator = await prisma.creator.delete({
      where: {
        id: Number(id),
      },
    });
    if (!creator) {
      throw new NotFoundException();
    }
    return { deletedCreator, deleteStory };
  }
}
