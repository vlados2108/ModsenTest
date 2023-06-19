import { Catch, ExceptionFilter, ForbiddenException,ArgumentsHost,UnauthorizedException } from "@nestjs/common";


@Catch()
export class AuthFilter implements ExceptionFilter {
    catch(exception:UnauthorizedException,host:ArgumentsHost){
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        response
        .status(status)
        .json({
          statusCode: status,
          message:exception.message + "(u need to login)",
          timestamp: new Date().toISOString(),
          path: request.url,      
        })
    }
}