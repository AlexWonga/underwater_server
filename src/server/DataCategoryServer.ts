import {DataType} from "../Enum/DataType";
import {ResponseServer} from "../instances/responseServer";
import {DataCategory} from "../Class/DataCategory";
import {
    addDataCategory as addDataCategoryDB,
    modifyDataCategory as modifyDataCategoryDB,
    deleteDataCategory as deleteDataCategoryDB,
    deleteDateCategoryRecover as deleteDateCategoryRecoverDB,
    listDataCategory as listDataCategoryDB,
    listDeletedDataCategory as listDeletedDataCategoryDB,
    searchCategory as searchCategoryDB,
    searchDeletedCategory as searchDeletedCategoryDB,
    queryCategory as queryCategoryDB,
    queryCategoryOptions as queryCategoryOptionsDB,
    queryCategoryAmount as queryCategoryAmountDB,
    queryDeletedCategoryAmount as queryDeletedCategoryAmountDB,
} from "../database/DataCategoryDatabase";
import {checkDvSupSession, checkSupervisorSession} from "./checkPermission";
import {ResponseDB} from "../instances/ResponseDB";
import {permissionDeny} from "./permissionDeny";


export async function addDataCategory(dataCategoryName: string, dataType: DataType, sessionUserID: number, selectList?: string[]): Promise<ResponseServer<void>> {
    const res = await checkSupervisorSession(sessionUserID);
    if (res.body.isSuccessful) {
        const response = await addDataCategoryDB(dataCategoryName, dataType, selectList);
        return new ResponseServer<void>(response);
    } else {
        return new ResponseServer<void>(
            new ResponseDB<void>(false, 'invalidCall')
        );
    }
}

export async function modifyDataCategory(categoryID: number, sessionUserID: number, dataCategoryName?: string, selectList?: string[]): Promise<ResponseServer<void>> {
    const res = await checkSupervisorSession(sessionUserID);
    if (res.body.isSuccessful) {
        const response = await modifyDataCategoryDB(categoryID, dataCategoryName, selectList);
        return new ResponseServer<void>(response);
    } else {
        return new ResponseServer<void>(
            new ResponseDB<void>(false, 'invalidCall')
        );
    }
}

export async function deleteDataCategory(dataCategoryID: number, sessionUserID: number): Promise<ResponseServer<void>> {
    const res = await checkSupervisorSession(sessionUserID);
    if (res.body.isSuccessful) {
        const response = await deleteDataCategoryDB(dataCategoryID);
        return new ResponseServer<void>(response);
    } else {
        return new ResponseServer<void>(
            new ResponseDB<void>(false, 'invalidCall')
        );
    }
}

export async function deletedDataCategoryRecover(dataCategoryID: number, sessionUserID: number): Promise<ResponseServer<void>> {
    const res = await checkSupervisorSession(sessionUserID);
    if (res.body.isSuccessful) {
        const response = await deleteDateCategoryRecoverDB(dataCategoryID);
        return new ResponseServer<void>(response);
    } else {
        return new ResponseServer<void>(
            new ResponseDB<void>(false, 'invalidCall')
        );
    }
}

export async function listDataCategory(offset: number, limit: number, sessionUserID: number): Promise<ResponseServer<DataCategory[]>> {
    const res = await checkDvSupSession(sessionUserID);
    if (res.body.isSuccessful) {
        const response = await listDataCategoryDB(offset, limit);
        return new ResponseServer<DataCategory[]>(response);
    } else {
        return new ResponseServer<DataCategory[]>(
            new ResponseDB<DataCategory[]>(false, 'invalidCall')
        );
    }
}

export async function listDeletedCategory(offset: number, limit: number, sessionUserID: number): Promise<ResponseServer<DataCategory[]>> {
    const res = await checkSupervisorSession(sessionUserID);
    if (res.body.isSuccessful) {
        const response = await listDeletedDataCategoryDB(offset, limit);
        return new ResponseServer<DataCategory[]>(response);
    } else {
        return new ResponseServer<DataCategory[]>(
            new ResponseDB<DataCategory[]>(false, 'invalidCall')
        );
    }
}

export async function searchCategory(keyword: string, sessionUserID: number): Promise<ResponseServer<DataCategory[]>> {
    if (keyword === '') {
        return new ResponseServer<DataCategory[]>(
            new ResponseDB(false, 'invalidParameter')
        );
    }
    const res = await checkSupervisorSession(sessionUserID);
    if (res.body.isSuccessful) {
        const response = await searchCategoryDB(keyword);
        return new ResponseServer<DataCategory[]>(response);
    } else {
        return new ResponseServer<DataCategory[]>(
            new ResponseDB<DataCategory[]>(false, 'invalidCall')
        );
    }
}

export async function searchDeletedCategory(keyword: string, sessionUserID: number): Promise<ResponseServer<DataCategory[]>> {
    if (keyword === '') {
        return new ResponseServer<DataCategory[]>(
            new ResponseDB(false, 'invalidParameter')
        );
    }
    const res = await checkSupervisorSession(sessionUserID);
    if (res.body.isSuccessful) {
        const response = await searchDeletedCategoryDB(keyword);
        return new ResponseServer<DataCategory[]>(response);
    } else {
        return new ResponseServer<DataCategory[]>(
            new ResponseDB<DataCategory[]>(false, 'invalidCall')
        );
    }
}

export async function queryCategory(categoryID: number): Promise<ResponseServer<DataCategory>> {
    const response = await queryCategoryDB(categoryID);
    return new ResponseServer<DataCategory>(response);
}

export async function queryCategoryOptions(categoryID: number, sessionUserID: number): Promise<ResponseServer<string[]>> {
    const res = await checkSupervisorSession(sessionUserID);
    if (res.body.isSuccessful) {
        const response = await queryCategoryOptionsDB(categoryID);
        return new ResponseServer<string[]>(response);
    } else {
        return new ResponseServer<string[]>(
            new ResponseDB<string[]>(false, 'invalidCall')
        );
    }
}

export async function queryCategoryAmount() {
    const response = await queryCategoryAmountDB();
    return new ResponseServer<number>(response);
}

export async function queryDeletedCategoryAmount(sessionUserID: number) {
    const res = await checkSupervisorSession(sessionUserID);
    if (res.body.isSuccessful && res.body.data) {
        const response = await queryDeletedCategoryAmountDB();
        return new ResponseServer<number>(response);
    } else {
        return permissionDeny<number>();
    }
}