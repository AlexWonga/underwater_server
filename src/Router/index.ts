import Router from 'koa-router';


const router = new Router();


require('./ArticleMiddleware')(router);
require('./UserSupervisorMiddleware')(router);
require('./UserMiddleware')(router);
require('./GetSiteSettingMiddleware')(router);
require('./PostSiteSettingMiddleware')(router);
require('./VerificationMiddleware/CheckSessionExist')(router);
require('./DataCategoryMiddleware')(router);
require('./ManufacturerMiddleware')(router);
require('./DeviceMiddleware')(router);
require("./TwoDimensionalDataMiddleware")(router);
// require('./Test')(Router);
export {router};