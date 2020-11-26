import {
    queryBannerPicture as queryBannerPictureDB, queryFooter as queryFooterDB,
    queryPlatformOverview as queryPlatformOverviewDB, queryContactUs as queryContactUsDB,
    queryRelatedLinks as queryRelatedLinkDB, querySlidePictures as querySlidePicturesDB
} from "../database/SiteSettingDatabase";
import {ContactUs} from "../Class/ContactUs";
import {SlidePicture} from "../Class/SlidePicture";
import {RelatedLink} from "../Class/RelatedLink";
import {ResponseServer} from "../instances/ResponseServer";

export async function queryBannerPicture(): Promise<ResponseServer<string>> {
    const DBResponse = await queryBannerPictureDB();
    return new ResponseServer<string>(DBResponse);
}

export async function queryFooter(): Promise<ResponseServer<string>> {
    const DBResponse = await queryFooterDB();
    //console.log(DBResponse);
    return new ResponseServer<string>(DBResponse);
}

export async function queryContactUs(): Promise<ResponseServer<ContactUs>> {
    const DBResponse = await queryContactUsDB();
    return new ResponseServer<ContactUs>(DBResponse);
}

export async function querySlidePictures(): Promise<ResponseServer<SlidePicture[]>> {
    const DBResponse = await querySlidePicturesDB();
    return new ResponseServer<SlidePicture[]>(DBResponse);
}

export async function queryPlatformOverview(): Promise<ResponseServer<string>> {
    const DBResponse = await queryPlatformOverviewDB();
    return new ResponseServer<string>(DBResponse);
}

export async function queryRelatedLinks(): Promise<ResponseServer<RelatedLink[]>> {
    const DBResponse = await queryRelatedLinkDB();
    //console.log(DBResponse);
    return new ResponseServer<RelatedLink[]>(DBResponse);
}

//queryRelatedLinks();
