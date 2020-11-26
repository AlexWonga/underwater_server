import {Sequelize} from 'sequelize-typescript';
import DatabaseConfig from "../config/DatabaseConfig";

const sequelize = new Sequelize(
    // 'postgres',
    // 'postgres',
    // 'postgres',
    'underwater',
    'root',
    'wangruifeng0001',
    // 'sys',
    // 'root',
    // 'wangruifeng0001',

    // 'underwater',
    // 'root',
    // 'mysql',
    DatabaseConfig,
);//数据库实例

//sequelize.addModels([path.join(__dirname,'Models')]);
export {sequelize};




