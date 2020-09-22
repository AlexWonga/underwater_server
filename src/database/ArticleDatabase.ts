import {Article as ArticleModel} from "../Class/Article";
import {ArticleType} from "../Enum/ArticleType";
import {ResponseDB} from "../instances/ResponseDB";
import {queryUserInfo} from "./UserSupervisorDatabase";
import {sequelize} from "./DB";
import {Article} from "./Models/ArticleModel";
import {Op} from "sequelize";
import {QueryArticle} from "../Class/QueryArticle";

export async function addArticle(title: string, articleType: ArticleType, content: string, authorID: number, picturePath: string): Promise<ResponseDB<void>> {
    const response = await queryUserInfo(authorID);
    if (!response.isSuccessful) {
        return new ResponseDB<void>(false, 'userNotFound');
    }
        // else if(response.data.UserType === UserType.BROWSEUSER){
        //     return new ResponseDB<void>(false,'invalidCall');
    // }
    else {
        const result = await Article.create({
            title: title,
            articleType: articleType,
            content: content,
            authorID: authorID,
            picturePath: picturePath,
        });
        if (result) {
            return new ResponseDB<void>(true, 'addArticleSuccess');
        } else {
            throw new Error("insertArticleFailed");
        }
    }
}

export async function modifyArticleInfo(ID: number, title: string, articleType: ArticleType, content: string, UserInfoID: number, picturePath: string): Promise<ResponseDB<void>> {
    const t = await sequelize.transaction();
    try {
        let articleA = await Article.findOne({
            where: {
                ID: ID,
                isInRecycleBin: false,
            },

        });
        if (articleA === null) {
            return new ResponseDB<void>(false, 'articleNotFound');
        } else {
            articleA.articleType = articleType;
            articleA.picturePath = picturePath;
            articleA.authorID = UserInfoID;
            articleA.content = content;
            articleA.title = title;
            await articleA.save();
            await t.commit();
        }
        return new ResponseDB<void>(true, 'modifyArticleInfoSuccess');
    } catch (e) {
        await t.rollback();
        throw e;
    }
}

export async function deleteArticle(articleID: number): Promise<ResponseDB<void>> {
    let tempArticle = await Article.findOne({
        where: {
            ID: articleID,
            isInRecycleBin: false,
        },
    });
    if (tempArticle === null) {
        return new ResponseDB<void>(false, 'articleNotFound');
    } else {
        tempArticle.isInRecycleBin = true;
        await tempArticle.save();
        return new ResponseDB<void>(true, 'articleDeleted');
    }
}

export async function deletedArticleRecover(articleID: number): Promise<ResponseDB<void>> {

    let article = await Article.findOne({
        where: {
            ID: articleID,
            isInRecycleBin: true,
        },

    });
    if (article === null) {
        return new ResponseDB<void>(false, 'articleNotFound');
    } else {
        article.isInRecycleBin = false;
        await article.save();
        return new ResponseDB<void>(true, 'articleDeleted');
    }
}

export async function queryArticleAmount(ArticleType: ArticleType): Promise<ResponseDB<number>> {

    const amount = await Article.count({
        where: {
            articleType: ArticleType,
            isInRecycleBin: false,
        },
    });
    return new ResponseDB<number>(true, 'amountQuerySuccess', amount);
}


export async function listArticle(articleType: ArticleType, offset: number, limit: number): Promise<ResponseDB<QueryArticle[]>> {

    const articleList = await Article.findAll({  //文章列表按照id来排序
        where: {
            isInRecycleBin: false,
            articleType: articleType,
        },
        order: ['ID'],
        limit: limit,
        offset: offset,
        attributes: {exclude: ['isInRecycleBin']},

    });
    if (articleList) {
        let result: QueryArticle[] = [];
        articleList.forEach((item) => {
            let {ID, articleType, title, createdAt, updatedAt, authorID} = item;
            result.push(new QueryArticle(ID,articleType,title,authorID,createdAt.getTime(),updatedAt.getTime()));
        });
        return new ResponseDB<QueryArticle[]>(true, 'listArticleSuccess', result);
    } else {
        return new ResponseDB<QueryArticle[]>(false, 'articleNotFound');
    }
}

export async function listDeletedArticle(articleType: ArticleType, offset: number, limit: number): Promise<ResponseDB<QueryArticle[]>> {
    const articleList = await Article.findAll({  //文章列表按照id来排序
        where: {
            isInRecycleBin: true,
            articleType: articleType,
        },
        order: ['ID'],
        limit: limit,
        offset: offset,
        attributes: {exclude: ['isInRecycleBin']},

    });
    if (articleList) {
        let result: QueryArticle[] = [];
        articleList.forEach((item) => {
            const {ID, articleType, title,authorID, createdAt, updatedAt} = item;
            result.push(new QueryArticle(ID,articleType,title,authorID,createdAt.getTime(),updatedAt.getTime()));

        });
        return new ResponseDB<QueryArticle[]>(true, 'listDeletedArticleSuccess', result);
    } else {
        return new ResponseDB<QueryArticle[]>(false, 'noArticle');
    }
}


