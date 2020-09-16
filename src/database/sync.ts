import {sequelize} from './DB'

import {Article} from "./Models/ArticleModel";

sequelize.addModels([Article]);
Article.sync({force:true});
