import {Session} from "koa-session";

export interface ISession {
    userID: number;
    username: string;
}

export interface IState {
    //想在ctx.state后面挂载就加上对应的类型就行
    //userType:UserType;
    // data: any;
}

interface mySession extends Session {
    data: ISession | null;
    text: string | null;
    isNew: boolean;
}

export interface IContext {
    session: mySession;
}