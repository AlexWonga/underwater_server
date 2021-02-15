import Router from "koa-router";
import {checkDvSupSession, checkSupervisorSession} from "./VerificationMiddleware/CheckPermissionMiddleware";
import {ResponseBody} from "../Instances/ResponseBody";
import {invalidParameter} from './MiddlewareExceptionFuc/invalidParameter';
import {
    addManufacturer,
    modifyManufacturer,
    deleteManufacturer,
    deletedManufacturerRecover,
    listDeletedManufacturer,
    listManufacturer,
    listManufacturerOnID,
    queryManufacturer,
    queryManufacturerInfoAmount,
    searchManufacturer,
    searchDeletedManufacturer,
    queryManufacturerInfoAmountInfoOnID,
    userJoinManufacturer,
    userLeaveManufacturer,
    queryDeletedManufacturerInfoAmount,
    searchManufacturerNotJoin,
    searchManufacturerOnID,
} from "../Server/ManufacturerServer";
import {ManufacturerInfo} from "../Class/ManufacturerInfo";
import is_number from "is-number";
import {IContext,  IState} from "../Interface/Session";
import {checkType} from "../Instances/CheckType";
import {utilx} from "../Instances/Utilx";

module.exports = (router: Router<IState, IContext>) => {
    router.post('/api/addManufacturer', checkDvSupSession, async (ctx): Promise<void> => {
        if (typeof ctx.request.body.manufacturerName !== 'string' || typeof ctx.request.body.manufacturerTelephone !== 'string' || typeof ctx.request.body.manufacturerIntroduction !== 'string' || typeof (ctx.request.body.manufacturerAddress) !== 'string') {
            console.log(typeof ctx.request.body.manufacturerName, typeof ctx.request.body.manufacturerTelephone, typeof ctx.request.body.manufacturerIntroduction, typeof (ctx.request.body.manufacturerAddress));
            ctx.body = invalidParameter();
        } else {
            const {manufacturerName, manufacturerTelephone, manufacturerIntroduction, manufacturerAddress} = ctx.request.body;
            if (manufacturerName === undefined || manufacturerTelephone === undefined || manufacturerIntroduction === undefined || manufacturerAddress === undefined) {
                ctx.body = invalidParameter();
            } else {
                const {userID} = ctx.session!.data!;
                const response = await addManufacturer(manufacturerName, manufacturerTelephone, manufacturerIntroduction, manufacturerAddress, userID);
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<void>(isSuccessful, message);
            }
        }
    });
    router.post('/api/modifyManufacturer', checkDvSupSession, async (ctx) => {
        if (checkType.instanceOfManufacturerInfo(ctx.request.body.manufacturerInfo)) {
            ctx.body = invalidParameter();
        } else {
            const {manufacturerInfo} = ctx.request.body;
            if (manufacturerInfo === undefined) {
                ctx.body = invalidParameter();
            } else {
                const {userID} = ctx.session!.data!;
                const response = await modifyManufacturer(manufacturerInfo, userID);
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<void>(isSuccessful, message);
            }
        }
    });

    router.post('/api/deleteManufacturer', checkDvSupSession, async (ctx) => {
        if (typeof ctx.request.body.manufacturerID !== 'number') {
            ctx.body = invalidParameter();
        } else {
            const {manufacturerID} = ctx.request.body;
            const {userID} = ctx.session!.data!;
            const response = await deleteManufacturer(manufacturerID, userID);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody<void>(isSuccessful, message);
        }
    });

    router.post('/api/deletedManufacturerRecover', checkSupervisorSession, async (ctx) => {
        if (typeof ctx.request.body.manufacturerID !== 'number') {
            ctx.body = invalidParameter();
        } else {
            const {manufacturerID} = ctx.request.body;
            const {userID} = ctx.session!.data!;
            const response = await deletedManufacturerRecover(manufacturerID, userID);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody<void>(isSuccessful, message);
        }
    });

    router.get('/api/listManufacturer', async (ctx) => {
        if (!is_number(ctx.request.query.offset) || !is_number(ctx.request.query.limit)) {
            ctx.body = invalidParameter();
        } else {
            let {offset, limit} = ctx.request.query;
            offset = Number(offset);
            limit = Number(limit);
            const response = await listManufacturer(offset, limit);
            if (response.body.data && response.body.isSuccessful) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<ManufacturerInfo[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<ManufacturerInfo[]>(isSuccessful, message);
            }
        }
    });

    router.get('/api/listDeletedManufacturer', checkSupervisorSession, async (ctx) => {
        if (!is_number(ctx.request.query.offset) || !is_number(ctx.request.query.limit)) {
            ctx.body = invalidParameter();
        } else {
            let {offset, limit} = ctx.request.query;
            offset = Number(offset);
            limit = Number(limit);
            const {userID} = ctx.session!.data!;
            const response = await listDeletedManufacturer(offset, limit, userID);
            if (response.body.data && response.body.isSuccessful) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<ManufacturerInfo[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<ManufacturerInfo[]>(isSuccessful, message);
            }
        }
    });

    router.get('/api/listManufacturerOnID', checkDvSupSession, async (ctx) => {
        if (!is_number(ctx.request.query.offset) || !is_number(ctx.request.query.limit) || !is_number(ctx.request.query.userID)) {
            ctx.body = invalidParameter();
        } else {
            let {offset, limit, userID} = ctx.request.query;
            offset = Number(offset);
            limit = Number(limit);
            userID = Number(userID);
            const sessionUserID = (ctx.session!.data!).userID;
            const response = await listManufacturerOnID(offset, limit, userID, sessionUserID);
            if (response.body.data && response.body.isSuccessful) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<ManufacturerInfo[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<ManufacturerInfo[]>(isSuccessful, message);
            }
        }
    });

    router.get('/api/searchManufacturer', async (ctx) => {
        if (typeof ctx.request.query.keyword !== 'string') {
            ctx.body = invalidParameter();
        } else {
            const {keyword} = ctx.request.query;
            const response = await searchManufacturer(keyword);
            if (response.body.data && response.body.isSuccessful) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<ManufacturerInfo[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<ManufacturerInfo[]>(isSuccessful, message);
            }
        }
    });

    router.get('/api/searchDeletedManufacturer', checkSupervisorSession, async (ctx) => {
        if (typeof ctx.request.query.keyword !== 'string') {
            ctx.body = invalidParameter();
        } else {
            const {keyword} = ctx.request.query;
            const {userID} = ctx.session!.data!;
            const response = await searchDeletedManufacturer(keyword, userID);
            if (response.body.data && response.body.isSuccessful) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<ManufacturerInfo[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<ManufacturerInfo[]>(isSuccessful, message);
            }
        }
    });

    router.get('/api/queryManufacturer', async (ctx) => {
        if (!is_number(ctx.request.query.manufacturerInfoID)) {
            ctx.body = invalidParameter();
        } else {
            let {manufacturerInfoID} = ctx.request.query;
            manufacturerInfoID = Number(manufacturerInfoID);
            const response = await queryManufacturer(manufacturerInfoID);
            if (response.body.data && response.body.isSuccessful) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<ManufacturerInfo>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<ManufacturerInfo>(isSuccessful, message);
            }
        }
    });

    router.get('/api/queryManufacturerInfoAmount', async (ctx) => {
        const response = await queryManufacturerInfoAmount();
        const {isSuccessful, message, data} = response.body;
        ctx.body = new ResponseBody<number>(isSuccessful, message, data);
    });

    router.get('/api/queryDeletedManufacturerInfoAmount', checkSupervisorSession, async (ctx) => {
        const {userID} = ctx.session!.data!;
        const response = await queryDeletedManufacturerInfoAmount(userID);

        const {isSuccessful, message, data} = response.body;
        ctx.body = new ResponseBody<number>(isSuccessful, message, data);

    });

    router.get('/api/queryManufacturerInfoAmountOnID', async (ctx) => {
        if (!is_number(ctx.request.query.userID)) {
            ctx.body = invalidParameter();
        } else {
            let {userID} = ctx.request.query;
            userID = Number(userID);
            const response = await queryManufacturerInfoAmountInfoOnID(userID);
            const {isSuccessful, message, data} = response.body;
            ctx.body = new ResponseBody<number>(isSuccessful, message, data);
        }
    });

    router.post('/api/userJoinManufacturer', checkDvSupSession, async (ctx) => {
        if (typeof ctx.request.body.manufacturerID !== 'number') {
            ctx.body = invalidParameter();
        } else {
            const {manufacturerID} = ctx.request.body;
            const sessionID = (ctx.session!.data!).userID;
            const response = await userJoinManufacturer(manufacturerID, sessionID);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody<void>(isSuccessful, message);
        }
    });

    router.post('/api/userLeaveManufacturer', checkDvSupSession, async (ctx) => {
        if (typeof ctx.request.body.manufacturerID !== 'number') {
            ctx.body = invalidParameter();
        } else {
            const {manufacturerID} = ctx.request.body;
            const sessionID = (ctx.session!.data!).userID;
            const response = await userLeaveManufacturer(manufacturerID, sessionID);
            const {isSuccessful, message} = response.body;
            ctx.body = new ResponseBody<void>(isSuccessful, message);
        }
    });


    router.get('/api/searchManufacturerOnID', checkDvSupSession, async (ctx) => {
        if (typeof ctx.request.query.keyword !== 'string') {
            ctx.body = invalidParameter();
        } else {
            const {keyword} = ctx.request.query;
            const {userID} = ctx.session!.data!;
            const response = await searchManufacturerOnID(keyword, userID);
            if (response.body.data && response.body.isSuccessful) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<ManufacturerInfo[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<ManufacturerInfo[]>(isSuccessful, message);
            }
        }
    });

    router.get('/api/searchManufacturerNotJoin', checkDvSupSession, async (ctx) => {
        if (typeof ctx.request.query.keyword !== 'string') {
            ctx.body = invalidParameter();
        } else {
            const {keyword} = ctx.request.query;
            const {userID} = ctx.session!.data!;
            const response = await searchManufacturerNotJoin(keyword, userID);
            if (response.body.data && response.body.isSuccessful) {
                const {isSuccessful, message, data} = response.body;
                ctx.body = new ResponseBody<ManufacturerInfo[]>(isSuccessful, message, data);
            } else {
                const {isSuccessful, message} = response.body;
                ctx.body = new ResponseBody<ManufacturerInfo[]>(isSuccessful, message);
            }
        }
    });

    router.get('/api/getAreaName', async (ctx) => {
        if (!is_number(ctx.request.query.areaCode) && typeof ctx.request.query.areaCode !== 'string') {
            ctx.body = invalidParameter();
        } else {
            const {areaCode} = ctx.request.query;
            let address = utilx.changeAddressCodeToAddress(areaCode);
            if (address === "") {
                ctx.body = new ResponseBody<string>(false, 'invalidCode');
            } else {
                ctx.body = new ResponseBody<string>(true, 'getAreaNameSuccess', address);
            }
        }
    });

}