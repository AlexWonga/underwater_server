import {Table, Column, DataType as SequelizeDataType, Model, HasMany, ForeignKey, BelongsTo} from 'sequelize-typescript';
import {DeviceData} from "./DeviceDataModel";
import {DataType as DataTy} from "../../Enum/DataType";

@Table({
    tableName: "Datatype",
    freezeTableName: true
})
export class DataType extends Model<DataType> {

    @Column({
        primaryKey: true,
        type: SequelizeDataType.INTEGER(),
        allowNull: false,
        unique: true,
        autoIncrement: true,
    })
    public ID!: number;

    @Column({
        type: SequelizeDataType.ENUM({
            values: [
                'TEXT',
                'SELECT',
                'TWODIMENSIONAL']
        }),
        allowNull: false,
        unique: true,
    })
    public typeName!: DataTy;
}


@Table({
    tableName: "DataCategory",
    freezeTableName: true
})
export class DataCategory extends Model<DataCategory> {

    @Column({
        primaryKey: true,
        type: SequelizeDataType.INTEGER(),
        allowNull: false,
        unique: true,
        autoIncrement: true,
    })
    public ID!: number;

    @Column({
        type: SequelizeDataType.STRING(),
        allowNull: false,
        unique: true,
    })
    public categoryName!: string;

    @Column({
        type: SequelizeDataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    public isInRecycleBin!: boolean;


    @HasMany(() => DeviceData)
    deviceDataList: DeviceData[];

    @HasMany(() => CategoryOptions)
    categoryOptionsList: CategoryOptions[];

    @ForeignKey(() => DataType)
    @Column({
        type: SequelizeDataType.INTEGER(),
    })
    dataTypeID: number;

    @BelongsTo(() => DataType)
    dataType: DataType
}


@Table({
    tableName: "CategoryOptions",
    freezeTableName: true
})
export class CategoryOptions extends Model<CategoryOptions> {

    @Column({
        type: SequelizeDataType.STRING(),
        allowNull: false,
    })
    public optionsName!: string;

    @BelongsTo(() => DataCategory)
    dataCategory: DataCategory;

    @ForeignKey(() => DataCategory)
    @Column({
        type: SequelizeDataType.INTEGER(),
    })
    categoryID: number;
}