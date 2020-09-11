import {ResponseServer} from "../instances/responseServer";
import {ContactUs} from "../Class/ContactUs";
import {RelatedLink} from "../Class/RelatedLink";
import {File} from "formidable";
import {
    modifyBannerPicture as modifyBannerPictureDB, modifyPlatformOverview as modifyPlatformOverviewDB,
    addSlidesPicture as addSlidesPictureDB, deleteSlidePicture as deleteSlidePictureDB,
    modifyRelatedLinks as modifyRelatedLinkDB, modifyFooter as modifyFooterDB, modifyContactUs as modifyContactUsDB
} from '../database/SiteSettingDatabase';


export async function modifyBannerPicture(picture: File): Promise<ResponseServer<void>> {//服务层修改banner图片
    const DBResponse = await modifyBannerPictureDB(picture);
    return new ResponseServer<void>(DBResponse);
}

export async function modifyFooter(article: string): Promise<ResponseServer<void>> {
    const DBResponse = await modifyFooterDB(article);
    return new ResponseServer<void>(DBResponse);
}

export async function modifyPlatformOverview(article: string): Promise<ResponseServer<void>> {
    const DBResponse = await modifyPlatformOverviewDB(article);
    return new ResponseServer<void>(DBResponse);
}

export async function modifyRelatedLinks(RelatedLink: RelatedLink[]): Promise<ResponseServer<void>> {
    const DBResponse = await modifyRelatedLinkDB(RelatedLink);
    return new ResponseServer<void>(DBResponse);
}

export async function addSlidePicture(picture: File, pictureDescribe: string): Promise<ResponseServer<void>> {
    const DBResponse = await addSlidesPictureDB(picture, pictureDescribe);
    return new ResponseServer<void>(DBResponse);
}

export async function deleteSlidePicture(pictureID: number): Promise<ResponseServer<void>> {
    const DBResponse = await deleteSlidePictureDB(pictureID);
    return new ResponseServer<void>(DBResponse);
}

export async function modifyContactUs(ContactU: ContactUs): Promise<ResponseServer<void>> {
    const DBResponse = await modifyContactUsDB(ContactU);
    return new ResponseServer<void>(DBResponse);
}