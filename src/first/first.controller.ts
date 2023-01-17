import { Controller, Get } from '@nestjs/common';

@Controller('first')
export class FirstController {
  @Get()
  secondHello(): string {
    return 'the first sub api in controller';
  }
}
