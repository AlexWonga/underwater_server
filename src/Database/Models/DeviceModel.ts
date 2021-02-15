import {Table, Column, DataType, Model, HasMany, BelongsTo, ForeignKey} from 'sequelize-typescript';
import {DeviceData} from "./DeviceDataModel";
import {UserInfo} from "./UserSupervisorModel";
import {Manufacturer} from "./ManufacturerModel";

@Table({
    tableName: "Device",
    freezeTableName: true
})
export class Device extends Model<Device> {
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
    })
    public deviceName!: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    public isInRecycleBin!: boolean;

    @HasMany(() => DeviceData)
    deviceDataList: DeviceData[];

    @HasMany(() => DevicePicture)
    devicePictureList: DevicePicture[];

    @HasMany(() => DeviceFile)
    deviceFileList: DeviceFile[];

    @HasMany(() => DevicePicture3D)
    devicePicture3DList: DevicePicture3D[];

    @ForeignKey(() => UserInfo)
    @Column({
        type: DataType.INTEGER(),
    })
    userInfoID: number;

    @BelongsTo(() => UserInfo)
    userInfo: UserInfo;

    @ForeignKey(() => Manufacturer)
    @Column({
        type: DataType.INTEGER(),
    })
    manufacturerID: number;

    @BelongsTo(() => Manufacturer)
    manufacturer: Manufacturer;

}

@Table({
    tableName: "DevicePicture",
    freezeTableName: true
})
export class DevicePicture extends Model<DevicePicture> {
    @Column({
        type: DataType.INTEGER(),
        primaryKey: true,
        autoIncrement: true,
    })
    public ID!: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    public isCover!: boolean;

    @Column({
        type: DataType.STRING(),
        allowNull: false,
    })
    public picturePath!: string;

    @ForeignKey(() => Device)
    @Column({
        type: DataType.INTEGER(),
    })
    deviceID: number;

    @BelongsTo(() => Device)
    device: Device;

}

@Table({
    tableName: "DeviceFile",
    freezeTableName: true
})
export class DeviceFile extends Model<DeviceFile> {
    @Column({
        type: DataType.INTEGER(),
        primaryKey: true,
        autoIncrement: true,
    })
    public ID!: number;

    @Column({
        type: DataType.STRING(),
    })
    public filePath!: string;

    @ForeignKey(() => Device)
    @Column({
        type: DataType.INTEGER(),
    })
    deviceID: number;

    @BelongsTo(() => Device)
    device: Device;
}

@Table({
    tableName: "DevicePicture3D",
    freezeTableName: true
})
export class DevicePicture3D extends Model<DevicePicture3D> {
    @Column({
        type: DataType.INTEGER(),
        primaryKey: true,
        autoIncrement: true,
    })
    public ID!: number;

    @Column({
        type: DataType.STRING(),
    })
    public picturePath!: string;

    @ForeignKey(() => Device)
    @Column({
        type: DataType.INTEGER(),
    })
    deviceID: number;

    @BelongsTo(() => Device)
    device: Device;

}

