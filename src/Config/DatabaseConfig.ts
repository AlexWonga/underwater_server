import {Article} from "../Database/Models/ArticleModel";
import {CategoryOptions, DataCategory, DataType} from "../Database/Models/DataCategoryModel";
import {Device, DeviceFile, DevicePicture, DevicePicture3D} from "../Database/Models/DeviceModel";
import {Manufacturer, ManufacturerUserInfo} from "../Database/Models/ManufacturerModel";
import {
    Banner,
    ContactUs,
    Footer,
    PlatformOverview,
    RelatedLinks,
    SlidePicture
} from "../Database/Models/SiteSettingModel";
import {UserInfo} from "../Database/Models/UserSupervisorModel";
import {DeviceData} from "../Database/Models/DeviceDataModel";
import {SequelizeOptions} from "sequelize-typescript";


const DatabaseConfig: SequelizeOptions = Object.freeze({
    // host: 'cdb-dooljax2.cd.tencentcdb.com',
    // port:10091,
    // // host: 'localhost',
    // // port:3306,
    // dialect: 'mysql',
    // define: {
    //     charset: 'utf8',
    // },
    // timezone:"+08:00",

    // host: 'localhost',
    // dialect: 'postgres',
    // define: {
    //     charset: 'utf8',
    // },
    // timezone:"+08:00",

    host: "47.98.161.140",
    dialect: "mysql",
    define: {
        charset: "utf8",
    },
    timezone: "+8:00",
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },

    models: [Article, DataCategory, DataType, Device, DevicePicture, DeviceFile, DevicePicture3D,
        Manufacturer, ManufacturerUserInfo, Banner, SlidePicture, ContactUs, RelatedLinks, PlatformOverview, Footer,
        UserInfo, DeviceData, CategoryOptions]

});

export default DatabaseConfig;