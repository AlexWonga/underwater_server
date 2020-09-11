import {Sequelize} from 'sequelize-typescript';
import DatabaseConfig from "../config/DatabaseConfig";

const sequelize = new Sequelize(
    // 'postgres',
    // 'postgres',
    // 'postgres',
    'sys',
    'root',
    'wangruifeng0001',
    DatabaseConfig,
);//数据库实例

//sequelize.addModels([path.join(__dirname,'Models')]);
export {sequelize};


