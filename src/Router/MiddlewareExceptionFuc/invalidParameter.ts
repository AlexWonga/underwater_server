import {ResponseBody} from "../../Instances/ResponseBody";

export function invalidParameter():ResponseBody<void>{
    return new ResponseBody<void>(false,'invalidParameter');
}