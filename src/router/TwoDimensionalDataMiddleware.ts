import {ResponseBody} from "../instances/ResponseBody";
import Router from 'koa-router';
import {invalidParameter} from "./invalidParameter";
import {deleteTwoDimensionalData, uploadTwoDimensionalData} from "../server/TwoDimensionalServer";
import {IContext, ISession, IState} from "../interface/session";
import {checkDvSupSession} from "./checkPermissionMiddleware";
import is_number from "is-number";
// import send from "koa-send";
// import {rootDirPath} from "../config/filePaths";
// import path from "path";

module.exports = (router: Router<IContext, IState>) => {
    router.post('/api/uploadTwoDimensionalData', checkDvSupSession, async (ctx) => {
        if (!is_number(ctx.request.body.deviceID) || !is_number(ctx.request.body.categoryID)||!ctx.request.files) {
            ctx.body = invalidParameter();
        } else {
            let {deviceID,categoryID} = ctx.request.body;
            deviceID = Number(deviceID);categoryID = Number(categoryID);
            const {xlsxFile} = ctx.request.files;
            const {userID} = ctx.session.data as ISession;
            const response = await uploadTwoDimensionalData(xlsxFile,deviceID,categoryID,userID);
            const {isSuccessful,message} = response.body;
            ctx.body = new ResponseBody<void>(isSuccessful,message);
        }
    });

    router.post("/api/deleteTwoDimensionalData", checkDvSupSession, async (ctx) => {
        if(typeof ctx.request.body.deviceID !== 'number' || typeof ctx.request.body.twoDimensionalCategoryID !== 'number'){
            ctx.body = invalidParameter();
        } else {
            const {deviceID,twoDimensionalCategoryID} = ctx.request.body;
            const response = await deleteTwoDimensionalData(deviceID,twoDimensionalCategoryID);
            const {isSuccessful,message} = response.body;
            ctx.body = new ResponseBody<void>(isSuccessful,message);
        }
    });

    // router.get('/download',async (ctx)=>{
    //      const fileName = '2d.xlsx';
    //      ctx.attachment(fileName);
    //      await send(ctx,fileName,{root:path.join(rootDirPath)})
    // });
}

