import {ResponseServer} from "../instances/ResponseServer";
import {ResponseDB} from "../instances/ResponseDB";
import {userLogin as userLoginDB} from "../database/UserDatabase";
import {ISession} from "../interface/session";


export async function userLogin(username: string, password: string): Promise<ResponseServer<void>> {
    const resultDB = await userLoginDB(username, password);
    const {isSuccessful, message} = resultDB;
    if (!isSuccessful || !resultDB.data) {
        return new ResponseServer<void>(new ResponseDB<void>(isSuccessful, message));
    } else {
        const {ID, username} = resultDB.data;
        const response = new ResponseDB<void>(isSuccessful, message);
        const session: ISession = {userID: ID, username: username};
        return new ResponseServer<void>(response, session);
    }
}