import Payment from "@app/mobi-web/components/payment";
import { ChevronLeft } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export default function UserStore() {
  const { t } = useTranslation('', { keyPrefix: 'user-store' });
  const navigate = useNavigate();

  return (
    <div className='flex-1 bg-black overflow-auto'>
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between backdrop-blur-sm p-2 bg-black/90 z-50">
        <Button variant="ghost" isIconOnly onPress={() => navigate('/user/info')}>
          <ChevronLeft />
        </Button>
      </div>
      <div className="pt-10 p-4">
        <h1 className="text-lg font-bold text-white p-2 mb-8">{t('subscribe')}</h1>
        <Payment />
      </div>
    </div>
  );
}
