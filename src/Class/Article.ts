import {ArticleType} from "../Enum/ArticleType";

export class Article {
    public articleID!: number;
    public articleType!: ArticleType;
    public title!: string;
    public picturePath!: string;
    public authorID: number;
    public creationTimestamp!: number;
    public lastModifiedTimestamp!: number;
    public content!: string;

    constructor(articleID: number, articleType: ArticleType, title: string, picturePath: string,
                authorID: number, content: string, creationTimestamp: number, lastModifiedTimestamp: number) {
        this.articleID = articleID;
        this.articleType = articleType;
        this.title = title;
        this.picturePath = picturePath;
        this.authorID = authorID;
        this.content = content;
        this.creationTimestamp = creationTimestamp;
        this.lastModifiedTimestamp = lastModifiedTimestamp;
    }
}