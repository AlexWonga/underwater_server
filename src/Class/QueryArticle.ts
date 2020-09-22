import {ArticleType} from "../Enum/ArticleType";

/**
 * @description 文章实体类
 */
export class QueryArticle {
    public articleID!: number;
    public articleType!: ArticleType;
    public title!: string;
    public authorID: number;
    public creationTimestamp!: number;
    public lastModifiedTimestamp!: number;


    constructor(articleID: number, articleType: ArticleType, title: string,
                authorID: number, creationTimestamp: number, lastModifiedTimestamp: number) {
        this.articleID = articleID;
        this.articleType = articleType;
        this.title = title;
        this.authorID = authorID;
        this.creationTimestamp = creationTimestamp;
        this.lastModifiedTimestamp = lastModifiedTimestamp;
    }
}