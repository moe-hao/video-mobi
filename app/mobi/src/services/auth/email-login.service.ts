import { DeleteStatus } from "@lib/common/consts/common-status";
import { ResultCode } from "@lib/common/consts/result";
import { UserType } from "@lib/common/consts/user";
import type { SendEmailCodeReq, VerifyEmailCodeReq } from "@lib/common/dto/email/email.schema";
import type { UserAuthLoginResp } from "@lib/common/dto/user";
import { InternalException } from "@lib/common/exceptions/internal-exception";
import { encrypt } from "@lib/common/utils/aes-encrypt";
import { currentTime } from "@lib/common/utils/time";
import { uuid } from "@lib/common/utils/uuid";
import config from "@lib/internal/config";
import { memberDao } from "@lib/repo/dao/member.dao";
import { userDao } from "@lib/repo/dao/user.dao";
import type { UserSelect } from "@lib/repo/models/user";
import { sendEmailVerify } from "@lib/repo/proxy/email/send";
import { authVerifyRedis } from "@lib/repo/redis/auth-verify";
import { userAuthRedis, type UserAuthInfo } from "@lib/repo/redis/user";
import { sign } from "hono/jwt";



class AuthEmailLoginService {
    async sendCode(param: SendEmailCodeReq): Promise<string> {
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        await authVerifyRedis.setAuthVerifyCode(param.email, verifyCode);
        await sendEmailVerify(param.email, verifyCode);
        return verifyCode;
    }

    async verifyCode(req: VerifyEmailCodeReq, guestInfo: UserAuthInfo): Promise<UserAuthLoginResp> {
        const savedVerifyCode = await authVerifyRedis.getAuthVerifyCode(req.email);
        if (savedVerifyCode !== req.code) {
            throw new InternalException(ResultCode.AuthLoginFailed.code, 'Invalid verify code');
        }

        const savedUserInfo = await userDao.getUserInfoByEmail(req.email);

        let loginUserId = guestInfo.id;
        if (!savedUserInfo) {
            await this.changeGuestToUser(req.email, guestInfo);
        } else if (savedUserInfo && savedUserInfo.id !== guestInfo.id) {
            await this.mergeGuestToUser(savedUserInfo, guestInfo);
            loginUserId = savedUserInfo.id;
        } else {
            if (savedUserInfo.userType !== UserType.User) {
                await userDao.updateUserInfoById(savedUserInfo.id, {
                    authToken: uuid(),
                    userType: UserType.User,
                    updateTime: currentTime(),
                });
            }
            loginUserId = savedUserInfo.id;
        }

        const loginUserInfo = await userDao.getUserInfoById(loginUserId);
        if (!loginUserInfo) {
            throw new InternalException(ResultCode.AuthLoginFailed.code, 'Invalid login user');
        }

        const authToken = loginUserInfo.authToken;
        await userAuthRedis.setAuthToken(loginUserInfo.id, authToken, {
            id: loginUserInfo.id,
            bizId: loginUserInfo.bizId,
            username: loginUserInfo.username,
            email: loginUserInfo.email,
            userType: loginUserInfo.userType,
        });

        const code = encrypt(authToken, config.EncryptVector);
        const payload = { token: code };
        const token = await sign(payload, config.AuthTokenSecret);
        return { authToken: token, code: code };
    }

    private async changeGuestToUser(email: string, guestInfo: UserAuthInfo): Promise<void> {
        await userDao.updateUserInfoById(guestInfo.id, {
            email: email,
            username: email,
            userType: UserType.User,
            updateTime: currentTime(),
        });
    }

    private async mergeGuestToUser(savedUserInfo: UserSelect, guestInfo: UserAuthInfo): Promise<void> {
        await userDao.updateUserInfoById(guestInfo.id, {
            isDeleted: DeleteStatus.Deleted,
            updateTime: currentTime(),
        });

        await this.mergeMemberTimeToUser(savedUserInfo, guestInfo);

        const authToken = uuid();
        await userDao.updateUserInfoById(savedUserInfo.id, {
            authToken: authToken,
            userType: UserType.User,
            updateTime: currentTime()
        });
    }

    private async mergeMemberTimeToUser(savedUserInfo: UserSelect, guestInfo: UserAuthInfo): Promise<void> {
        const nowTime = currentTime();
        let shouldAddMemberTime = 0;
        const guestMemberInfo = await memberDao.getMemberByUserId(guestInfo.id);
        if (guestMemberInfo && guestMemberInfo.expireTime > nowTime) {
            shouldAddMemberTime = guestMemberInfo.expireTime - nowTime;
        }

        const userMemberInfo = await memberDao.getMemberByUserId(savedUserInfo.id);
        if (!userMemberInfo) {
            await memberDao.addMember({
                userId: savedUserInfo.id,
                expireTime: nowTime + shouldAddMemberTime,
                createTime: nowTime,
                updateTime: nowTime,
            });
        }

        if (userMemberInfo && userMemberInfo.expireTime < nowTime) {
            await memberDao.updateMemberByUserId(savedUserInfo.id, {
                expireTime: nowTime + shouldAddMemberTime,
                updateTime: nowTime,
            });
        }

        if (userMemberInfo && userMemberInfo.expireTime > nowTime) {
            await memberDao.updateMemberByUserId(savedUserInfo.id, {
                expireTime: userMemberInfo.expireTime + shouldAddMemberTime,
                updateTime: nowTime,
            });
        }
    }
}

export const authEmailLoginService = new AuthEmailLoginService();
