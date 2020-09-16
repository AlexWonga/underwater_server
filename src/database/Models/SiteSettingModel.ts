import {Table, Column, DataType, Model} from 'sequelize-typescript';

@Table({
    tableName: "Banner",
    freezeTableName: true
})
export class Banner extends Model<Banner> {
    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
    })
    public ID!: number;

    @Column({
        type: DataType.STRING(),
        allowNull: false,
    })
    public picturePath!: string;
}

@Table({
    tableName: "Footer",
    freezeTableName: true
})
export class Footer extends Model<Footer> {
    @Column({
        primaryKey: true,
        type: DataType.TEXT,
    })
    public richTextInfo!: string;
}


@Table({
    tableName: "PlatformOverview",
    freezeTableName: true
})
export class PlatformOverview extends Model<PlatformOverview> {
    @Column({
        primaryKey: true,
        type: DataType.STRING(1000),
    })
    public overviewInfo!: string;
}


@Table({
    tableName: "SlidePicture",
    freezeTableName: true
})
export class SlidePicture extends Model<SlidePicture> {
    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
    })
    public ID!: number;

    @Column({
        type: DataType.STRING,
    })
    public picturePath!: string;

    @Column({
        type: DataType.STRING,
    })
    public pictureDescribe!: string;
}


@Table({
    tableName: "RelatedLinks",
    freezeTableName: true
})
export class RelatedLinks extends Model<RelatedLinks> {
    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
    })
    public ID!: string;

    @Column({
        type: DataType.INTEGER,
    })
    public sequence!: number;

    @Column({
        type: DataType.STRING(),
    })
    public linkName!: string;

    @Column({
        type: DataType.STRING(),
    })
    public link!: string;
}


@Table({
    tableName: "ContactUS",
    freezeTableName: true
})
export class ContactUs extends Model<ContactUs> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    public ID!: number;

    @Column({
        type: DataType.STRING,
    })
    public contactWay!: string; //联系方式

    @Column({
        type: DataType.STRING,
    })
    public siteProfile!: string //网站简介
}
