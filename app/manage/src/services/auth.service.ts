import { ResultCode } from "@lib/common/consts/result";
import type { AdminChangePasswordReq, AdminLoginReq, AdminLoginResp } from "@lib/common/dto/admin";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { adminDao } from "@lib/repo/dao/admin.dao";
import { sign, verify } from "hono/jwt";
import { hashPassword, verifyPassword } from "@lib/common/utils/password";
import { uuid } from "@lib/common/utils/uuid";
import { adminAuthRedis, type AdminAuthInfo } from "@lib/repo/redis/admin";
import { decrypt, encrypt } from "@lib/common/utils/aes-encrypt";
import config from "@lib/internal/config";
import { logger } from "@lib/internal/logger";

class AuthService {
    async login(req: AdminLoginReq): Promise<AdminLoginResp> {
        const adminInfo = await adminDao.getAdminInfoByUsername(req.username);
        logger.info(`Login admin info: ${JSON.stringify(adminInfo)}`);
        if (!adminInfo) {
            throw new InternalException(ResultCode.AuthLoginFailed);
        }

        if (!adminInfo.password || !await verifyPassword(req.password, adminInfo.password)) {
            throw new InternalException(ResultCode.AuthLoginFailed);
        }

        const authToken = uuid();
        const authInfo: AdminAuthInfo = {
            id: adminInfo.id,
            username: adminInfo.username,
        }
        await adminAuthRedis.setAuthToken(authToken, authInfo);

        const payload = { token: encrypt(authToken) }
        const token = await sign(payload, config.AuthTokenSecret, 'HS256');
        return { token };
    }

    async logout(token: string): Promise<void> {
        const payload = await verify(token, config.AuthTokenSecret, 'HS256') as { token: string };
        const authToken = decrypt(payload.token);
        await adminAuthRedis.delAuthToken(authToken);
    }

    async getAuthInfoByToken(token: string): Promise<AdminAuthInfo> {
        const payload = await verify(token, config.AuthTokenSecret, 'HS256') as { token: string };
        const authToken = decrypt(payload.token);
        const authInfo = await adminAuthRedis.getAuthToken(authToken);
        if (!authInfo) {
            throw new InternalException(ResultCode.AuthFailed);
        }
        return authInfo;
    }

    async changeAuthPassword(user: AdminAuthInfo, req: AdminChangePasswordReq): Promise<void> {
        const adminInfo = await adminDao.getAdminInfoById(user.id);
        if (!adminInfo) {
            throw new InternalException(ResultCode.ResourceNotFound.code, 'Admin Info Invalid');
        }

        if (!await verifyPassword(req.oldPassword, adminInfo.password)) {
            throw new InternalException(ResultCode.ResourceNotFound.code, 'Admin Info Invalid');
        }

        const newPassword = await hashPassword(req.newPassword);
        await adminDao.updateAdminPasswordById(adminInfo.id, newPassword);
    }
}

export const authService = new AuthService();
