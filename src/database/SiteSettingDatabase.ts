import {Banner, Footer, PlatformOverview, RelatedLinks, SlidePicture, ContactUs} from "./Models/SiteSettingModel";
import {ResponseDB} from "../instances/ResponseDB";
import {File} from "formidable";
import {utilx} from "../instances/utilx";
import * as path from "path"
import {ContactUs as ContactUsModel} from "../Class/ContactUs";
import {SlidePicture as SlidePictureModel} from "../Class/SlidePicture";
import {RelatedLink as RelatedLinkModel} from "../Class/RelatedLink";

import * as fse from 'fs-extra';

const dstPath = '/files/siteSetting';//相对路径
import {sequelize} from "./DB";
import {rootDirPath} from "../config/filePaths";
import {log4js} from "../instances/logger";
const logger = log4js.getLogger();

export async function modifyBannerPicture(picture: File): Promise<ResponseDB<void>> {//增加首页banner图片
    const t = await sequelize.transaction();//创建事务保存在变量中
    try {
        const pictureName = utilx.getFileName(picture.path);
        await fse.move(picture.path, path.join(rootDirPath, dstPath, pictureName));//文件移动到指定文件夹
        await Banner.destroy({
            where: {},
            truncate: true,
        })//清空banner表
        await Banner.create({//增加新路径
            picturePath: path.join(rootDirPath, dstPath, pictureName),
        });
        await t.commit();//事务提交
        return new ResponseDB<void>(true, 'bannerAddSuccess');//成功时
    } catch (e) {
        logger.error(e);
        await t.rollback();//回滚
        return new ResponseDB<void>(false, 'bannerAddFail');
    }
}

export async function queryBannerPicture(): Promise<ResponseDB<string>> {//发送首页banner图片
    const BannerA = await Banner.findOne({//找到一个Banner图片
        //attributes:['picturePath'],
    });
    //console.log(BannerA);
    if (BannerA === null) {
        return new ResponseDB<string>(true, "queryBannerSuccess", '');//若数据库为空，那么返回空字符串
    } else {
        const {picturePath} = BannerA;

        return new ResponseDB<string>(true, "queryBannerSuccess", picturePath);
    }

}


// (async function CreateBanner(){
//     try {
//         await Banner.sync({ force: true });
//         const banner = await Banner.create({
//             id: 1,
//             picturePath: 'E:/myPicture',
//         });
//         console.log(banner.toJSON());
//     }catch (e) {
//         await ErrorCatch(e);
//     }
// })();


export async function modifyPlatformOverview(Article: string): Promise<ResponseDB<void>> {//修改平台概况相关信息
    const t = await sequelize.transaction();
    try {
        const [article] = utilx.clear(Article);//清洗
        await PlatformOverview.destroy({
            where: {},
            truncate: true,
        });
        await PlatformOverview.create({
            overviewInfo: article
        });
        await t.commit();
        return new ResponseDB<void>(true, 'modifyPlatformOverviewSuccess');
    } catch (e) {
        await t.rollback();
        return new ResponseDB<void>(false, 'modifyPlatformFail');
    }
}

export async function queryPlatformOverview(): Promise<ResponseDB<string>> {//发送首页平台概况相关信息
    const Overview = await PlatformOverview.findOne({
        attributes: ['overviewInfo'],

    });
    if (Overview === null) {
        return new ResponseDB<string>(true, "queryPlatformOverviewSuccess", '');
    } else {
        const {overviewInfo} = Overview;
        return new ResponseDB<string>(true, "queryPlatformOverviewSuccess", overviewInfo);
    }
}

// (async ()=>{
//     await PlatformOverview.sync();
//     await PlatformOverview.create({
//         OverviewInfo:'the website is a website',
//     })
// })()
export async function addSlidesPicture(picture: File, PictureDescribe: string): Promise<ResponseDB<void>> {//添加首页轮播图(一次传一张)的数据库操作
    const t = await sequelize.transaction();
    try {
        const pictureName = picture.name;
        const [pictureDescribe] = utilx.clear(PictureDescribe);
        await fse.move(picture.path, path.join(rootDirPath, dstPath, pictureName));
        await SlidePicture.create({
            picturePath: path.join(rootDirPath, dstPath, pictureName),
            pictureDescribe: pictureDescribe,
        });
        await t.commit();
        return new ResponseDB<void>(true, 'slidesAddSuccess');
    } catch (e) {
        await t.rollback();
        return new ResponseDB<void>(false, 'addSlidesPictureFail');
    }
}

export async function querySlidePictures(): Promise<ResponseDB<SlidePictureModel[]>> {//发送首页轮播图的数据库操作
    const SlidePictures = await SlidePicture.findAll({
        attributes: ['ID', 'picturePath', 'pictureDescribe'],

    });
    //console.log(SlidePictures);
    if (SlidePictures === null) {
        return new ResponseDB<SlidePictureModel[]>(true, 'querySlidePictureSuccess');
    } else {
        let result: SlidePictureModel[] = [];
        SlidePictures.forEach((item) => {
            const {ID, picturePath, pictureDescribe} = item;
            result.push(new SlidePictureModel(ID, picturePath, pictureDescribe));
        })
        return new ResponseDB<SlidePictureModel[]>(true, "querySlidePictureSuccess", result);
    }
}

