import {UserType} from "../Enum/UserType";
import {ArticleType} from '../Enum/ArticleType';
import {DataType} from "../Enum/DataType";


const checkType = (function () {
    let instanceOfUserType = function (object: any): boolean {//检查变量是不是属于UserType这个枚举类型的
        for (let item in UserType) {
            if (object === item) {
                return true;
            }
        }
        return false;
    }
    let instancesOfArticleType = function (object: any): boolean {
        for (let item in ArticleType) {
            if (object === item) {
                return true;
            }
        }
        return false;
    }
    let instanceOfDataType = function (object: any): boolean {
        for (let item in DataType) {
            if (object === item) {
                return true;
            }
        }
        return false;
    }
    let instanceOfDeviceDataList = function (object: any): boolean {
        if (!Array.isArray(object)) {
            return false;
        } else {
            for (let i = 0; i < object.length; i++) {
                if (typeof object[i].categoryID !== 'number' || typeof object[i].dataValue!=='string') {
                    return false;
                }
            }
            return true;
        }
    }
    let instanceOfManufacturerInfo = function (manufacturerInfo: any): boolean {
        const {ID, manufacturerName, manufacturerAddress, manufacturerIntroduction, manufacturerTelephone} = manufacturerInfo;
        return !(typeof ID !== 'number' || typeof manufacturerName !== 'string' || typeof manufacturerAddress !== 'string' || typeof manufacturerIntroduction !== 'string' || typeof manufacturerTelephone !== 'string');
    }
    let instanceOfArticleInfo = function (articleInfo:any):boolean{
        const {content,title,articleID} = articleInfo;
        return !(typeof (articleID) !== 'number' || (typeof title !== 'string' && title !== 'undefined') || (typeof content !== 'string' && typeof content !== 'undefined'));
    }
    return {
        instanceOfArticleInfo,
        instanceOfManufacturerInfo,
        instanceOfUserType,
        instancesOfArticleType,
        instanceOfDataType,
        instanceOfDeviceDataList,
    }
}());
export {checkType};
