import {ResponseBody} from "../instances/ResponseBody";

export function invalidParameter():ResponseBody<void>{
    return new ResponseBody<void>(false,'invalidParameter');
}