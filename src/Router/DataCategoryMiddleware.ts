import Router from "koa-router";
import {checkDvSupSession, checkSupervisorSession} from "./VerificationMiddleware/CheckPermissionMiddleware";
import {ResponseBody} from "../Instances/ResponseBody";
import {checkType} from "../Instances/CheckType";
import {invalidParameter} from "./MiddlewareExceptionFuc/invalidParameter";
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
} from "../Server/DataCategoryServer";
import {DataCategory} from "../Class/DataCategory";
import is_number from "is-number";
import {IContext, IState} from "../Interface/Session";
import {utilx} from "../Instances/Utilx";


const isStringArray = function (object: any): boolean {//判断一个参数是不是字符串数组
    if (!Array.isArray(object)) {
        return false;
    } else {
        if (object.length === 0) {//为空非法
            return false;
        }
        let flag = true;
        object.forEach((item) => {
            if (typeof item !== 'string') {
                flag = false;
            }
        });
        return flag;
    }
}

module.exports = (router: Router<IState, IContext>) => {
    router.post('/api/addDataCategory', checkSupervisorSession, async (ctx) => {
        if (typeof ctx.request.body.dataCategoryName !== 'string' || !checkType.instanceOfDataType(ctx.request.body.dataType) || (!isStringArray(ctx.request.body.selectList) && ctx.request.body.selectList !== 'undefined')) {
            ctx.body = invalidParameter();
        }
        let {dataCategoryName, dataType, selectList} = ctx.request.body;
        let [clearedCategoryName] = utilx.clear(dataCategoryName);
        dataCategoryName = clearedCategoryName;
        if (Array.isArray(selectList)) {
            selectList.forEach((item) => {
                let [clearedItem] = utilx.clear(item);
                item = clearedItem;
            })
        }
        const {userID} = ctx.session!.data!;
        const response = await addDataCategory(dataCategoryName, dataType, userID, selectList);
        const {isSuccessful, message} = response.body;
        ctx.body = new ResponseBody<void>(isSuccessful, message);
    });

    router.post('/api/modifyDataCategory', checkSupervisorSession, async (ctx) => {
        if (typeof ctx.request.body.dataCategoryID !== 'number' || (typeof ctx.request.body.dataCategoryName !== 'string' && typeof ctx.request.body.dataCategoryName !== 'undefined') || (!isStringArray(ctx.request.body.selectList) && typeof ctx.request.body.selectList !== 'undefined')) {
            ctx.body = new ResponseBody<void>(false, 'invalidParameter')
        } else {
            const {userID} = ctx.session!.data!;
            let {dataCategoryID, dataCategoryName, selectList} = ctx.request.body;
            let [clearedCategoryName] = utilx.clear(dataCategoryName);
            dataCategoryName = clearedCategoryName;
            if (Array.isArray(selectList)) {
                selectList.forEach((item) => {
                    let [clearedItem] = utilx.clear(item);
                    item = clearedItem;
                })
            }
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
            const {userID} = ctx.session!.data!;
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
            const {userID} = ctx.session!.data!;
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
            const {userID} = ctx.session!.data!;
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
            const {userID} = ctx.session!.data!;
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
            const {userID} = ctx.session!.data!;
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
            const {userID} = ctx.session!.data!;
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

    router.get('/api/queryCategory', async (ctx) => {
        console.log(11111);
        console.log(ctx.request.query);
        if (!is_number(ctx.request.query.categoryID)) {
            ctx.body = invalidParameter();
        } else {
            let {categoryID} = ctx.request.query;
            categoryID = Number(categoryID);
            const response = await queryCategory(categoryID);
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
            const {userID} = ctx.session!.data!;
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

    router.get("/api/queryCategoryAmount", checkDvSupSession, async (ctx) => {
        const response = await queryCategoryAmount();
        const {isSuccessful, message, data} = response.body;
        ctx.body = new ResponseBody<number>(isSuccessful, message, data);
    });

    router.get("/api/queryDeletedCategoryAmount", checkSupervisorSession, async (ctx) => {
        const {userID} = ctx.session!.data!;
        const response = await queryDeletedCategoryAmount(userID);
        const {isSuccessful, message, data} = response.body;
        ctx.body = new ResponseBody<number>(isSuccessful, message, data);
    });
}