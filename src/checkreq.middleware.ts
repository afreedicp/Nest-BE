import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.header('shahi') == '34') {
      console.log('shahi und');
      next();
    } else {
      throw new UnauthorizedException();
    }
  }
}
