import {Table, Column, DataType, Model, BelongsToMany, ForeignKey} from 'sequelize-typescript';
import {UserInfo} from "./UserSupervisorModel";


@Table({
    tableName: "Manufacturer",
    freezeTableName: true
})
export class Manufacturer extends Model<Manufacturer> {
    @Column({
        type: DataType.INTEGER(),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    })
    public ID!: number;

    @Column({
        type: DataType.STRING(),
        allowNull: false,
        unique: true,
    })
    public manufacturerName!: string;

    @Column({
        type: DataType.STRING(),
    })
    public manufacturerAddress!: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    public isInRecycleBin!: boolean;

    @Column({
        type: DataType.STRING(),
    })
    public manufacturerTelephone!: string;

    @Column({
        type: DataType.STRING(),
    })
    public manufacturerIntroduction!: string;

    @BelongsToMany(() => UserInfo, () => ManufacturerUserInfo)
    UserInfoList: Array<UserInfo & { ManufacturerUserInfo: ManufacturerUserInfo }>;
}

@Table({
    tableName: "ManufacturerUserInfo",
    freezeTableName: true
})
export class ManufacturerUserInfo extends Model<ManufacturerUserInfo> {
    @ForeignKey(() => Manufacturer)
    @Column({
        type: DataType.INTEGER(),
    })
    manufacturerID: number;

    @ForeignKey(() => UserInfo)
    @Column({
        type: DataType.INTEGER(),
    })
    userInfoID: number;
}
