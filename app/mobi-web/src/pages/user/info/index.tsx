import { Avatar, Button, Card, ListBox, Spinner } from "@heroui/react";
import { useEffect } from "react";
import { ChevronRight, Headphones, Person, ShieldKeyhole } from "@gravity-ui/icons";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { UserType } from "@lib/common/consts/user";
import { currentTime } from "@lib/common/utils/time";
import { useVideoMobiContext } from "@app/mobi-web/contexts/video-mobi-context";
import { useUserMemberInfo, useUserSubscriptionInfo } from "@app/mobi-web/hooks/user";

export default function UserInfo() {
  const navigate = useNavigate();
  const { t } = useTranslation('', { keyPrefix: 'user-info' });
  const { userInfo } = useVideoMobiContext();
  const { userMemberInfoState, fetchUserMemberInfo } = useUserMemberInfo();
  const { fetchUserSubscriptionInfo } = useUserSubscriptionInfo();

  useEffect(() => {
    fetchUserMemberInfo();
    fetchUserSubscriptionInfo();
  }, [userInfo]);

  return (
    <div className='flex-1 bg-black overflow-auto'>
      {!userInfo ? (
        <div className="flex items-center justify-center pt-20">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex flex-1 items-center gap-4 min-w-0 pt-16 pb-8 p-4">
            <Avatar className="rounded-full size-14">
              <Avatar.Fallback><Person /></Avatar.Fallback>
            </Avatar>
            <div className="flex flex-1 flex-col gap-1 min-w-0">
              <span className="text-base font-bold text-white truncate">{userInfo.username}</span>
              <span className="text-xs font-normal text-white truncate">UID: {userInfo.bizId}</span>
            </div>
            {userInfo.userType === UserType.Guest && (
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 border-1.5 border-white/50 text-white bg-white/20"
                onPress={() => navigate('/user/login')}
              >
                {t('login-now')}
              </Button>
            )}
          </div>

          <div className="rounded-[1.5rem] bg-gradient-to-b from-[#232323cc] to-black p-4 backdrop-blur-[10px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(0,0,0,0.3)]">
            <Card className="w-full mb-4 bg-gradient-to-r from-[#3D4AE0] to-[#84A1FF] border-none rounded-[1.5rem]" onClick={() => navigate('/user/store')}>
              <Card.Content className="flex flex-row items-center justify-between gap-4 px-1 py-1">
                <div className="flex flex-1 items-center gap-4 min-w-0">
                  <img src="https://s01.bluearcshow.com/images/vip.png" alt="premium" className="size-14" />
                  <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <h2 className="text-lg font-bold italic text-white truncate font-[Anton] tracking-wider">Blue Arc Premium</h2>
                    {
                      userMemberInfoState.expireTime > currentTime() ? (
                        <span className="text-[12px] text-white truncate">
                          {t('expiration-time')}: {new Date(userMemberInfoState.expireTime * 1000).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-[12px] text-white truncate">All Episodes Free</span>
                      )
                    }
                  </div>
                </div>
                <ChevronRight />
              </Card.Content>
            </Card>
            <ListBox aria-label="user-actions" className="w-full gap-6 py-6" selectionMode="single">
              <ListBox.Item id="feedback" textValue="Feedback" className="px-0" onPress={() => navigate('/user/feedback')}>
                <div className="flex items-start justify-center pt-px">
                  <Headphones className="size-6 shrink-0 text-muted" />
                </div>
                <div className="flex flex-col">Feedback</div>
                <ChevronRight className="ms-auto size-4 shrink-0 text-muted" />
              </ListBox.Item>
              <ListBox.Item id="terms-of-service" textValue="Terms of Service" className="px-0" onPress={() => { window.location.href = '/terms/terms-of-service.html'; }}
              >
                <div className="flex items-start justify-center pt-px">
                  <Person className="size-6 shrink-0 text-muted" />
                </div>
                <div className="flex flex-col">Terms of Service</div>
                <ChevronRight className="ms-auto size-4 shrink-0 text-muted" />
              </ListBox.Item>
              <ListBox.Item id="privacy-policy" textValue="Privacy Policy" className="px-0" onPress={() => { window.location.href = '/terms/privacy-policy.html'; }}
              >
                <div className="flex items-start justify-center pt-px">
                  <ShieldKeyhole className="size-6 shrink-0 text-muted" />
                </div>
                <div className="flex flex-col">Privacy Policy</div>
                <ChevronRight className="ms-auto size-4 shrink-0 text-muted" />
              </ListBox.Item>
            </ListBox>
          </div>
        </>
      )}
    </div>
  );
}


