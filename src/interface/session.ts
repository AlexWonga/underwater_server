import {Session} from "koa-session";

export interface ISession {
    userID: number;
    username: string;
}

export interface IState {

}

export interface mySession extends Session {
    data: ISession | null;
    text: string | null;
}

export interface IContext {
    session: mySession | null
}