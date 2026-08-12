import { useUserLoginEmail } from "@app/mobi-web/hooks/user";
import { useToast } from "@app/mobi-web/contexts/toast-context";
import { ChevronLeft } from "@gravity-ui/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export default function EmailLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation('', {keyPrefix: 'user-login-email'});
  const { fetchUserLoginEmail } = useUserLoginEmail();
  const toast = useToast();
  const [email, setEmail] = useState<string>('');
  const [isClickEnterButton, setIsClickEnterButton] = useState<boolean>(false);

  const handleContinue = async () => {
    setIsClickEnterButton(true);
    try {
      await fetchUserLoginEmail(email);
      navigate(`/user/login/verify?email=${encodeURIComponent(email)}`);
    } catch {
      setIsClickEnterButton(false);
      toast.add({ title: t('error'), description: t('error-message'), variant: 'danger' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-start pt-32">
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between backdrop-blur-sm p-2 bg-black/90 z-50">
        <button className="bg-transparent border-none cursor-pointer text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center" onClick={() => navigate("/user/login")}>
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
      <div className="px-2 py-10 text-center">
        <p className="text-3xl mb-2">{t('email-login')}</p>
      </div>
      <div className="px-6 flex flex-col gap-6">
        <input
          type="email"
          placeholder={t('email-address')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 text-white rounded-lg border-none outline-none placeholder-white/50"
        />
        <button
          className="w-full py-3 bg-white text-black rounded-lg border-none cursor-pointer font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          onClick={handleContinue}
          disabled={isClickEnterButton}
        >
          {isClickEnterButton && <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
          {t('enter')}
        </button>
      </div>
    </div>
  );
}