//querySlidePictures();
// (async ()=> {
//     await SlidePicture.sync({force:true});
//     await SlidePicture.bulkCreate([
//         {
//             pictureID: 1,
//             picturePath: "D:/slidePicture1",
//             pictureDescribe: 'a',
//         },
//         {
//             pictureID: 2,
//             picturePath: "D:/slidePicture2",
//             pictureDescribe: 'b',
//         },
//         {
//             pictureID: 3,
//             picturePath: "D:/slidePicture3",
//             pictureDescribe: 'c'
//         }
//     ]).then(() => {
//         return SlidePicture.findAll({
//
//         });
//     }).then((slides) => {
//         console.log(slides);
//     });
// })();
export async function deleteSlidePicture(pictureID: number): Promise<ResponseDB<void>> {//删除指定首页轮播图的数据库操作
    const t = await sequelize.transaction();
    try {
        const SlidePic = await SlidePicture.findOne({
            where: {
                ID: pictureID
            },
        });

        if (SlidePic !== null) {
            const {picturePath} = SlidePic;
            if(await fse.pathExists(picturePath)) {
                await fse.remove(picturePath);
            }
            await SlidePic.destroy();
            await t.commit();
            return new ResponseDB<void>(true, 'slidePictureDeleted');
        } else {
            await t.rollback();
            return new ResponseDB<void>(false, 'deleteFailed');
        }
    } catch (e) {
        console.log(e);
        await t.rollback();
        return new ResponseDB<void>(false, 'deleteFailed');
    }
}

export async function queryRelatedLinks(): Promise<ResponseDB<RelatedLinkModel[]>> {//发送相关链接（有顺序）的数据库操作
    const Links = await RelatedLinks.findAll({
        attributes: ['link', 'linkName', 'sequence'],

    });
    if (Links === null) {
        return new ResponseDB<RelatedLinkModel[]>(true, "queryRelatedLinksSuccess");
    } else {
        let result: RelatedLinkModel[] = [];
        Links.forEach((item) => {
            const {link, linkName, sequence} = item;
            result.push(new RelatedLinkModel(link, linkName, sequence));
        })
        return new ResponseDB<RelatedLinkModel[]>(true, "queryRelatedLinksSuccess", result);
    }
}

// queryRelatedLink().then((response)=>{
//     console.log(response);
// })
// (async ()=> {
//     await RelatedLink.sync({force:true});
//     await RelatedLink.bulkCreate([
//         {
//             linkID:1,
//             linkName:'1',
//             link:'1',
//             sequence:1,
//         },
//         {
//             linkID:2,
//             linkName:'2',
//             link:'2',
//             sequence:2,
//         },
//         {
//             linkID:3,
//             linkName:'3',
//             link:'3',
//             sequence:3,
//         },
//     ]);
// })()
export async function modifyRelatedLinks(RelatedLinkList: RelatedLinkModel[]): Promise<ResponseDB<void>> {//修改相关链接的数据库操作（先删除原来的表项，再修改为新的表项）
    const t = await sequelize.transaction();
    try {
        await RelatedLinks.destroy({
            where: {},
            truncate: true,
        });
        await RelatedLinks.bulkCreate(RelatedLinkList);
        await t.commit();
        return new ResponseDB<void>(true, 'modifyRelatedLinksSuccess');
    } catch (e) {
        await t.rollback();
        return new ResponseDB<void>(false, 'modifyRelatedLinksFail');
    }
}

export async function modifyFooter(Article: string): Promise<ResponseDB<void>> {//修改页脚的数据库操作
    const t = await sequelize.transaction();
    try {
        const [article] = utilx.clear(Article);//页脚富文本清理
        await Footer.destroy({
            where: {},
            truncate: true,
        });
        Footer.create({
            richTextInfo: article,
        })
        await t.commit();
        return new ResponseDB<void>(true, 'modifyFooterSuccess');
    } catch (e) {
        await t.rollback();
        return new ResponseDB<void>(false, 'modifyFooterFail');
    }
}

export async function queryFooter(): Promise<ResponseDB<string>> {//发送页脚的数据库操作

    const FooterA = await Footer.findOne({
        // attributes:[
        //     'RichTextInfo'
        // ],

    });
    if (FooterA === null) {
        return new ResponseDB<string>(true, "queryFooterSuccess", '');
    } else {
        const {richTextInfo} = FooterA;
        //console.log(RichTextInfo);
        return new ResponseDB<string>(true, "queryFooterSuccess", richTextInfo);
    }

}

//queryFooter();
// (async ()=> {
//     await Footer.sync({force:true});
//     await Footer.create({
//         RichTextInfo: '123',
//     })
// })()
export async function modifyContactUs(ContactU: ContactUsModel): Promise<ResponseDB<void>> {//修改联系我们的数据库操作
    const t = await sequelize.transaction();
    try {
        const [contactWay, siteProfile] = utilx.clear(ContactU.contactWay, ContactU.siteProfile);//联系我们数据清理
        await ContactUs.destroy({
            where: {},
            truncate: true,
        });
        await ContactUs.create({
            contactWay: contactWay,
            siteProfile: siteProfile,
        });
        await t.commit();
        return new ResponseDB<void>(true, 'modifyContactUsSuccess');
    } catch (e) {
        await t.rollback();
        throw e;
    }
}

export async function queryContactUs(): Promise<ResponseDB<ContactUsModel>> {//发送联系我们的数据库操作
    try {
        const ContactU = await ContactUs.findOne({
            attributes: [
                'contactWay', 'siteProfile'
            ],

        });
        if (ContactU === null) {
            const result: ContactUsModel = new ContactUsModel("", "");
            return new ResponseDB<ContactUsModel>(true, "queryContactUsSuccess", result);
        } else {
            const {contactWay, siteProfile} = ContactU;
            const result: ContactUsModel = new ContactUsModel(contactWay, siteProfile);
            return new ResponseDB<ContactUsModel>(true, "queryContactUsSuccess", result);
        }
    } catch (e) {
        throw e;
    }
}

// (async ()=>{
//    await ContactUs.sync({force:true});
//    await ContactUs.create({
//        'siteProfile':'hi',
//        'contactWay':'hello',
//    })
// })()
