import {sequelize} from './DB'
import {Footer, PlatformOverview} from "./Models/SiteSettingModel";

sequelize.addModels([Footer,PlatformOverview]);
Footer.sync({force:true});
PlatformOverview.sync({force:true});