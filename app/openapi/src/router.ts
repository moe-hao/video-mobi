import { errorHandler } from "@lib/middleware/error-handler";
import { Hono } from "hono";
import payermax from "./controllers/payermax";
import paypal from "./controllers/paypal";

const router = new Hono();
router.onError(errorHandler);

router.route('/payermax', payermax);
router.route('/paypal', paypal);

export default router;

