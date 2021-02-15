import {ResponseDB} from "../Instances/ResponseDB";
import {Manufacturer, ManufacturerUserInfo,} from './Models/ManufacturerModel'
import {ManufacturerInfo} from "../Class/ManufacturerInfo";
import {Op} from 'sequelize';
import {sequelize} from "./DB";

export async function addManufacturer(manufacturerName: string, manufacturerTelephone: string, manufacturerIntroduction: string, manufacturerAddress: string, userID: number): Promise<ResponseDB<void>> {
    const t = await sequelize.transaction();
    try {
        const manufacturer = await Manufacturer.findOne({
            where: {
                manufacturerName: manufacturerName,
            }
        });
        if (manufacturer !== null) {
            return new ResponseDB<void>(false, 'duplicateManufacturerName');
        } else {
            const result = await Manufacturer.create({
                manufacturerName: manufacturerName,
                manufacturerAddress: manufacturerAddress,
                manufacturerTelephone: manufacturerTelephone,
                manufacturerIntroduction: manufacturerIntroduction,
            });
            const {ID} = result;
            const result2 = await ManufacturerUserInfo.create({
                userInfoID: userID,
                manufacturerID: ID,
            });
            if (result2) {
                await t.commit();
                return new ResponseDB<void>(true, 'addManufacturerSuccess');
            } else {
                await t.rollback();
                return new ResponseDB<void>(false, 'addManufacturerFailed');
            }
        }
    } catch (e) {
        await t.rollback();
        throw e;
    }
}

export async function modifyManufacturer(manufacturer: ManufacturerInfo): Promise<ResponseDB<void>> {
    const {manufacturerID, manufacturerName, manufacturerAddress, manufacturerTelephone, manufacturerIntroduction} = manufacturer;
    let tempManufacturer = await Manufacturer.findOne({
        where: {
            ID: manufacturerID,
            isInRecycleBin: false,
        },

    });
    if (tempManufacturer === null) {
        return new ResponseDB<void>(false, 'manufacturerNotExist');
    }
    if (tempManufacturer.manufacturerName !== manufacturerName) {
        const temp = await Manufacturer.findOne({
            where: {
                manufacturerName: manufacturerName,
            }
        });
        if (temp !== null) {
            return new ResponseDB<void>(false, 'duplicateManufacturerName');
        }
    }
    tempManufacturer.manufacturerName = manufacturerName;
    tempManufacturer.manufacturerAddress = manufacturerAddress;
    tempManufacturer.manufacturerTelephone = manufacturerTelephone;
    tempManufacturer.manufacturerIntroduction = manufacturerIntroduction;
    await tempManufacturer.save();
    return new ResponseDB<void>(true, 'modifyManufacturerSuccess');
}

export async function deleteManufacturer(manufacturerID: number): Promise<ResponseDB<void>> {
    let manufacturer = await Manufacturer.findOne({
        where: {
            ID: manufacturerID,
            isInRecycleBin: false,
        }
    });
    if (manufacturer === null) {
        return new ResponseDB<void>(false, 'manufacturerNotFound');
    } else {
        manufacturer.isInRecycleBin = true;
        await manufacturer.save();
        return new ResponseDB<void>(true, 'manufacturerDeleted');
    }
}

export async function deletedManufacturerRecover(manufacturerID: number): Promise<ResponseDB<void>> {
    let manufacturer = await Manufacturer.findOne({
        where: {
            ID: manufacturerID,
            isInRecycleBin: true,
        },

    });
    if (manufacturer === null) {
        return new ResponseDB<void>(false, 'manufacturerNotFound');
    } else {
        manufacturer.isInRecycleBin = false;
        await manufacturer.save();
        return new ResponseDB<void>(true, 'manufacturerRecovered');
    }
}

export async function listManufacturer(offset: number, limit: number): Promise<ResponseDB<ManufacturerInfo[]>> {
    const manufacturerList = await Manufacturer.findAll({
        where: {
            isInRecycleBin: false,
        },
        order: ['ID'],
        limit: limit,
        offset: offset,
        attributes: {exclude: ['isInRecycleBin']},

    });
    let result: ManufacturerInfo[] = [];
    manufacturerList.forEach((item) => {
        const {ID, manufacturerName, manufacturerAddress, manufacturerTelephone, manufacturerIntroduction} = item;
        result.push(new ManufacturerInfo(ID, manufacturerName, manufacturerAddress, manufacturerIntroduction, manufacturerTelephone));
    });
    return new ResponseDB<ManufacturerInfo[]>(true, 'listManufacturerInfoSuccess', result);
}

