import { ChevronLeft, Envelope } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export default function UserLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation('', {keyPrefix: 'user-login'});

  const handleEmailLogin = () => {
    navigate('/user/login/email');
  };

  // const handleFacebookLogin = () => {
  //   console.log('Facebook login');
  // };

  // const onSignIn = (userInfo: any) => {
  //   console.log(userInfo);
  // }

  return (
    <div className="min-h-screen flex flex-col justify-center">
      {/* <script src="https://apis.google.com/js/platform.js" async defer></script> */}
      {/* <meta name="google-signin-client_id" content="387462567953-1fdi5brbcq4jv342gfc5jt4keai6ersv.apps.googleusercontent.com"></meta> */}
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between backdrop-blur-sm p-2 bg-black/90 z-50">
        <Button variant="ghost" isIconOnly onPress={() => navigate('/user/info')}>
          <ChevronLeft />
        </Button>
      </div>
      <div className="px-4 py-12 text-center">
        <p className="text-3xl mb-2">👏🏻{t('welcome')}</p>
        <p className="text-white/80 text-base">{t('enter-to-blue-arc')}</p>
      </div>
      <div className="px-4 flex flex-col gap-4">
        {/* <div className="w-full h-12 bg-[#4285F4] flex items-center justify-center rounded-[0.375rem]">
          <div
            className="overflow-hidden g-signin2"
            data-onsuccess="onSignIn"
            data-width="240"
            data-height="40"
            data-theme="dark"
            data-longtitle="true"
          ></div>
        </div> */}
        <Button
          className="w-full h-12 text-base font-medium bg-primary text-white"
          onPress={handleEmailLogin}
        >
          <Envelope />
          {t('email-login')}
        </Button>

        {/* <Button
          className="w-full h-12 text-base font-medium bg-blue-600 text-white"
          onPress={handleFacebookLogin}
        >
          <LogoFacebook />
          Facebook
        </Button> */}
      </div>
    </div>
  )
}
