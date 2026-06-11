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
    <div
      className="h-[calc(100vh-64px)] flex-1 flex flex-col justify-center relative"
      style={{
        background: `
          radial-gradient(3px 3px at 8% 3%, rgba(255,255,255,0.95) 50%, transparent 50%),
          radial-gradient(1.5px 1.5px at 15% 8%, rgba(255,255,255,0.9) 50%, transparent 50%),
          radial-gradient(1px 1px at 35% 4%, rgba(255,255,255,0.85) 50%, transparent 50%),
          radial-gradient(2px 2px at 75% 12%, rgba(255,255,255,0.85) 50%, transparent 50%),
          radial-gradient(1px 1px at 50% 5%, rgba(255,255,255,0.8) 50%, transparent 50%),
          radial-gradient(2.5px 2.5px at 30% 18%, rgba(255,255,255,0.75) 50%, transparent 50%),
          radial-gradient(1px 1px at 85% 6%, rgba(255,255,255,0.7) 50%, transparent 50%),
          radial-gradient(1.5px 1.5px at 60% 10%, rgba(255,255,255,0.8) 50%, transparent 50%),
          radial-gradient(1px 1px at 22% 16%, rgba(255,255,255,0.78) 50%, transparent 50%),
          radial-gradient(2px 2px at 10% 25%, rgba(255,255,255,0.7) 50%, transparent 50%),
          radial-gradient(1px 1px at 95% 20%, rgba(255,255,255,0.72) 50%, transparent 50%),
          radial-gradient(1px 1px at 40% 14%, rgba(255,255,255,0.75) 50%, transparent 50%),
          radial-gradient(1.5px 1.5px at 90% 22%, rgba(255,255,255,0.7) 50%, transparent 50%),
          radial-gradient(1px 1px at 68% 24%, rgba(255,255,255,0.68) 50%, transparent 50%),
          radial-gradient(2.5px 2.5px at 52% 27%, rgba(255,255,255,0.65) 50%, transparent 50%),
          radial-gradient(1px 1px at 20% 32%, rgba(255,255,255,0.65) 50%, transparent 50%),
          radial-gradient(2px 2px at 65% 28%, rgba(255,255,255,0.6) 50%, transparent 50%),
          radial-gradient(1px 1px at 8% 34%, rgba(255,255,255,0.62) 50%, transparent 50%),
          radial-gradient(1px 1px at 5% 38%, rgba(255,255,255,0.55) 50%, transparent 50%),
          radial-gradient(1.5px 1.5px at 45% 35%, rgba(255,255,255,0.6) 50%, transparent 50%),
          radial-gradient(1px 1px at 78% 15%, rgba(255,255,255,0.7) 50%, transparent 50%),
          radial-gradient(1px 1px at 55% 40%, rgba(255,255,255,0.5) 50%, transparent 50%),
          radial-gradient(1.5px 1.5px at 82% 38%, rgba(255,255,255,0.52) 50%, transparent 50%),
          radial-gradient(1px 1px at 33% 44%, rgba(255,255,255,0.48) 50%, transparent 50%),
          radial-gradient(2px 2px at 25% 50%, rgba(255,255,255,0.45) 50%, transparent 50%),
          radial-gradient(1px 1px at 80% 48%, rgba(255,255,255,0.5) 50%, transparent 50%),
          radial-gradient(1px 1px at 58% 47%, rgba(255,255,255,0.47) 50%, transparent 50%),
          radial-gradient(1.5px 1.5px at 12% 58%, rgba(255,255,255,0.4) 50%, transparent 50%),
          radial-gradient(1px 1px at 70% 55%, rgba(255,255,255,0.45) 50%, transparent 50%),
          radial-gradient(1px 1px at 88% 56%, rgba(255,255,255,0.42) 50%, transparent 50%),
          radial-gradient(1.5px 1.5px at 40% 60%, rgba(255,255,255,0.38) 50%, transparent 50%),
          radial-gradient(1px 1px at 35% 65%, rgba(255,255,255,0.35) 50%, transparent 50%),
          radial-gradient(1.5px 1.5px at 90% 62%, rgba(255,255,255,0.4) 50%, transparent 50%),
          radial-gradient(1px 1px at 18% 67%, rgba(255,255,255,0.32) 50%, transparent 50%),
          radial-gradient(1px 1px at 50% 70%, rgba(255,255,255,0.3) 50%, transparent 50%),
          radial-gradient(1.5px 1.5px at 77% 72%, rgba(255,255,255,0.28) 50%, transparent 50%),
          radial-gradient(1px 1px at 15% 78%, rgba(255,255,255,0.25) 50%, transparent 50%),
          radial-gradient(2px 2px at 60% 82%, rgba(255,255,255,0.2) 50%, transparent 50%),
          radial-gradient(1px 1px at 85% 75%, rgba(255,255,255,0.25) 50%, transparent 50%),
          radial-gradient(1px 1px at 28% 84%, rgba(255,255,255,0.18) 50%, transparent 50%),
          radial-gradient(1px 1px at 40% 88%, rgba(255,255,255,0.15) 50%, transparent 50%),
          radial-gradient(1.5px 1.5px at 72% 92%, rgba(255,255,255,0.12) 50%, transparent 50%),
          radial-gradient(1px 1px at 55% 90%, rgba(255,255,255,0.14) 50%, transparent 50%),
          radial-gradient(1px 1px at 92% 88%, rgba(255,255,255,0.1) 50%, transparent 50%),
          #000000
        `
      }}
    >
      {/* <script src="https://apis.google.com/js/platform.js" async defer></script> */}
      {/* <meta name="google-signin-client_id" content="387462567953-1fdi5brbcq4jv342gfc5jt4keai6ersv.apps.googleusercontent.com"></meta> */}
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between backdrop-blur-sm p-2 bg-black/90 z-50">
        <Button variant="ghost" isIconOnly onPress={() => navigate('/user/info')}>
          <ChevronLeft />
        </Button>
      </div>
      <div className="px-4 pb-12 text-center">
        <img src="/logo.png" alt="logo" className="w-[128px] mx-auto" />
        <p className="text-3xl mb-2 font-[anton] text-[30px]">Blue Arc</p>
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
          className="w-full bg-white text-black" variant="ghost"
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
