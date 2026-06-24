import { useUserVerifyEmail } from "@app/mobi-web/hooks/user";
import { ChevronLeft } from "@gravity-ui/icons";
import { Button, FieldError, InputOTP, Label, TextField } from "@heroui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";

export default function VerifyLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation('', { keyPrefix: 'user-login-verify' });
  const [searchParams] = useSearchParams();

  const { userLoginEmailVerifyValid, fetchUserVerifyEmail } = useUserVerifyEmail();

  const [otp, setOtp] = useState("");
  const email = decodeURIComponent(searchParams.get('email') || '');

  const handleVerify = async () => {
    const result = await fetchUserVerifyEmail({
      email: email,
      code: otp,
    });
    navigate(`/user/info?code=${result.code}`, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col justify-start pt-32">
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between backdrop-blur-sm p-2 bg-black/90 z-50">
        <Button variant="ghost" isIconOnly onPress={() => navigate('/user/login/email')}>
          <ChevronLeft />
        </Button>
      </div>
      <div className="px-2 py-10 text-center">
        <p className="text-3xl mb-2">{t('verify-code')}</p>
      </div>
      <div className="px-4 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Label>{t('verify-account')}</Label>
          <p className="text-sm text-muted">{t('verify-code-sent-to', { email })}</p>
        </div>
        <div className="flex justify-center">
          <TextField className="w-64" isInvalid={!userLoginEmailVerifyValid}>
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTP.Group>
                <InputOTP.Slot index={0} />
                <InputOTP.Slot index={1} />
                <InputOTP.Slot index={2} />
                <InputOTP.Slot index={3} />
                <InputOTP.Slot index={4} />
                <InputOTP.Slot index={5} />
              </InputOTP.Group>
            </InputOTP>
            <FieldError className="text-right py-2">{t('verify-code-error')}</FieldError>
          </TextField>
        </div>
        <Button className="w-full bg-white text-black" variant="ghost" onPress={handleVerify}>{t('enter')}</Button>
      </div>
    </div>
  );
}
