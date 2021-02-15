import {ResponseServer} from "../../Instances/ResponseServer";
import {ResponseDB} from "../../Instances/ResponseDB";

export function permissionDeny<T>(){
    return new ResponseServer<T>(
        new ResponseDB(false, 'permissionDeny')
    );
}