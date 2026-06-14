import { ResultCode } from "@lib/common/consts/result";
import { UserType } from "@lib/common/consts/user";
import type { GuestLoginReq } from "@lib/common/dto/guest";
import type { UserAuthLoginResp } from "@lib/common/dto/user";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { decrypt, encrypt } from "@lib/common/utils/aes-encrypt";
import { uuid } from "@lib/common/utils/uuid";
import config from "@lib/internal/config";
import { productDao } from "@lib/repo/dao/product.dao";
import { userDao } from "@lib/repo/dao/user.dao";
import { userAuthRedis } from "@lib/repo/redis/user";
import { sign } from "hono/jwt";

class GuestLoginService {
    async login(host: string, param: GuestLoginReq): Promise<UserAuthLoginResp> {
        if (param.code) {
            try {
                const authToken = decrypt(param.code);
                if (authToken) {
                    const authInfo = await userAuthRedis.getAuthToken(authToken);
                    if (authInfo && authInfo.userType === UserType.Guest) {
                        return await this.buildResult(authToken);
                    }

                    const userInfo = await userDao.getUserInfoByAuthToken(authToken);
                    if (userInfo && userInfo.userType === UserType.Guest) {
                        await userAuthRedis.setAuthToken(userInfo.id, authToken, {
                            id: userInfo.id,
                            bizId: userInfo.bizId,
                            username: userInfo.username,
                            email: userInfo.email,
                            userType: userInfo.userType,
                        });
                        return await this.buildResult(authToken);
                    }
                }
            } catch (error) {
                if (error instanceof InternalException && error.code === ResultCode.DecryptError.code) {
                    throw new InternalException(ResultCode.AuthFailed);
                }
            }
        }

        return await this.addNewGuest(host);
    }

    private async addNewGuest(host: string): Promise<UserAuthLoginResp> {
        const productInfo = await productDao.getProductByHost(host);
        if (!productInfo) {
            throw new InternalException(ResultCode.ResourceNotFound);
        }

        const userBizId = uuid();
        const authToken = uuid();

        const userId = await userDao.addUser({
            bizId: userBizId,
            username: `g_${userBizId}`,
            authToken: authToken,
            userType: UserType.Guest,
            productId: productInfo.id,
        });

        await userAuthRedis.setAuthToken(userId, authToken, {
            id: userId,
            bizId: userBizId,
            username: `g_${userBizId}`,
            email: '',
            userType: UserType.Guest,
        });

        return await this.buildResult(authToken);
    }

    private async buildResult(authToken: string): Promise<UserAuthLoginResp> {
        authToken = encrypt(authToken, config.EncryptVector);
        const payload = { token: authToken };
        const token = await sign(payload, config.AuthTokenSecret, 'HS256');
        return { authToken: token, code: authToken };
    }
}

export const guestLoginService = new GuestLoginService();
