import { ChevronLeft, CirclePlay, PersonPencil, Bars } from "@gravity-ui/icons";
import { Button, Dropdown } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export default function Navigation({ showBackButton = true, backTo }: { showBackButton?: boolean, backTo?: string }) {
  const navigate = useNavigate();
  const { t } = useTranslation('', { keyPrefix: 'navigation' });

  const handelBackButton = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      if (window.history.length > 1) {
        navigate(-1);
      }
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 flex items-center justify-between backdrop-blur-sm p-2 bg-black/90 z-50">
      {showBackButton && (
        <Button variant="ghost" isIconOnly onPress={handelBackButton}>
          <ChevronLeft />
        </Button>
      )}
      <div className="flex items-center gap-2 p-1">
        <img src="https://s01.bluearcshow.com/video_cover/4dd1b124a604469f8c677aea83d760db.png" alt="logo" width={42} height={42} />
        <h1 className="text-lg font-bold text-white">Blue Arc</h1>
      </div>
      <Dropdown>
        <Button variant="ghost" isIconOnly>
          <Bars />
        </Button>
        <Dropdown.Popover className="w-36">
          <Dropdown.Menu>
            <Dropdown.Item className="h-12" onPress={() => navigate('/')}>
              <CirclePlay className="size-4 shrink-0 text-muted" />
              {t('home')}
            </Dropdown.Item>
            <Dropdown.Item className="h-12"  onPress={() => navigate('/user/info')}>
              <PersonPencil className="size-4 shrink-0 text-muted"/>
              {t('profile')}
            </Dropdown.Item>
            {/* <Dropdown.Item className="h-12">
                <Star className="size-4 shrink-0 text-muted" />
                已收藏
              </Dropdown.Item> */}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
}
