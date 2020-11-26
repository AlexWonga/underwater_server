import {ResponseServer} from "../instances/ResponseServer";
import {ResponseDB} from "../instances/ResponseDB";

export function invalidParameter<T>(){
    return new ResponseServer<T>(
        new ResponseDB(false, 'invalidParameter')
    );
}