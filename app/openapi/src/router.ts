import { errorHandler } from "@lib/middleware/error-handler";
import { Hono } from "hono";
import payermax from "./controllers/payermax";
import paypal from "./controllers/paypal";
import payssion from "./controllers/payssion";
import antom from "./controllers/antom";
import useepay from "./controllers/useepay";

const router = new Hono();
router.onError(errorHandler);

router.route('/payermax', payermax);
router.route('/paypal', paypal);
router.route('/payssion', payssion);
router.route('/antom', antom);
router.route('/useepay', useepay);

export default router;
