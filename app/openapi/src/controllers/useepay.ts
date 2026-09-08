import { Hono } from "hono";

const useepay = new Hono();

useepay.post("/webhook", async (c) => {
    const req = await c.req.json();
    console.log(req);
});

export default useepay;
