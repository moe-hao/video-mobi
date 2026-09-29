import { Hono } from "hono";
import auth from "./controllers/auth.ts";
import video from "./controllers/video.ts";
import collection from "./controllers/collection.ts";
import sku from "./controllers/sku.ts";
import order from "./controllers/order.ts";
import member from "./controllers/member.ts";
import product from "./controllers/product.ts";
import feedback from "./controllers/feedback.ts";
import subscription from "./controllers/subscription.ts";
import { userAuthInfoMiddleware } from "./middlewares/user-middleware.ts";
import history from "./controllers/history.ts";

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
