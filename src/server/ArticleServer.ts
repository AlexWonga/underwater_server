import {
    addArticle as addArticleDB,
    deleteArticle as deleteArticleDB,
    deletedArticleRecover as deletedArticleRecoverDB,
    listArticle as listArticleDB,
    listDeletedArticle as listDeletedArticleDB,
    modifyArticleInfo as modifyArticleInfoDB,
    queryArticle as queryArticleDB,
    queryArticleAmount as queryArticleAmountDB,
    searchArticleInfo as searchArticleInfoDB,
    searchDeletedArticleInfo as searchDeletedArticleInfoDB,
    queryArticleAmountOnID as queryArticleAmountOnIDDB,
    listArticleOnID as listArticleOnIDDB,
    queryDeletedArticleAmount as queryDeletedArticleAmountDB,
    searchArticleInfoOnID as searchArticleInfoOnIDDB,
    queryArticlePicturePath as queryArticlePicturePathDB,
} from "../database/ArticleDatabase";
import {Article} from "../Class/Article";
import {UserInfo} from "../Class/UserInfo";
import {ArticleType} from "../Enum/ArticleType";
import {UserType} from "../Enum/UserType";
import {ResponseServer} from "../instances/ResponseServer";
import {JSDOM} from 'jsdom';
import {queryUserInfo} from "../database/UserSupervisorDatabase";
import {ResponseDB} from "../instances/ResponseDB";
import {IArticle} from "../Class/IArticle";
import {checkDvSupSession, checkSupervisorSession} from "./checkPermission";
import {permissionDeny} from "./permissionDeny";
import {QueryArticle} from "../Class/QueryArticle";



export async function addArticle(title: string, articleType: ArticleType, content: string, sessionUserID: number): Promise<ResponseServer<void>> {
    const picturePath = extractPictureURL(content);
    const responseDB = await addArticleDB(title, articleType, content, sessionUserID, picturePath);//picturePath从content中提取
    return new ResponseServer<void>(responseDB);
}

function extractPictureURL(content: string): string {//从文章内容中提取第一个图片url
    let dom = new JSDOM(content);
    //console.log(dom);
    try {
        const imgList = dom.window.document.getElementsByTagName('img');
        return imgList[0].src;
    } catch (e) {
        return "";//如果整个内容都没有图片，那么返回空
    }
}


async function changeToNewArticle(articleID: number, title: string | undefined, content: string | undefined, authorID: number): Promise<Article> {
    //要将属性中的undefined去除掉，如果有content，要更改picture path，如果没有要保留原来的picture path
    let oldArticle = await queryArticleDB(articleID);
    if (content) {//如果有content，要更新picuture path
        let newPicturePath = extractPictureURL(content);
        let article = new IArticle(articleID, title, content, authorID, newPicturePath);
        let changedArticle = JSON.parse(JSON.stringify(article));
        return Object.assign(oldArticle.data, changedArticle);
    } else {
        let article: IArticle = new IArticle(articleID, title, content, authorID);
        let changedArticle = JSON.parse(JSON.stringify(article));
        return Object.assign(oldArticle.data, changedArticle);
    }

}

export async function modifyArticle(articleID: number, sessionUserID: number, newTitle?: string, newContent?: string): Promise<ResponseServer<void>> {
    const user = await queryUserInfo(sessionUserID);
    const article = await queryArticleDB(articleID);
    if (article.data) {
        let newArticle = await changeToNewArticle(articleID, newTitle, newContent, sessionUserID);
        const {userType} = user.data as UserInfo;
        if (userType === UserType.SUPERVISOR) {
            const {articleID, title, content, authorID, articleType, picturePath} = newArticle;
            const response = await modifyArticleInfoDB(articleID, title, articleType, content, authorID, picturePath);
            return new ResponseServer<void>(response);
        } else if (userType === UserType.DEVICEADMIN) {
            if (article.data.authorID === sessionUserID) { //如果文章所属就是sessionID的用户
                const {articleID, title, content, authorID, articleType, picturePath} = newArticle;
                const response = await modifyArticleInfoDB(articleID, title, articleType, content, authorID, picturePath);
                return new ResponseServer<void>(response);
            } else {
                return permissionDeny();
            }
        } else {
            return permissionDeny();

        }
    } else {
        return new ResponseServer<void>(
            new ResponseDB<void>(false, 'articleNotFound')
        );
    }
}

export async function deleteArticle(articleID: number, sessionUserID: number): Promise<ResponseServer<void>> {
    const user = await queryUserInfo(sessionUserID);
    const article = await queryArticleDB(articleID);
    if (article.isSuccessful && article.data) {
        if ((user.data as UserInfo).userType === UserType.SUPERVISOR) {
            //是超管 可以任意删除
            const response = await deleteArticleDB(articleID);
            return new ResponseServer<void>(response);
        } else if ((user.data as UserInfo).userType === UserType.DEVICEADMIN) {
            //是机器人管理员，可以删除自己的文章
            if (article.data.authorID === sessionUserID) {
                const response = await deleteArticleDB(articleID);
                return new ResponseServer<void>(response);
            } else {
                return permissionDeny<void>();
            }
        } else {
            return permissionDeny<void>();
        }

    } else {
        return new ResponseServer<void>(
            new ResponseDB<void>(false, 'articleNotFound')
        );
    }
}

