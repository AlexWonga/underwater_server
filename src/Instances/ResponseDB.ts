export class ResponseDB<T> { //数据库层返回信息
    public isSuccessful: boolean;
    public message: string;
    public data?: T;

    constructor(isSuccessful: boolean, message: string, data?: T) {
        this.isSuccessful = isSuccessful;
        this.message = message;
        this.data = data;
    }
}
