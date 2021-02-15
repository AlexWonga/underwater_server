import {Table, Column, DataType, Model, BelongsTo, ForeignKey} from 'sequelize-typescript';
import {Device} from "./DeviceModel";
import {DataCategory} from "./DataCategoryModel";

@Table({
    tableName: "DeviceData",
    freezeTableName: true
})
export class DeviceData extends Model<DeviceData> {

    @Column({
        type: DataType.INTEGER(),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    })
    public ID!: number;

    @Column({
        type: DataType.STRING(),
        allowNull: false,
    })
    public data!: string;

    @ForeignKey(() => DataCategory)
    @Column({
        allowNull: false,
        type: DataType.INTEGER(),
        unique:"data_unique",
    })
    categoryID: number;

    @ForeignKey(() => Device)
    @Column({
        allowNull: false,
        type: DataType.INTEGER(),
        unique:"data_unique",//表示一个设备一个类型只能有一个值
    })
    deviceID: number;

    @BelongsTo(() => Device)
    device: Device;

}