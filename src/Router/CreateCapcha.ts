import {ParameterizedContext} from "koa";
import {IContext, IState} from "../Interface/Session";
import svgCaptcha from "svg-captcha";
//用来修改session中的验证码，并返回相应的svg数据的函数
export async function changeCapcha(ctx: ParameterizedContext<IState, IContext>): Promise<string> {
    let captcha = svgCaptcha.create();
    let {text,data} = captcha;
    ctx.session!.text = text;
    return data;
}