export async function listDeletedManufacturer(offset: number, limit: number): Promise<ResponseDB<ManufacturerInfo[]>> {
    const manufacturerList = await Manufacturer.findAll({
        where: {
            isInRecycleBin: true,
        },
        order: ['ID'],
        limit: limit,
        offset: offset,
        attributes: {exclude: ['isInRecycleBin']},

    });
    let result: ManufacturerInfo[] = [];
    manufacturerList.forEach((item) => {
        const {ID, manufacturerName, manufacturerAddress, manufacturerTelephone, manufacturerIntroduction} = item;
        result.push(new ManufacturerInfo(ID, manufacturerName, manufacturerAddress, manufacturerIntroduction, manufacturerTelephone));
    });
    return new ResponseDB<ManufacturerInfo[]>(true, 'listDeletedManufacturerInfoSuccess', result);
}

export async function searchManufacturer(keyword: string): Promise<ResponseDB<ManufacturerInfo[]>> {
    const manufacturerList = await Manufacturer.findAll({
        where: {
            isInRecycleBin: false,
            manufacturerName: {[Op.like]: '%' + keyword + '%'},
        },
        attributes: {exclude: ['isInRecycleBin']},
    });
    let result: ManufacturerInfo[] = [];
    manufacturerList.forEach((item) => {
        const {ID, manufacturerName, manufacturerAddress, manufacturerTelephone, manufacturerIntroduction} = item;
        result.push(new ManufacturerInfo(ID, manufacturerName, manufacturerAddress, manufacturerIntroduction, manufacturerTelephone));
    });
    return new ResponseDB<ManufacturerInfo[]>(true, 'searchManufacturerInfoSuccess', result);
}

export async function searchDeletedManufacturer(keyword: string): Promise<ResponseDB<ManufacturerInfo[]>> {
    const manufacturerList = await Manufacturer.findAll({
        where: {
            isInRecycleBin: true,
            manufacturerName: {[Op.like]: '%' + keyword + '%'},

        },
        attributes: {exclude: ['isInRecycleBin']},
    });
    let result: ManufacturerInfo[] = [];
    manufacturerList.forEach((item) => {
        const {ID, manufacturerName, manufacturerAddress, manufacturerTelephone, manufacturerIntroduction} = item;
        result.push(new ManufacturerInfo(ID, manufacturerName, manufacturerAddress, manufacturerIntroduction, manufacturerTelephone));
    });
    return new ResponseDB<ManufacturerInfo[]>(true, 'searchDeletedManufacturerInfoSuccess', result);
}

export async function queryManufacturer(ManufacturerInfoID: number): Promise<ResponseDB<ManufacturerInfo>> {
    const manufacturer = await Manufacturer.findOne({
        where: {
            ID: ManufacturerInfoID,
        },

    });
    if (manufacturer === null) {
        return new ResponseDB<ManufacturerInfo>(false, 'ManufacturerInfoNotFound');
    } else {
        const {ID, manufacturerName, manufacturerAddress, manufacturerIntroduction, manufacturerTelephone} = manufacturer;
        return new ResponseDB<ManufacturerInfo>(true, 'queryManufacturerInfoSuccess', new ManufacturerInfo(ID, manufacturerName, manufacturerAddress, manufacturerIntroduction, manufacturerTelephone));
    }
}

export async function queryManufacturerInfoAmount(): Promise<ResponseDB<number>> {
    const ManufacturerAmount = await Manufacturer.count({
        where: {
            isInRecycleBin: false,
        },
    });
    return new ResponseDB<number>(true, 'amountQuerySuccess', ManufacturerAmount);
}

export async function queryDeletedManufacturerInfoAmount(): Promise<ResponseDB<number>> {
    const ManufacturerAmount = await Manufacturer.count({
        where: {
            isInRecycleBin: true,
        },
    });
    return new ResponseDB<number>(true, 'amountQuerySuccess', ManufacturerAmount);
}


export async function isUserBelongToManufacturer(userID: number, manufacturerID: number): Promise<ResponseDB<void>> {
    const response = await ManufacturerUserInfo.findOne({
        where: {
            userInfoID: userID,
            manufacturerID: manufacturerID
        }
    });
    if (response !== null) {
        return new ResponseDB<void>(true, 'relationExist');
    } else {
        return new ResponseDB<void>(false, 'RelationNotExist');
    }
}

export async function userJoinManufacturer(userID: number, manufacturerID: number): Promise<ResponseDB<void>> {
    const relation = await ManufacturerUserInfo.findOne({
        where: {
            userInfoID: userID,
            manufacturerID: manufacturerID,
        }
    });
    if (!relation) {
        await ManufacturerUserInfo.create({
            userInfoID: userID,
            manufacturerID: manufacturerID,
        });
        return new ResponseDB<void>(true, 'JoinManufacturerSuccess');
    } else {
        return new ResponseDB<void>(false, 'relationAlreadyExist');
    }
}

