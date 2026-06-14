import { Hono } from "hono";
import auth from "./controllers/auth";
import user from "./controllers/user";
import collection from "./controllers/collection";
import collectionFeature from "./controllers/collection-feature";
import collectionVideo from "./controllers/collection-video";
import order from "./controllers/order";
import subscription from "./controllers/subscription";
import product from "./controllers/product";
import { authMiddleware } from "./middlewares/auth-middleware";
import sku from "./controllers/sku";

const router = new Hono();
router.use(authMiddleware);

router.route('/auth', auth);
router.route('/user', user);
router.route('/collection', collection);
router.route('/collection_feature', collectionFeature);
router.route('/collection_video', collectionVideo);
router.route('/order', order);
router.route('/subscription', subscription);
router.route('/product', product);
router.route('/sku', sku);

export default router;
