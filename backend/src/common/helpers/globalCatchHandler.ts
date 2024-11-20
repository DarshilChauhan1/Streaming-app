import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Request, Response } from 'express'

@Catch()
export class ExceptionHandling implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void {
        try {
            const ctx = host.switchToHttp()
            const request = ctx.getRequest<Request>();
            const response = ctx.getResponse<Response>();
            const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : ""
    
            const httpStatus = exception instanceof HttpException ? exception.getStatus() : exception['statusCode'] || HttpStatus.INTERNAL_SERVER_ERROR;
            let responseBody = {
                statusCode: httpStatus,
                message: exceptionResponse['message'] ? exceptionResponse['message'] : exception.message || "Something went wrong",
                path: request.url,
                success: httpStatus == (200) ? true : false
            }
            //sending the error response 
            response.status(httpStatus).send(responseBody);
        } catch (error) {
            console.log("Error in ExceptionHandling", error)
        }
    }

}