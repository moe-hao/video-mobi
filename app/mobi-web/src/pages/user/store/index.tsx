import Payment from "@app/mobi-web/components/payment";
import { ChevronLeft } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export default function UserStore() {
  const { t } = useTranslation('', { keyPrefix: 'user-store' });
  const navigate = useNavigate();

  return (
    <div className="flex-1 min-h-full bg-[radial-gradient(circle_at_15%_25%,rgba(255,255,255,0.3)_1px,transparent_1px),radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.2)_1px,transparent_1px),radial-gradient(circle_at_30%_55%,rgba(255,255,255,0.15)_1.5px,transparent_1.5px),radial-gradient(circle_at_75%_40%,rgba(255,255,255,0.2)_1px,transparent_1px),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.25)_1px,transparent_1px),radial-gradient(circle_at_10%_70%,rgba(255,255,255,0.2)_1px,transparent_1px),radial-gradient(circle_at_90%_65%,rgba(255,255,255,0.3)_1px,transparent_1px),radial-gradient(circle_at_55%_15%,rgba(255,255,255,0.15)_1.5px,transparent_1.5px),radial-gradient(circle_at_20%_90%,rgba(255,255,255,0.2)_1px,transparent_1px),radial-gradient(circle_at_70%_85%,rgba(255,255,255,0.3)_1px,transparent_1px),radial-gradient(circle_at_40%_35%,rgba(255,255,255,0.2)_1.5px,transparent_1.5px),radial-gradient(circle_at_95%_30%,rgba(255,255,255,0.15)_1px,transparent_1px),radial-gradient(circle_at_5%_45%,rgba(255,255,255,0.25)_1px,transparent_1px),radial-gradient(circle_at_60%_5%,rgba(255,255,255,0.2)_1px,transparent_1px),radial-gradient(circle_at_80%_95%,rgba(255,255,255,0.15)_1.5px,transparent_1.5px),radial-gradient(circle_at_25%_75%,rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(to_bottom_right,black_0%,#0a0a2e_40%,black_70%)]">
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between backdrop-blur-sm p-2 bg-transparent z-50">
        <Button variant="ghost" isIconOnly onPress={() => navigate('/user/info')}>
          <ChevronLeft />
        </Button>
        <h1 className="text-lg text-white">{t('title')}</h1>
        <div className="w-10" />
      </div>
      <div className="pt-10 p-4">
        <div className="w-full bg-[linear-gradient(to_bottom_left,transparent_0%,transparent_40%,#5365ff33_100%),linear-gradient(to_bottom_right,transparent_0%,transparent_40%,rgba(255,255,255,0.2)_100%)] border-white/20 h-full my-4 mb-8 px-4 py-4 rounded-[1.5rem] flex flex-col items-center justify-center">
          <div><img src="https://s01.bluearcshow.com/images/vip.png" alt="premium" className="size-20" /></div>
          <div> <h2 className="text-lg italic text-white truncate font-[Anton] tracking-wider px-2">Blue Arc {t('premium')}</h2></div>
          <div className="flex items-center gap-12 my-3">
            <div className="flex flex-col items-center gap-2">
              <img src="https://s01.bluearcshow.com/images/hd.png" alt="hd" className="size-10" />
              <span className="text-xs text-white/70">{t('hd-quality')}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img src="https://s01.bluearcshow.com/images/video.png" alt="video" className="size-10" />
              <span className="text-xs text-white/70">{t('free')}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img src="https://s01.bluearcshow.com/images/tag.png" alt="tag" className="size-10" />
              <span className="text-xs text-white/70">{t('watch-first')}</span>
            </div>
          </div>
        </div>
        <Payment />
      </div>
    </div>
  );
}