export async function queryArticle(articleID: number): Promise<ResponseDB<ArticleModel>> {

    const article = await Article.findOne({
        where: {
            ID: articleID,
        },

    });
    if (article === null) {
        return new ResponseDB<ArticleModel>(false, 'invalidID');
    } else {
        const {ID, articleType, title, picturePath, content, authorID, createdAt, updatedAt} = article;
        let result: ArticleModel = new ArticleModel(ID, articleType, title, picturePath, authorID, content, createdAt.getTime(), updatedAt.getTime());
        return new ResponseDB<ArticleModel>(true, 'queryArticleSuccess', result);
    }
}

export async function searchArticleInfo(keyword: string, articleType: ArticleType): Promise<ResponseDB<QueryArticle[]>> {
    const articleList = await Article.findAll({
        where: {
            isInRecycleBin: false,
            articleType: articleType,
            [Op.or]: [
                {title: {[Op.like]: '%' + keyword + '%'}},
                {content: {[Op.like]: '%' + keyword + '%'}},
            ],
        }
    });
    let result: QueryArticle[] = [];
    if (articleList) {
        articleList.forEach((item) => {
            const {ID, articleType, title, authorID, createdAt, updatedAt} = item;
            result.push(new QueryArticle(ID, articleType, title, authorID, createdAt.getTime(), updatedAt.getTime()));

        });
        return new ResponseDB<QueryArticle[]>(true, 'searchArticleSuccess', result);
    } else {
        return new ResponseDB<QueryArticle[]>(true, 'searchArticleSuccess', result);
    }
}


export async function searchArticleInfoOnID(keyword: string, articleType: ArticleType, userID: number): Promise<ResponseDB<QueryArticle[]>> {
    const articleList = await Article.findAll({
        where: {
            isInRecycleBin: false,
            articleType: articleType,
            [Op.or]: [
                {title: {[Op.like]: '%' + keyword + '%'}},
                {content: {[Op.like]: '%' + keyword + '%'}},
            ],
            authorID: userID,
        }
    });
    let result: QueryArticle[] = [];
    if (articleList) {
        articleList.forEach((item) => {
            const {ID, articleType, title, authorID, createdAt, updatedAt} = item;
            result.push(new QueryArticle(ID, articleType, title, authorID, createdAt.getTime(), updatedAt.getTime()));
        });
        return new ResponseDB<QueryArticle[]>(true, 'searchArticleSuccess', result);
    } else {
        return new ResponseDB<QueryArticle[]>(true, 'searchArticleSuccess', result);
    }
}


export async function searchDeletedArticleInfo(keyword: string, articleType: ArticleType): Promise<ResponseDB<QueryArticle[]>> {
    const articleList = await Article.findAll({
        where: {
            isInRecycleBin: true,
            articleType: articleType,
            [Op.or]: [
                {title: {[Op.like]: '%' + keyword + '%'}},
                {content: {[Op.like]: '%' + keyword + '%'}},
            ],
        }
    });
    let result: QueryArticle[] = [];
    if (articleList) {
        articleList.forEach((item) => {
            const {ID, articleType, title, authorID, createdAt, updatedAt} = item;
            result.push(new QueryArticle(ID, articleType, title, authorID,createdAt.getTime(), updatedAt.getTime()));

        });
        return new ResponseDB<QueryArticle[]>(true, 'searchDeletedArticleSuccess', result);
    } else {
        return new ResponseDB<QueryArticle[]>(true, 'searchArticleSuccess', result);
    }
}

export async function queryArticleAmountOnID(articleType: ArticleType, userID: number): Promise<ResponseDB<number>> {
    const result = await Article.count({
        where: {
            articleType: articleType,
            isInRecycleBin: false,
            authorID: userID,
        },
        distinct: true,
    });
    return new ResponseDB<number>(true, 'amountQuerySuccess', result);
}

export async function listArticleOnID(articleType: ArticleType, offset: number, limit: number, userID: number): Promise<ResponseDB<QueryArticle[]>> {
    const ArticleList = await Article.findAll({
        where: {
            articleType: articleType,
            authorID: userID,
            isInRecycleBin: false,
        },
        order: ['ID'],
        offset: offset,
        limit: limit,
    });
    const result: QueryArticle[] = [];
    if (ArticleList) {
        ArticleList.forEach((item) => {
            const {ID, articleType, title,authorID, createdAt, updatedAt} = item;
            result.push(new QueryArticle(ID, articleType, title, authorID, createdAt.getTime(), updatedAt.getTime()));
        })
        return new ResponseDB<QueryArticle[]>(true, 'listArticleInfoSuccess', result);
    } else {
        return new ResponseDB<QueryArticle[]>(true, 'listArticleInfoSuccess', result);
    }
}

// addArticle('1',ArticleType.KNOWLEDGE, '1',1,"");

export async function queryDeletedArticleAmount(articleType: ArticleType) {
    const articleCount = await Article.count({
        where: {
            articleType: articleType,
            isInRecycleBin: true,
        },
        distinct: true,
    });
    if (articleCount) {
        return new ResponseDB<number>(true, 'queryAmountSuccess', articleCount);
    } else {
        return new ResponseDB<number>(true, 'queryAmountSuccess', 0);
    }
}

export async function queryArticlePicturePath(articleID:number):Promise<ResponseDB<string>>{
    const article = await Article.findOne({
        where:{
            ID:articleID,
        }
    });
    if(article){
        const {picturePath} = article;
        return new ResponseDB<string>(true,'queryPicturePathSuccess',picturePath);
    } else {
        return new ResponseDB<string>(false,'invalidArticle');
    }
}