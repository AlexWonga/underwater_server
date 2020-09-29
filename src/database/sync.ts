import {sequelize} from './DB'
sequelize.sync({force:true});
