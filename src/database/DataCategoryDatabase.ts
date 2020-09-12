import {DataCategory, DataType, CategoryOptions} from "./Models/DataCategoryModel";
import {sequelize} from "./DB";
import {ResponseDB} from "../instances/ResponseDB";
import {Op} from "sequelize";
import {CategoryOption} from "../Class/CategoryOption";
import {DataType as DataTypeEnum} from "../Enum/DataType";
import {DataCategory as DataCategoryModel} from "../Class/DataCategory";


export async function addDataCategory(dataCategoryName: string, dataType: DataTypeEnum, selectList?: string[]): Promise<ResponseDB<void>> {
    if (selectList !== undefined) {
        let flag = true;
        for (let i = 0; i < selectList.length; i++) {
            for (let j = 0; j < selectList.length; j++) {
                if (i !== j) {
                    if (selectList[i] === selectList[j]) {
                        flag = false;
                    }
                }
            }
        }
        if (!flag) {
            return new ResponseDB<void>(false, 'invalidSelectList');
        }
        if (Array.isArray(selectList)) {
            flag = true;
            selectList.forEach((item) => {
                if (item === '') {
                    flag = false;
                }
            });
            if (!flag) {
                return new ResponseDB<void>(false, 'invalidSelectList');//非法的备选项
            }
        } else {
            return new ResponseDB<void>(false, 'invalidParameter');
        }
    }
    const temp = await DataCategory.findOne({
        where: {
            categoryName: dataCategoryName,
        }
    });
    if (temp !== null) {
        return new ResponseDB<void>(false, 'duplicateCategoryName');//重复的类型名
    } else {
        const typeID = await queryDataTypeID(dataType);
        const category = await DataCategory.create({
            categoryName: dataCategoryName,
            dataTypeID: typeID,
        });
        if (selectList && dataType === DataTypeEnum.SELECT) { //如果有可选项，记录可选项
            for (const item in selectList) {
                await CategoryOptions.create({
                    optionsName: item,
                    dataCategory: category,
                    categoryID: category.ID,
                });
            }
        }
        return new ResponseDB<void>(true, 'addCategorySuccess');
    }
}

async function queryDataTypeID(dataType: DataTypeEnum): Promise<number> { //不需要暴露出来
    const DataTypes = await DataType.findOne({
        where: {
            typeName: dataType,
        },

    });
    if (DataTypes !== null) {
        const {ID} = DataTypes;
        return ID;
    } else {
        return -1;
    }
}

export async function modifyDataCategory(categoryID: number, categoryName?: string, selectList?: string[]): Promise<ResponseDB<void>> {
    const t = await sequelize.transaction();
    try {
        if (categoryName !== undefined && categoryName === '') {//名字为空字符串非法
            return new ResponseDB<void>(false, 'invalidCategoryName');
        }
        if (selectList !== undefined) {
            selectList.forEach((item) => {//可选项为空字符串非法
                if (item === '') {
                    return new ResponseDB<void>(false, 'invalidSelectList');
                }
                return true;
            });
        }
        const result = await DataCategory.findOne({
            where: {
                ID: categoryID,
                isInRecycleBin: false,
            },

        });
        if (result === null) { //检查有没有这个数据类型
            return new ResponseDB<void>(false, 'CategoryNotFound');
        }
        //全部false条件确认完全后，进行数据类型的修改
        if (categoryName !== undefined) {
            result.categoryName = categoryName;
            await result.save();
        }
        if (selectList !== undefined) {
            const list = await CategoryOptions.findAll({
                where: {
                    dataCategoryID: categoryID,
                },
            });
            await list.forEach((item: { destroy: () => void; }) => {//删除原来的所有相关可选项
                item.destroy();
            });
            let lists: Object[] = [];
            selectList.forEach((item) => { //创建新的可选项
                lists.push(new CategoryOption(item, categoryID));
            });
            await CategoryOptions.bulkCreate(lists);
        }
        await t.commit();
        return new ResponseDB<void>(true, 'modifyCategorySuccess');
    } catch (e) {
        await t.rollback();
        throw e;
    }
}

export async function deleteDataCategory(dataCategoryID: number): Promise<ResponseDB<void>> {
    const result = await DataCategory.findOne({
        where: {
            ID: dataCategoryID,
            isInRecycleBin: false,
        },
    });
    if (result === null || result.isInRecycleBin) {
        return new ResponseDB<void>(false, 'dataCategoryNotFound');
    } else {
        result.isInRecycleBin = true;
        await result.save();
        return new ResponseDB<void>(true, 'deleteCategorySuccess');
    }
}

export async function deleteDateCategoryRecover(dataCategoryID: number): Promise<ResponseDB<void>> { //将数据从回收站中恢复出来
    const result = await DataCategory.findOne({
        where: {
            ID: dataCategoryID,
            isInRecycleBin: true,
        },
    });
    if (result === null || !result.isInRecycleBin) {
        return new ResponseDB<void>(false, 'dataCategoryNotFound');
    } else {
        result.isInRecycleBin = false;
        await result.save();
        return new ResponseDB<void>(true, 'deleteCategorySuccess');
    }
}

export async function listDataCategory(offset: number, limit: number): Promise<ResponseDB<DataCategoryModel[]>> {
    const categories = await DataCategory.findAll({
        where: {
            isInRecycleBin: false
        },
        attributes: {exclude: ['isInRecycleBin', 'DataTypeID']},

        order: ['ID'],
        limit: limit,
        offset: offset,
    });
    let result: DataCategoryModel[] = [];
    for (let i = 0; i < categories.length; i++) {
        const {ID, categoryName, dataTypeID} = categories[i];
        const typeName = await queryTypeName(dataTypeID);
        if (typeName) {
            result.push(new DataCategoryModel(ID, categoryName, typeName));
        }
    }
    return new ResponseDB<DataCategoryModel[]>(true, 'listCategorySuccess', result);//这里虽然强调了返回DataCategoryModel,实际上result可以不是该类型，未起到限制作用
}


