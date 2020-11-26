import {File} from "formidable";
import {checkDvSupSession} from "./checkPermission";
import {permissionDeny} from "./permissionDeny";
import {invalidParameter} from "./invalidParameter";
// import {twoDimensionalData,twoDimensionalBody} from "../interface/twoDiimensional";
import {ResponseServer} from "../instances/ResponseServer";
import xlsx from "xlsx";
import {
    uploadTwoDimensionalData as uploadTwoDimensionalDataDB,
    deleteTwoDimensionalData as deleteTwoDimensionalDataDB,
} from "../database/TwoDimensionalData";
import {twoDimensionalBody} from "../interface/twoDiimensional";

import is_number from "is-number";


export async function uploadTwoDimensionalData(file: File, deviceID: number, categoryID: number, sessionUserID: number): Promise<ResponseServer<void>> {
    const res = await checkDvSupSession(sessionUserID);
    if (res.body.data && res.body.isSuccessful) {
        const workBook = await xlsx.readFile(file.path);
        let sheetNames = workBook.SheetNames;
        let workSheet = workBook.Sheets[sheetNames[0]];
        const rangeA = "A1";
        const rangeB = "B1";
        const rowName = workSheet[rangeA].v;
        const columnName = workSheet[rangeB].v;
        if (typeof rowName !== 'string' || typeof columnName !== "string") {
            return invalidParameter<void>();
        } else {
            let result: twoDimensionalBody = {rowName: rowName, columnName: columnName, data: []};
            let csv = xlsx.utils.sheet_to_csv(workSheet);
            let data = csv.split('\n');
            for (let i = 1; i < data.length-1; i++) {
                let numData = data[i].split(',');
                if (!is_number(numData[0]) || !is_number(numData[1])) {
                    return invalidParameter<void>();
                } else {
                    result.data.push({row: Number(numData[0]), column: Number(numData[1])});
                }
            }
            let uploadData = JSON.stringify(result);
            const response = await uploadTwoDimensionalDataDB(uploadData, deviceID, categoryID);
            return new ResponseServer<void>(response);
        }
    } else {
        return permissionDeny<void>();
    }
}

export async function deleteTwoDimensionalData(deviceID: number, categoryID: number): Promise<ResponseServer<void>> {
    const response = await deleteTwoDimensionalDataDB(categoryID, deviceID);
    return new ResponseServer<void>(response);
}






