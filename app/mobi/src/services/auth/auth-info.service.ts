import { ResultCode } from "@lib/common/consts/result";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { decrypt } from "@lib/common/utils/aes-encrypt";
import config from "@lib/internal/config";
import { userDao } from "@lib/repo/dao/user.dao";
import { userAuthRedis, type UserAuthInfo } from "@lib/repo/redis/user";
import { verify } from "hono/jwt";

class AuthInfoService {
    async getAuthInfo(token: string): Promise<{ userAuthInfo: UserAuthInfo; authToken: string }> {
        const payload = await this.getPayload(token);

        let authToken = decrypt(payload.token);
        if (!authToken) {
            throw new InternalException(ResultCode.AuthFailed);
        }

        let authInfo = await userAuthRedis.getAuthToken(authToken);
        if (authInfo) {
            return { userAuthInfo: authInfo, authToken };
        }

        const userInfo = await userDao.getUserInfoByAuthToken(authToken);
        if (!userInfo) {
            throw new InternalException(ResultCode.AuthFailed);
        }

        authInfo = {
            id: userInfo.id,
            bizId: userInfo.bizId,
            username: userInfo.username,
            email: userInfo.email,
            userType: userInfo.userType,
        }
        await userAuthRedis.setAuthToken(userInfo.id, authToken, authInfo);
        return { userAuthInfo: authInfo, authToken };
    }

    private async getPayload(token: string): Promise<{ token: string }> {
        try {
            return await verify(token, config.AuthTokenSecret, 'HS256') as { token: string };
        } catch (error) {
            throw new InternalException(ResultCode.AuthFailed);
        }
    }
}

export const authInfoService = new AuthInfoService();