export async function queryTypeName(typeID: number): Promise<DataTypeEnum | undefined> {
    const res = await DataType.findOne({
        where: {
            ID: typeID,
        }
    });
    if (res) {
        return res.typeName;
    } else {
        return undefined;
    }
}

export async function listDeletedDataCategory(offset: number, limit: number): Promise<ResponseDB<DataCategoryModel[]>> {
    const categories = await DataCategory.findAll({
        where: {
            isInRecycleBin: true,
        },
        attributes: {exclude: ['isInRecycleBin', 'DataTypeID']},

        order: ['ID'],
        limit: limit,
        offset: offset,
    });
    let result: DataCategoryModel[] = [];
    for (let i = 0; i < categories.length; i++) {
        const {ID, categoryName, dataTypeID} = categories[i];
        const typeName = await queryTypeName(dataTypeID);
        if (typeName) {
            result.push(new DataCategoryModel(ID, categoryName, typeName));
        }
    }
    return new ResponseDB<DataCategoryModel[]>(true, 'listCategorySuccess', result);
}

export async function searchCategory(keyword: string): Promise<ResponseDB<DataCategoryModel[]>> {

    const categories = await DataCategory.findAll({
        where: {
            categoryName: {
                [Op.like]: '%' + keyword + '%'//模糊查询 但这样不能查询keyword分开的情况
            },
            isInRecycleBin: false,
        },
        attributes: {exclude: ['isInRecycleBin']},

    });
    let result: DataCategoryModel[] = [];
    for (let i = 0; i < categories.length; i++) {
        const {ID, categoryName, dataTypeID} = categories[i];
        const typeName = await queryTypeName(dataTypeID);
        if (typeName) {
            result.push(new DataCategoryModel(ID, categoryName, typeName));
        }
    }
    return new ResponseDB<DataCategoryModel[]>(true, 'searchCategorySuccess', result);
}

export async function searchDeletedCategory(keyword: string): Promise<ResponseDB<DataCategoryModel[]>> {

    const categories = await DataCategory.findAll({
        where: {
            [Op.or]: [{categoryName: {[Op.like]: '%' + keyword + '%'}}, //like和or连用
                {ID: {[Op.like]: '%' + keyword + '%'}},
            ],
        },
        attributes: {exclude: ['isInRecycleBin']},

    });
    let result: DataCategoryModel[] = [];
    for (let i = 0; i < categories.length; i++) {
        const {ID, categoryName, dataTypeID} = categories[i];
        const typeName = await queryTypeName(dataTypeID);
        if (typeName) {
            result.push(new DataCategoryModel(ID, categoryName, typeName));
        }
    }

    return new ResponseDB<DataCategoryModel[]>(true, 'searchCategorySuccess', result);

}

export async function queryCategory(categoryID: number): Promise<ResponseDB<DataCategoryModel>> {

    const category = await DataCategory.findOne({
        where: {
            ID: categoryID,
        },

    });
    if (category === null) {
        return new ResponseDB<DataCategoryModel>(false, 'categoryNotFound');
    } else {
        const {ID, categoryName, dataTypeID} = category;
        let typeName = await queryTypeName(dataTypeID);
        if (typeName) {
            let result: DataCategoryModel = new DataCategoryModel(ID, categoryName, typeName);
            return new ResponseDB<DataCategoryModel>(true, 'queryCategorySuccess', result);
        } else {
            return new ResponseDB<DataCategoryModel>(false, 'invalidDataType');
        }
    }
}

export async function queryCategoryOptions(categoryID: number): Promise<ResponseDB<string[]>> {
    const category = await DataCategory.findOne({
        where: {
            ID: categoryID,
        },

    });
    if (category === null) {
        return new ResponseDB<string[]>(false, 'categoryNotFound');
    } else {
        const options = await CategoryOptions.findAll({
            where: {
                categoryID: categoryID,
            },

        });
        if (options === null) {
            return new ResponseDB<string[]>(false, 'OptionsNotFound');
        } else {
            let result: string[] = [];
            options.forEach((item) => {
                result.push(item.optionsName);
            })
            return new ResponseDB<string[]>(true, 'queryCategoryOptionsSuccess', result);
        }
    }
}

// (async ()=> {
//     DataType.bulkCreate([{
//             typeName: 'txt'
//         }, {
//             typeName: 'enum',
//         }, {
//             typeName: 'TwoDimensional'
//         }]
//     );
// })()


// (async ()=>{
//     await DataCategory.bulkCreate([
//         {categoryName:'1',DataTypeID:1},
//         {categoryName:'2',DataTypeID:1},
//         {categoryName:'3',DataTypeID:1},
//         {categoryName:'4',DataTypeID:1},
//     ]);
//    const re =await listDataCategory(1,2);
//      console.log(re);
// })()

export async function queryCategoryAmount() {
    const amount = await DataCategory.count({
        where: {
            isInRecycleBin: false,
        }
    });
    return new ResponseDB<number>(true, 'queryCategoryAmountSuccess', amount);
}

export async function queryDeletedCategoryAmount() {
    const amount = await DataCategory.count({
        where: {
            isInRecycleBin: true,
        }
    });
    return new ResponseDB<number>(true, 'queryDeletedCategoryAmountSuccess', amount);
}