export async function deletedArticleRecover(articleID: number, sessionUserID: number): Promise<ResponseServer<void>> {
    const user = await queryUserInfo(sessionUserID);
    if ((user.data as UserInfo).userType === UserType.SUPERVISOR) {
        const response = await deletedArticleRecoverDB(articleID);
        return new ResponseServer<void>(response);
    } else {
        return new ResponseServer<void>(
            new ResponseDB<void>(false, 'invalidCall')
        );
    }
}

export async function queryArticleAmount(articleType: ArticleType): Promise<ResponseServer<number>> {
    const response = await queryArticleAmountDB(articleType);
    return new ResponseServer<number>(response);
}

export async function listArticleInfo(articleType: ArticleType, offset: number, limit: number): Promise<ResponseServer<QueryArticle[]>> {
    const response = await listArticleDB(articleType, offset, limit);
    return new ResponseServer<QueryArticle[]>(response);
}

export async function listDeletedArticleInfo(articleType: ArticleType, offset: number, limit: number, sessionUserID: number): Promise<ResponseServer<QueryArticle[]>> {
    const user = await queryUserInfo(sessionUserID);
    if ((user.data as UserInfo).userType === UserType.SUPERVISOR) {
        const response = await listDeletedArticleDB(articleType, offset, limit);
        return new ResponseServer<QueryArticle[]>(response);
    } else {
        return new ResponseServer<QueryArticle[]>(
            new ResponseDB<QueryArticle[]>(false, 'invalidCall')
        );
    }
}

export async function searchArticleInfo(keyword: string, articleType: ArticleType): Promise<ResponseServer<QueryArticle[]>> {
    if(keyword===''){
        return new ResponseServer<QueryArticle[]>(
            new ResponseDB(false,'invalidParameter')
        );
    }
    const response = await searchArticleInfoDB(keyword, articleType);
    return new ResponseServer<QueryArticle[]>(response);
}

export async function searchDeletedArticleInfo(keyword: string, sessionUserID: number, articleType: ArticleType): Promise<ResponseServer<QueryArticle[]>> {
    const user = await queryUserInfo(sessionUserID);
    if(keyword===''){
        return new ResponseServer<Article[]>(
            new ResponseDB(false,'invalidParameter')
        );
    }
    if ((user.data as UserInfo).userType === UserType.SUPERVISOR) {
        const response = await searchDeletedArticleInfoDB(keyword, articleType);
        return new ResponseServer<QueryArticle[]>(response);
    } else {
        return new ResponseServer<QueryArticle[]>(
            new ResponseDB<QueryArticle[]>(false, 'invalidCall')
        );
    }
}

export async function queryArticleInfo(articleID: number): Promise<ResponseServer<Article>> {
    const response = await queryArticleDB(articleID);
    return new ResponseServer<Article>(response);
}

export async function queryArticleAmountOnID(articleType: ArticleType, userID: number): Promise<ResponseServer<number>> {
    const response = await queryArticleAmountOnIDDB(articleType, userID);
    return new ResponseServer<number>(response);
}

export async function listArticleOnID(articleType: ArticleType, offset: number, limit: number, userID: number, sessionUserID: number): Promise<ResponseServer<QueryArticle[]>> {

    const res = await checkDvSupSession(sessionUserID);
    if (res.body.isSuccessful && res.body.data) {//是超管 可以随意查询任意人的厂商列表
        const response = await listArticleOnIDDB(articleType, offset, limit, userID);
        return new ResponseServer<QueryArticle[]>(response);
    } else {
        if (userID !== sessionUserID) {
            return permissionDeny<QueryArticle[]>()
        } else {
            const response = await listArticleOnIDDB(articleType, offset, limit, userID);
            return new ResponseServer<QueryArticle[]>(response);
        }
    }
}

export async function queryDeletedArticleAmount(articleType:ArticleType,sessionUserID:number){
    const res = await checkSupervisorSession(sessionUserID);
    if(res.body.data && res.body.isSuccessful){
        const response = await queryDeletedArticleAmountDB(articleType);
        return new ResponseServer<number>(response);
    } else {
        return permissionDeny<number>();
    }
}

export async function searchArticleInfoOnID(keyword:string,articleType:ArticleType,sessionUserID:number):Promise<ResponseServer<QueryArticle[]>>{
    if (keyword === '') {
        return new ResponseServer<Article[]>(
            new ResponseDB(false, 'invalidParameter')
        );
    }
    const res = await checkDvSupSession(sessionUserID);
    if(res.body.data && res.body.isSuccessful){
        const response = await searchArticleInfoOnIDDB(keyword,articleType,sessionUserID);
        return new ResponseServer<QueryArticle[]>(response);
    } else {
        return permissionDeny();
    }
}

export async function queryArticlePicturePath(articleID:number){
    const response = await queryArticlePicturePathDB(articleID);
    return new ResponseServer<string>(response);
}