import {ResponseServer} from "../instances/responseServer";
import {ResponseDB} from "../instances/ResponseDB";

export function permissionDeny<T>(){
    return new ResponseServer<T>(
        new ResponseDB(false, 'permissionDeny')
    );
}