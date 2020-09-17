// import {rootDirPath} from "./src/config/filePaths";
// import path from "path";
// import * as fse from "fs-extra";
// import {utilx} from "./src/instances/utilx";
// import path from "path";
// import {baseURL} from "./src/config/baseUrl";
//
// const dstPath = '/files/siteSettings';//相对路径

// console.log(rootDirPath+"/files/siteSetting/upload_01bf0634bbab6b77b5f971128d0ecd6c.jpeg");
// (async ()=> {
//     await fse.move(rootDirPath+"/files/siteSetting/upload_c35265f06ee47218c888ad999730022a.jpeg", path.join(rootDirPath, dstPath, "upload_c35265f06ee47218c888ad999730022a.jpeg"));
// })()
//
// console.log(utilx.deviceAttachmentToNetwork("/home/wang/WebstormProjects/underwater_rear/files/deviceFiles/devicePicture/20200917/upload_ed665e517cde056f38fe93a69c95e00a.jpeg"))
// console.log(utilx.getFileName("/home/wang/WebstormProjects/underwater_rear/files/deviceFiles/devicePicture/20200917/upload_ed665e517cde056f38fe93a69c95e00a.jpeg"))
var fse = require ("fs-extra");
var path = require( "path");

var rootDirPath = path.resolve(__dirname,'..','..');
const a = path.join(rootDirPath,"files",'upload','upload_f56ca292a2dfa213cafbdd43570b0686.jpg');
const b = path.join(rootDirPath,"files",'upload_f56ca292a2dfa213cafbdd43570b0686.jpg');
fse.move(a,b);
