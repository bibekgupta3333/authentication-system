// nest
import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

// prisma
import { Prisma } from '@prisma/client';

// utils
import { FormatErrorFilter } from './format-error.filter';

function parseIntoHttpError(
  exception:
    | Prisma.PrismaClientKnownRequestError
    | Prisma.PrismaClientValidationError,
) {
  if (process.env.NODE_ENV === 'development') {
    console.log(exception);
  }

  if (exception instanceof Prisma.PrismaClientValidationError) {
    return new BadRequestException('Invalid Request Data');
  }

  if (exception instanceof Prisma.PrismaClientKnownRequestError) {
    console.log(`[Error Code::KnowRequestError::]: ${exception.code} `);

    switch (exception.code) {
      case 'P2002':
        return new BadRequestException('Resource not unique! Already Exists!');
      case 'P2003':
        return new BadRequestException(
          'Resource cannot be modified because of foreign reference!',
        );
      case 'P2007':
        return new BadRequestException('Invalid Request data');
      case 'P2025':
        return new NotFoundException('Resource not found');
    }
  }

  return new InternalServerErrorException(
    'Internal Server Error! Contact Administrator',
  );
}

const HttpExceptionFormatter = new FormatErrorFilter();

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaFormatErrorFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    HttpExceptionFormatter.catch(parseIntoHttpError(exception), host);
  }
}
