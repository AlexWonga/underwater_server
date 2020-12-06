import {ParameterizedContext} from "koa";
import {IContext, IState} from "../interface/session";
import svgCaptcha from "svg-captcha";

export async function changeCapcha(ctx: ParameterizedContext<IState, IContext>): Promise<string> {
    let captcha = svgCaptcha.create();
    let {text,data} = captcha;
    ctx.session!.text = text;
    return data;
}
