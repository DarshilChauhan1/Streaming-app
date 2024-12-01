import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const getToken = request.headers.authorization;
        if (!getToken) return false;
        const token = getToken.split(' ')[1];
        const userId = this.validateToken(token);
        if (!userId) return false;
        request.userId = userId;
        return true;
    }

    async validateToken(token: string) {
        try {
            const decoded = await this.jwtService.verifyAsync(token);
            return decoded;
        } catch (error) {
            return null;
        }
    }
}