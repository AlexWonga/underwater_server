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
                flag = checkAddressCode(district[i], addressCode);
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

    let changeAddressCodeToAddress = (addressCode: string): string => { //将地址代码转换为地址
        let preAddressCode = addressCode.slice(0, 2)
        let address = '';
        for (let i = 0; i < district.length; i++) {
            let preCode = district[i].value.slice(0, 2);
            if (preAddressCode === preCode) {
                address = addressCodeReflectToAddress(district[i], addressCode, address);
            }
        }
        return address;
    }


    let getTodayString = (): string => {
        return moment().format("YYYYMMDD");
    }

    let absoluteToNetwork = (absolutePath: string): string => {
        return (absolutePath.replace(rootDirPath + '\\files', baseURL)).replace(/\\/g, "/");
    }
    return {
        changeAddressCodeToAddress,
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


function checkAddressCode(item: IAddress, addressCode: string) {
    if (item.value === addressCode) {
        return true;
    } else {
        if (item.children) {
            let flag: boolean = false;
            for (let i = 0; i < item.children.length; i++) {
                flag = checkAddressCode(item.children[i], addressCode);
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

let addressCodeReflectToAddress = (item:IAddress,addressCode:string,address:string):string => {
    if(item.value === addressCode){
        address += item.label;
        return address;
    } else {
        if(item.children){
            let newAddress = "";
            address += item.label;
            for(let i=0;i<item.children.length;i++){
                newAddress = addressCodeReflectToAddress(item.children[i],addressCode,address);
                if(newAddress !== address){
                    address = newAddress;
                    break;
                } else {
                    newAddress = "";
                }
            }
            if(newAddress === ""){
                address = address.slice(0,address.indexOf(item.label));
                return address;
            } else {
                return address;
            }
        } else {
            return address;
        }
    }
}





