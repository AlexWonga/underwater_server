import {Article} from "../database/Models/ArticleModel";
import {CategoryOptions, DataCategory, DataType} from "../database/Models/DataCategoryModel";
import {Device, DeviceFile, DevicePicture, DevicePicture3D} from "../database/Models/DeviceModel";
import {Manufacturer, ManufacturerUserInfo} from "../database/Models/ManufacturerModel";
import {
    Banner,
    ContactUs,
    Footer,
    PlatformOverview,
    RelatedLinks,
    SlidePicture
} from "../database/Models/SiteSettingModel";
import {UserInfo} from "../database/Models/UserSupervisorModel";
import {DeviceData} from "../database/Models/DeviceDataModel";
import {SequelizeOptions} from "sequelize-typescript";



const DatabaseConfig:SequelizeOptions = Object.freeze({
    // host: 'cdb-dooljax2.cd.tencentcdb.com',
    // port:10091,
    host: 'localhost',
    port:3306,
    dialect: 'mysql',
    define: {
        charset: 'utf8',
    },
    timezone:"+08:00",

    // host: 'localhost',
    // dialect: 'postgres',
    // define: {
    //     charset: 'utf8',
    // },
    models: [Article, DataCategory, DataType, Device, DevicePicture, DeviceFile, DevicePicture3D,
        Manufacturer, ManufacturerUserInfo, Banner, SlidePicture, ContactUs, RelatedLinks, PlatformOverview, Footer,
        UserInfo, DeviceData, CategoryOptions]

});

export default DatabaseConfig;