export async function userLeaveManufacturer(userID: number, manufacturerID: number) {
    const relation = await ManufacturerUserInfo.findOne({
        where: {
            userInfoID: userID,
            manufacturerID: manufacturerID,
        }
    });
    if (relation) {
        await relation.destroy();
        return new ResponseDB<void>(true, 'leaveManufacturerSuccess');
    } else {
        return new ResponseDB<void>(false, 'relationNotFound');
    }
}

export async function listManufacturerOnID(offset: number, limit: number, userID: number): Promise<ResponseDB<ManufacturerInfo[]>> {
    const relations = await ManufacturerUserInfo.findAll({
        where: {
            userInfoID: userID,
        },
        offset: offset,
        order: ['userInfoID'],
        limit: limit,
    });
    if (relations) {
        let result: ManufacturerInfo[] = [];
        for (let i = 0; i < relations.length; i++) {
            const manufacturer = await Manufacturer.findOne({
                where: {
                    ID: relations[i].manufacturerID,
                    isInRecycleBin: false,
                }
            });
            if (manufacturer) {
                const {ID, manufacturerName, manufacturerAddress, manufacturerIntroduction, manufacturerTelephone} = manufacturer;
                result.push(new ManufacturerInfo(ID, manufacturerName, manufacturerAddress, manufacturerIntroduction, manufacturerTelephone));
            }
        }
        return new ResponseDB<ManufacturerInfo[]>(true, 'listDeletedManufacturerOnIDSuccess', result);
    } else {
        return new ResponseDB<ManufacturerInfo[]>(true, 'listDeletedManufacturerOnIDSuccess');
    }
}

export async function queryManufacturerInfoAmountInfoOnID(userID: number): Promise<ResponseDB<number>> {
    const relations = await ManufacturerUserInfo.count({
        where: {
            userInfoID: userID,
        },
        distinct: true,
    });
    return new ResponseDB<number>(true, 'queryManufacturerInfoAmountOnIDSuccess', relations);
}


export async function searchManufacturerOnID(keyword: string, userID: number): Promise<ResponseDB<ManufacturerInfo[]>> {
    const relationList = await ManufacturerUserInfo.findAll({
        where: {
            userInfoID: userID,
        }
    });
    let manufacturerIDList: number[] = [];
    if (relationList) {
        for (let i = 0; i < relationList.length; i++) {
            manufacturerIDList.push(relationList[i].manufacturerID);
        }
        const manufacturerList = await Manufacturer.findAll({
            where: {
                isInRecycleBin: false,
                manufacturerName: {[Op.like]: '%' + keyword + '%'},
            }
        });
        let result: ManufacturerInfo[] = [];
        manufacturerList.forEach((item) => {
            if (manufacturerIDList.includes(item.ID)) {
                const {ID, manufacturerName, manufacturerIntroduction, manufacturerTelephone, manufacturerAddress} = item;
                result.push(new ManufacturerInfo(ID, manufacturerName, manufacturerAddress, manufacturerIntroduction, manufacturerTelephone));
            }
        })
        return new ResponseDB<ManufacturerInfo[]>(true, 'searchSuccess', result);
    } else {
        return new ResponseDB<ManufacturerInfo[]>(false, 'noRelation');
    }
}


export async function searchManufacturerNotJoin(keyword: string, userID: number) {
    const relationList = await ManufacturerUserInfo.findAll({//获得用户的厂商关系
        where: {
            userInfoID: userID,
        }
    });
    let manufacturerIDList: number[] = [];//所有用户已经加入的厂商ID
    relationList.forEach((item) => {
        manufacturerIDList.push(item.manufacturerID);
    });
    const manufacturerList = await Manufacturer.findAll({//关键词搜索到的所有厂商
        where: {
            isInRecycleBin: false,
            manufacturerName: {[Op.like]: '%' + keyword + '%'},
        }
    });
    let result: ManufacturerInfo[] = [];
    manufacturerList.forEach((item) => {
        if (!manufacturerIDList.includes(item.ID)) {
            const {ID, manufacturerName, manufacturerIntroduction, manufacturerTelephone, manufacturerAddress} = item;
            result.push(new ManufacturerInfo(ID, manufacturerName, manufacturerAddress, manufacturerIntroduction, manufacturerTelephone));
        }
    });
    return new ResponseDB<ManufacturerInfo[]>(true, 'searchSuccess', result);
}