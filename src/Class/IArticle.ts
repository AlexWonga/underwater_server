export class IArticle {
    public articleID: number;
    public title?: string | undefined;
    public content?: string | undefined;
    public authorID: number;
    public picturePath?: string | undefined;


    constructor(ID: number, title: string | undefined, content: string | undefined, authorID: number, picturePath?: string | undefined) {
        this.articleID = ID;
        this.title = title;
        this.content = content;
        this.authorID = authorID;
        this.picturePath = picturePath;
    }
}
