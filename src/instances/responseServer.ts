import {ResponseDB} from "./ResponseDB";
import {ISession} from "../interface/session";

export class ResponseServer<T> {
    public session?: ISession;
    public body: ResponseDB<T>;

    constructor(body: ResponseDB<T>, session?: ISession) {
        this.session = session;
        this.body = body;
    }

    //  constructor(isSuccessful:boolean,message:string,data?:T,session?:ISession) {
    //     this.session = Object.freeze(session);
    //     this.body.isSuccessful=isSuccessful;
    //     this.body.message = message;
    //     this.body.data = data;
    // }
}

