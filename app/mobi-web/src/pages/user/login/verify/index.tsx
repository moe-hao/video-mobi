import { useUserVerifyEmail } from "@app/mobi-web/hooks/user";
import { ChevronLeft } from "@gravity-ui/icons";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";

export default function VerifyLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation('', { keyPrefix: 'user-login-verify' });
  const [searchParams] = useSearchParams();

  const { userLoginEmailVerifyValid, fetchUserVerifyEmail } = useUserVerifyEmail();

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const email = decodeURIComponent(searchParams.get('email') || '');

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    if (pasted.length > 0) {
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleVerify = async () => {
    if (typeof fbq !== 'undefined') {
      fbq('track', 'CompleteRegistration');
    }
    const otpString = otp.join('');
    const result = await fetchUserVerifyEmail({
      email: email,
      code: otpString,
    });
    navigate(`/user/info?code=${result.code}`, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col justify-start pt-32">
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between backdrop-blur-sm p-2 bg-black/90 z-50">
        <button className="bg-transparent border-none cursor-pointer text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center" onClick={() => navigate('/user/login/email')}>
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
      <div className="px-2 py-10 text-center">
        <p className="text-3xl mb-2">{t('verify-code')}</p>
      </div>
      <div className="px-4 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <label className="text-white font-medium">{t('verify-account')}</label>
          <p className="text-sm text-white/50">{t('verify-code-sent-to', { email })}</p>
        </div>
        <div className="flex justify-center">
          <div className="flex gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-10 h-12 text-center text-xl font-bold bg-white/10 text-white rounded-lg border ${!userLoginEmailVerifyValid ? 'border-red-500' : 'border-white/20'} outline-none focus:border-blue-500`}
              />
            ))}
          </div>
        </div>
        {!userLoginEmailVerifyValid && (
          <p className="text-red-500 text-sm text-right">{t('verify-code-error')}</p>
        )}
        <button
          className="w-full py-3 bg-white text-black rounded-lg border-none cursor-pointer font-bold"
          onClick={handleVerify}
        >
          {t('enter')}
        </button>
      </div>
    </div>
  );
}
