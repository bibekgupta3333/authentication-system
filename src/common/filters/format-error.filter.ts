// nest
import {
  Catch,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
} from '@nestjs/common';

// third-party
import { omit } from 'lodash';

// types
import type { Request, Response } from 'express';

const POSSIBLE_ERROR_ENV = ['development', 'staging'];

function formatError(error: string | Record<string, any>): Record<string, any> {
  if (typeof error === 'string')
    return {
      message: error,
    };
}

@Catch(HttpException)
export class FormatErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const status = exception.getStatus();
    const response = ctx.getResponse<Response>();
    const actualErrorResponse = exception.getResponse();
    const { params, path, body, query, cookies, headers } =
      ctx.getRequest<Request>();
    console.log(actualErrorResponse);

    // (feat): Only show relevant request information for development and staging purposes only.
    // (note): must not be visible for production because http-only cookies are used and those shouldn't be visible
    const showRequestMeta =
      POSSIBLE_ERROR_ENV.includes(process.env.NODE_ENV || 'production') &&
      '__show_error_meta' in query;

    let requestErrorMeta = {};

    if (showRequestMeta) {
      requestErrorMeta = {
        errorMeta: {
          request: {
            cookies,
            headers,
            query: omit(query, '__show_error_meta'),
            parameters: params,
            path,
            body,
          },
        },
      };
    }

    response.status(status).json({
      status,
      data: null,
      error: formatError(actualErrorResponse),
      ...requestErrorMeta,
    });
  }
}
