import {ResponseServer} from "../instances/ResponseServer";
import {ResponseDB} from "../instances/ResponseDB";

export function permissionDeny<T>(){
    return new ResponseServer<T>(
        new ResponseDB(false, 'permissionDeny')
    );
}