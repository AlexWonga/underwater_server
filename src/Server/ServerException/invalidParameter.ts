import {ResponseServer} from "../../Instances/ResponseServer";
import {ResponseDB} from "../../Instances/ResponseDB";

export function invalidParameter<T>(){
    return new ResponseServer<T>(
        new ResponseDB(false, 'invalidParameter')
    );
}