import {ResponseServer} from "../instances/responseServer";
import {ResponseDB} from "../instances/ResponseDB";
import {UserLogin as UserLoginDB} from "../database/UserDatabase";
import {ISession} from "../interface/session";


export async function UserLogin(username: string, password: string): Promise<ResponseServer<void>> {
    const resultDB = await UserLoginDB(username, password);
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