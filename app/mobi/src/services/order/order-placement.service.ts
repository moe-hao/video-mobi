import type { OrderCreateReq, OrderCreateResp } from "@lib/common/dto/order";
import type { UserAuthInfo } from "@lib/repo/redis/user";

export const orderPlacementService = {
    create: async (host: string, userInfo: UserAuthInfo, body: OrderCreateReq): Promise<OrderCreateResp> => {
        return {} as OrderCreateResp;
    }
}
