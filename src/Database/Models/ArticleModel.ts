import {Table, Column, DataType, Model, BelongsTo, ForeignKey} from 'sequelize-typescript';
import {ArticleType} from "../../Enum/ArticleType";

import {UserInfo} from "./UserSupervisorModel";

@Table({
    tableName: 'Article',
    freezeTableName: true
})
export class Article extends Model<Article> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
    })
    ID: number;

    @Column({
        type: DataType.ENUM({
            values: [
                'EVALUATION',
                'KNOWLEDGE',]
        }),
        allowNull: false,
    })
    articleType: ArticleType;

    @Column({
        type: DataType.STRING(),
        allowNull: false,
    })
    title: string;

    @Column({
        type: DataType.TEXT({length:"long"}),
    })
    picturePath: string;

    @Column({
        type: DataType.TEXT({length:"long"}),
        allowNull: false,
    })
    content: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    isInRecycleBin: boolean;


    @ForeignKey(() => UserInfo)
    @Column({
        allowNull:false,
    })
    authorID: number;

    @BelongsTo(() => UserInfo)
    userInfo: UserInfo
}







