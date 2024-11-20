export class CustomError extends Error {
    message: string;
    statusCode: number;
    redirectTo : string;
    success : boolean;

    constructor(message : string, statusCode : number, success : boolean, redirectTo? : string) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.redirectTo = redirectTo;
        this.success = success;
    }
}