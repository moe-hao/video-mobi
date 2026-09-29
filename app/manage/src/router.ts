import { Hono } from "hono";
import auth from "./controllers/auth.ts";
import user from "./controllers/user.ts";
import collection from "./controllers/collection.ts";
import collectionFeature from "./controllers/collection-feature.ts";
import collectionVideo from "./controllers/collection-video.ts";
import order from "./controllers/order.ts";
import subscription from "./controllers/subscription.ts";
import product from "./controllers/product.ts";
import { authMiddleware } from "./middlewares/auth-middleware.ts";
import sku from "./controllers/sku.ts";
import report from "./controllers/report.ts";
import paymentOption from "./controllers/payment-option.ts";
import memberRetrieve from "./controllers/member-retrieve.ts";


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
router.route('/report', report);
router.route('/payment_option', paymentOption);
router.route('/member_retrieve', memberRetrieve);

export default router;
