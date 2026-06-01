import Navigation from "@app/mobi-web/components/navigation";
import Payment from "@app/mobi-web/components/payment";
import { useTranslation } from "react-i18next";

export default function UserStore() {
  const { t } = useTranslation('', { keyPrefix: 'user-store' });

  return (
    <div className='flex-1 bg-black overflow-auto'>
      <Navigation backTo="/user/info" />
      <div className="pt-16 p-4">
        <h1 className="text-lg font-bold text-white p-2 mb-8">{t('subscribe')}</h1>
        <Payment />
      </div>
    </div>
  );
}
