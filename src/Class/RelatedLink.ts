/**
 * @description 相关链接实体类
 */
export class RelatedLink {
    public link!: string;
    public linkName: string;
    public sequence!: number;

    constructor(link: string, linkName: string, sequelize: number) {
        this.link = link;
        this.linkName = linkName;
        this.sequence = sequelize;
    }
}
