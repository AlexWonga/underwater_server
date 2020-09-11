export class ResponseBody<T> {
    public isSuccessful: boolean;
    public message: string;
    public data?: T;

    constructor(isSuccessful: boolean, message: string, data?: T) {
        this.isSuccessful = isSuccessful;
        this.message = message;
        this.data = data;
    }
}