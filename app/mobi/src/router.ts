import { Hono } from "hono";
import auth from "./controllers/auth";
import video from "./controllers/video";
import collection from "./controllers/collection";
import sku from "./controllers/sku";
import order from "./controllers/order";
import member from "./controllers/member";
import product from "./controllers/product";
import feedback from "./controllers/feedback";
import subscription from "./controllers/subscription";
import { userAuthInfoMiddleware } from "./middlewares/user-middleware";
import history from "./controllers/history";

const router = new Hono();
router.use(userAuthInfoMiddleware);

router.route("/auth", auth);
router.route("/video", video);
router.route("/collection", collection);
router.route("/sku", sku);
router.route("/order", order);
router.route("/member", member);
router.route("/product", product);
router.route("/feedback", feedback);
router.route("/subscription", subscription);
router.route("/history", history);

export default router;
