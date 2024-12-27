import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppError } from '@core/error/app-errors';
import { I18nService } from '@/i18n/i18n.service';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
    constructor(private i18nService: I18nService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError(error => {
                const req = context.switchToHttp().getRequest();
                const language = req.headers['accept-language'] || 'pt-BR';

                if (error instanceof AppError) {
                    const translatedMessage = this.i18nService.translate(error.translationKey, language, error.details);
                    const status = error.httpStatus || HttpStatus.BAD_REQUEST;
                    throw new HttpException({
                        statusCode: status,
                        errorCode: error.errorCode,
                        message: translatedMessage,
                        details: error.details,
                    }, status);
                } else if (error instanceof HttpException) {
                    // Manter o status HTTP original para exceções HTTP
                    throw error;
                } else {
                    // Para erros não tratados, logar e retornar um erro 500
                    console.error('Unhandled error', error);
                    const genericErrorMessage = this.i18nService.translate('errors.INTERNAL_SERVER_ERROR', language);
                    throw new HttpException({
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        errorCode: 'INTERNAL_SERVER_ERROR',
                        message: genericErrorMessage,
                    }, HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }),
        );
    }
}