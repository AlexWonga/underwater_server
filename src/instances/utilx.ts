import is_number from "is-number";
import {IAddress} from "../interface/IAddress";
import {File} from "formidable";
import {district} from "../static/distrcit";
import moment from "moment";
import {baseURL} from "../config/baseUrl";
import {rootDirPath} from "../config/filePaths";

const createDOMPurify = require('dompurify');
const {JSDOM} = require('jsdom');

const win = new JSDOM('').window;
const DOMPurify = createDOMPurify(win);
const utilx = (function () {
    let checkPicture = (picture: File) => {
        let ext = picture.name.split('.');
        let suffix = ext[ext.length - 1];
        //console.log(suffix);
        return ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(suffix.toLowerCase()) !== -1;
    };

    // let checkAttachment = (file: File) => {
    //     let ext = file.name.split('.');
    //     let suffix = ext[ext.length - 1];
    //     //console.log(suffix);
    //     return ['rar', 'zip', '7z',].indexOf(suffix.toLowerCase()) !== -1;
    // }
    let checkAttachmentString = (fileString: string) => {
        let ext = fileString.split('.');
        let suffix = ext[ext.length - 1];
        //console.log(suffix);
        return ['rar', 'zip', '7z',].indexOf(suffix.toLowerCase()) !== -1;
    }

    let clear = (...s: string[]) => {
        const result = [];
        for (let i = 0; i < s.length; i++) {
            result.push(DOMPurify.sanitize(s[i]));
        }
        return result;
    }
    let getFileName = (path: string) => {
        let ext = path.split('\\');
        return ext[ext.length - 1];
    }

    let checkManufacturerAddress = (manufacturerAddress: string): string[] | null => {
        const address: string[] = manufacturerAddress.split(",");
        if (address.length != 2) {
            return null;
        } else if (!is_number(address[0])) {
            return null;
        } else {
            const addressCode = address[0];
            let flag: boolean = false;
            for (let i = 0; i < district.length; i++) {
                flag = recursion(district[i], addressCode);
                if (flag) {
                    break;
                } else {

                }
            }
            if (flag) {
                return address;
            } else {
                return null;
            }
        }
    }
    let getTodayString = (): string => {
        return moment().format("YYYYMMDD");
    }

    let absoluteToNetwork = (absolutePath: string): string => {
        return (absolutePath.replace(rootDirPath + '\\files', baseURL)).replace(/\\/g, "/");
    }
    return {
        absoluteToNetwork,
        getTodayString,
        checkAttachmentString,
        checkManufacturerAddress,
        checkPicture,
        // checkAttachment,
        clear,
        getFileName,
    }
}());
export {utilx};


function recursion(item: IAddress, addressCode: string) {
    if (item.value === addressCode) {
        return true;
    } else {
        if (item.children) {
            let flag: boolean = false;
            for (let i = 0; i < item.children.length; i++) {
                flag = recursion(item.children[i], addressCode);
                if (flag) {
                    return true;
                } else {

                }
            }
            return false;
        } else {
            return false;
        }
    }
}
