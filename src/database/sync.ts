import {sequelize} from './DB'
import {DeviceFile} from "./Models/DeviceModel";
sequelize.addModels([DeviceFile]);
DeviceFile.sync({force:true});