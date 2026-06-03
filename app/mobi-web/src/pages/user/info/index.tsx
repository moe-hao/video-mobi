import { Avatar, Button, Card, ListBox, Spinner } from "@heroui/react";
import { useEffect } from "react";
import { ArrowUpRight, Headphones, Person, ShieldKeyhole } from "@gravity-ui/icons";
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
  const { userSubscriptionDetailState, fetchUserSubscriptionInfo } = useUserSubscriptionInfo();

  useEffect(() => {
    fetchUserMemberInfo();
    fetchUserSubscriptionInfo();
  }, [userInfo]);

  const showUserOperateButton = () => {
    if (userMemberInfoState.expireTime > currentTime()) {
      return (
        <Button variant="danger" className="w-full" isDisabled={true}>
          {t('expiration-time')}: {new Date(userMemberInfoState.expireTime * 1000).toLocaleString()}
        </Button>
      )
    }
    return <Button variant="danger" className="w-full" onPress={() => navigate('/user/store')}>{t('subscribe')}</Button>
  }


  return (
    <div className='flex-1 bg-black overflow-auto'>
      <div className="pt-10 p-4">
        {!userInfo ? (
          <div className="flex items-center justify-center pt-20">
            <Spinner />
          </div>
        ) : (
          <>
            <h1 className="text-lg font-bold text-white p-2">{t('profile')}</h1>
            <Card className="w-full mb-4 bg-gradient-to-b from-purple-600 to-purple-600/30 border-none">
              <Card.Content className="flex flex-row items-center justify-between gap-4 p-2">
                <div className="flex flex-1 items-center gap-4 min-w-0">
                  <Avatar size="md" className="rounded-full">
                    <Avatar.Fallback><Person /></Avatar.Fallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <h2 className="text-lg font-bold text-white truncate">{userInfo.username}</h2>
                  </div>
                </div>
                {userInfo.userType === UserType.Guest && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 border-2 border-white/50 text-white bg-transparent"
                    onPress={() => navigate('/user/login')}
                  >
                    {t('login-now')}
                  </Button>
                )}
              </Card.Content>
              <Card.Footer className="mt-auto flex w-full flex-col items-start gap-3 p-2">
                {userSubscriptionDetailState.isCanceled &&
                  <Button variant="outline" className="w-full border-2 border-white/50 text-white bg-transparent" isDisabled={true}>Subscription Canceled</Button>
                }
                {showUserOperateButton()}
              </Card.Footer>
            </Card>
            <ListBox aria-label="user-actions" className="w-full gap-8 py-6" selectionMode="single">
              <ListBox.Item id="feedback" textValue="Feedback" className="px-0" onPress={() => navigate('/user/feedback')}>
                <div className="flex items-start justify-center pt-px">
                  <Headphones className="size-6 shrink-0 text-muted" />
                </div>
                <div className="flex flex-col">Feedback</div>
                <ArrowUpRight className="ms-auto size-4 shrink-0 text-muted" />
              </ListBox.Item>
              <ListBox.Item id="terms-of-service" textValue="Terms of Service" className="px-0" onPress={() => { window.location.href = '/terms/terms-of-service.html'; }}
              >
                <div className="flex items-start justify-center pt-px">
                  <Person className="size-6 shrink-0 text-muted" />
                </div>
                <div className="flex flex-col">Terms of Service</div>
                <ArrowUpRight className="ms-auto size-4 shrink-0 text-muted" />
              </ListBox.Item>
              <ListBox.Item id="privacy-policy" textValue="Privacy Policy" className="px-0" onPress={() => { window.location.href = '/terms/privacy-policy.html'; }}
              >
                <div className="flex items-start justify-center pt-px">
                  <ShieldKeyhole className="size-6 shrink-0 text-muted" />
                </div>
                <div className="flex flex-col">Privacy Policy</div>
                <ArrowUpRight className="ms-auto size-4 shrink-0 text-muted" />
              </ListBox.Item>
            </ListBox>
          </>
        )}
      </div>
    </div>
  );
}


