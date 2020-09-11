import {Table, Column, DataType, Model, HasMany, BelongsToMany} from 'sequelize-typescript';
import {UserType} from "../../Enum/UserType";
import {Article} from "./ArticleModel";
import {Manufacturer, ManufacturerUserInfo} from "./ManufacturerModel";

@Table({
    tableName: 'UserInfo',
    freezeTableName: true
})
export class UserInfo extends Model<UserInfo> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    })
    public ID!: number;

    @Column({
        type: DataType.STRING(),
        allowNull: false,
        unique: true,
    })
    public username!: string;

    @Column({
        type: DataType.STRING(),
        allowNull: false,
    })
    public password!: string;

    @Column({
        type: DataType.STRING(),
        allowNull: false,
    })
    public telephone!: string;

    @Column({
        type: DataType.STRING(),
        allowNull: false,
    })
    public email!: string;

    @Column({
        type: DataType.ENUM({
            values: ['SUPERVISOR',
                'DEVICEADMIN',
                'BROWSEUSER']
        }),
        allowNull: false,
    })
    public userType!: UserType;


    @Column({
        type: DataType.DATE(),
        defaultValue: new Date(),
    })
    lastLogin: Date;

    @HasMany(() => Article)
    articles: Article[];

    @BelongsToMany(() => Manufacturer, () => ManufacturerUserInfo)
    manufacturerList: Array<Manufacturer & { ManufacturerUserInfo: ManufacturerUserInfo }>;
}