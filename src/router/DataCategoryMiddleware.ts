import Router from "koa-router";
import {checkDvSupSession,  checkSupervisorSession} from "./checkPermissionMiddleware";
import {ResponseBody} from "../instances/ResponseBody";
import {checkType} from "../instances/checkType";
import {invalidParameter} from "./invalidParameter";
import {
    queryCategoryAmount,
    queryDeletedCategoryAmount,
    addDataCategory,
    modifyDataCategory,
    deleteDataCategory,
    deletedDataCategoryRecover,
    listDataCategory,
    listDeletedCategory,
    searchCategory,
    searchDeletedCategory,
    queryCategory,
    queryCategoryOptions
} from "../server/DataCategoryServer";
import {DataCategory} from "../Class/DataCategory";
import is_number from "is-number";
import {IContext, ISession, IState} from "../interface/session";


const isStringArray = function (object: any): boolean {//判断一个参数是不是字符串数组
    if(!Array.isArray(object)){
        return false;
    }
    else {
        if (object.length === 0) {//为空非法
            return false;
        }
        let flag = true;
        object.forEach((item)=>{
            if(typeof item!=='string'){
                flag = false;
            }
        });
        return flag;
    }
}

module.exports = (router: Router<IState, IContext>) => {
    router.post('/api/addDataCategory', checkSupervisorSession, async (ctx) => {
        if (typeof ctx.request.body.dataCategoryName !== 'string' || !checkType.instanceOfDataType(ctx.request.body.dataType)) {
            ctx.body = invalidParameter();
        }
        const {dataCategoryName, dataType, selectList} = ctx.request.body;
        const {userID} = ctx.session.data as ISession;
        const response = await addDataCategory(dataCategoryName, dataType, userID, selectList);
        const {isSuccessful, message} = response.body;
        ctx.body = new ResponseBody<void>(isSuccessful, message);
    });

    router.post('/api/modifyDataCategory', checkSupervisorSession, async (ctx) => {
        if (typeof ctx.request.body.dataCategoryID !== 'number' || (typeof ctx.request.body.dataCategoryName !== 'string' && typeof ctx.request.body.dataCategoryName !== 'undefined') || !isStringArray(ctx.request.body.selectList)) {
            ctx.body = new ResponseBody<void>(false, 'invalidParameter')
        } else {
            const {userID} = ctx.session.data as ISession;
            const {dataCategoryID, dataCategoryName, selectList} = ctx.request.body;
            const response = await modifyDataCategory(dataCategoryID, userID, dataCategoryName, selectList);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody<void>(isSuccessful, message);
        }
    });

    router.post('/api/deleteDataCategory', checkSupervisorSession, async (ctx) => {
        if (typeof ctx.request.body.dataCategoryID !== 'number') {
            ctx.body = invalidParameter();
        } else {
            const {dataCategoryID} = ctx.request.body;
            const {userID} = ctx.session.data as ISession;
            const response = await deleteDataCategory(dataCategoryID, userID);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody<void>(isSuccessful, message);
        }
    });

    router.post('/api/deletedDataCategoryRecover', checkSupervisorSession, async (ctx) => {
        if (typeof ctx.request.body.dataCategoryID !== 'number') {
            ctx.body = invalidParameter();
        } else {
            const {dataCategoryID} = ctx.request.body;
            const {userID} = ctx.session.data as ISession;
            const response = await deletedDataCategoryRecover(dataCategoryID, userID);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody<void>(isSuccessful, message);
        }
    });

    router.get('/api/listDataCategory', checkDvSupSession, async (ctx) => {
        if (!is_number(ctx.request.query.offset) || !is_number(ctx.request.query.limit)) {
            ctx.body = invalidParameter();
        } else {
            let {limit, offset} = ctx.request.query;
            limit = Number(limit);
            offset = Number(offset);
            const {userID} = ctx.session.data as ISession;
            const response = await listDataCategory(offset, limit, userID);
            if (response.body.isSuccessful && response.body.data) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<DataCategory[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<DataCategory[]>(isSuccessful, message);
            }
        }
    });

    router.get('/api/listDeletedCategory', checkSupervisorSession, async (ctx) => {
        if (!is_number(ctx.request.query.offset) || !is_number(ctx.request.query.limit)) {
            ctx.body = invalidParameter();
        } else {
            let {limit, offset} = ctx.request.query;
            limit = Number(limit);
            offset = Number(offset);
            const {userID} = ctx.session.data as ISession;
            const response = await listDeletedCategory(offset, limit, userID);
            if (response.body.isSuccessful && response.body.data) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<DataCategory[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<DataCategory[]>(isSuccessful, message);
            }
        }
    });

    router.get('/api/searchCategory', checkSupervisorSession, async (ctx) => {
        if (typeof ctx.request.query.keyword !== 'string') {
            ctx.body = invalidParameter();
        } else {
            const {keyword} = ctx.request.query;
            const {userID} = ctx.session.data as ISession;
            const response = await searchCategory(keyword, userID);
            if (response.body.isSuccessful && response.body.data) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<DataCategory[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<DataCategory[]>(isSuccessful, message);
            }
        }
    });

    router.get('/api/searchDeletedCategory', checkSupervisorSession, async (ctx) => {
        if (typeof ctx.request.query.keyword !== 'string') {
            ctx.body = invalidParameter();
        } else {
            const {keyword} = ctx.request.query;
            const {userID} = ctx.session.data as ISession;
            const response = await searchDeletedCategory(keyword, userID);
            if (response.body.isSuccessful && response.body.data) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<DataCategory[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<DataCategory[]>(isSuccessful, message);
            }
        }
    });

    router.get('/api/queryCategory', checkDvSupSession, async (ctx) => {
        console.log(11111);
        console.log(ctx.request.query);
        if (!is_number(ctx.request.query.categoryID)) {
            ctx.body = invalidParameter();
        } else {
            let {categoryID} = ctx.request.query;
            categoryID = Number(categoryID);
            const {userID} = ctx.session.data as ISession;
            const response = await queryCategory(categoryID, userID);
            if (response.body.isSuccessful && response.body.data) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<DataCategory>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<DataCategory>(isSuccessful, message);
            }
        }
    });
    router.get('/api/queryCategoryOptions', checkDvSupSession, async (ctx) => {
        if (!is_number(ctx.request.query.categoryID)) {
            ctx.body = invalidParameter();
        } else {
            let {categoryID} = ctx.request.query;
            categoryID = Number(categoryID);
            const {userID} = ctx.session.data as ISession;
            const response = await queryCategoryOptions(categoryID, userID);
            if (response.body.isSuccessful && response.body.data) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<String[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<String[]>(isSuccessful, message);
            }
        }
    });

    router.get("/api/queryCategoryAmount",checkDvSupSession, async (ctx) => {
        const response = await queryCategoryAmount();
        if (response.body.data && response.body.isSuccessful) {
            const {isSuccessful, message, data} = response.body;
            ctx.body = new ResponseBody<number>(isSuccessful, message, data);
        } else {
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody<number>(isSuccessful, message);
        }
    });

    router.get("/api/queryDeletedCategoryAmount", checkSupervisorSession, async (ctx) => {
        const {userID} = ctx.session.data as ISession;
        const response = await queryDeletedCategoryAmount(userID);
        if (response.body.data && response.body.isSuccessful) {
            const {isSuccessful, message, data} = response.body;
            ctx.body = new ResponseBody<number>(isSuccessful, message, data);
        } else {
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody<number>(isSuccessful, message);
        }
    });
}