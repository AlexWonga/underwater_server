import {Sequelize} from 'sequelize-typescript';
import DatabaseConfig from "../Config/DatabaseConfig";

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
    DatabaseConfig,//注意修改数据库配置时也要修改这个
);//数据库实例

//sequelize.addModels([path.join(__dirname,'Models')]);
export {sequelize};




