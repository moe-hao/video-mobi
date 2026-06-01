import { useUserLoginEmail } from "@app/mobi-web/hooks/user";
import { ChevronLeft } from "@gravity-ui/icons";
import { Button, Input, Spinner } from "@heroui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export default function EmailLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation('', {keyPrefix: 'user-login-email'});
  const { fetchUserLoginEmail } = useUserLoginEmail();
  const [email, setEmail] = useState<string>('');
  const [isClickEnterButton, setIsClickEnterButton] = useState<boolean>(false);

  const handleContinue = async () => {
    setIsClickEnterButton(true);
    await fetchUserLoginEmail(email);
    navigate(`/user/login/verify?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-start pt-32">
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between backdrop-blur-sm p-2 bg-black/90 z-50">
        <Button variant="ghost" isIconOnly onPress={() => navigate("/user/login")}>
          <ChevronLeft />
        </Button>
      </div>
      <div className="px-2 py-10 text-center">
        <p className="text-3xl mb-2">{t('email-login')}</p>
      </div>
      <div className="px-4 flex flex-col gap-6">
        <Input
          type="email"
          placeholder={t('email-address')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
        />
        <Button
          variant="danger"
          className="w-full"
          isPending={isClickEnterButton}
          onPress={handleContinue}
        >
          {isClickEnterButton && <Spinner color="current" size="sm" />}
          {t('enter')}
        </Button>
      </div>
    </div>
  );
}
