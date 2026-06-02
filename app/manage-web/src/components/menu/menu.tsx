import { useEffect, useState } from "react";
import { Button, Disclosure, DisclosureGroup } from "@heroui/react";
import { useNavigate, useLocation } from "react-router";
import { routers, type RouterItem } from "@app/manage-web/routers";

function getActiveParent(pathname: string): string | null {
  for (const item of routers) {
    if (
      item.children &&
      item.children.some(
        child => child.path && pathname === child.path
      )
    ) {
      return item.name;
    }
  }
  return null;
}

export default function Menu({ accordion = false }: { accordion?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(() => {
    const active = getActiveParent(location.pathname);
    return active ? new Set([active]) : new Set();
  });

  useEffect(() => {
    const active = getActiveParent(location.pathname);
    if (active) {
      setExpandedKeys(prev => {
        if (accordion) return new Set([active]);
        return new Set([...prev, active]);
      });
    }
  }, [location.pathname, accordion]);

  const renderMenuItem = (item: RouterItem) => {
    if (item.children && item.children.length > 0) {
      return (
        <Disclosure
          key={item.name}
          id={item.name}
        >
          <Disclosure.Heading>
            <Button
              slot="trigger"
              variant="ghost"
              className={`w-full justify-start text-md text-gray-650 font-normal`}
            >
              <span className="flex-1 flex items-center gap-2">
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </span>
              <Disclosure.Indicator />
            </Button>
          </Disclosure.Heading>
          <Disclosure.Content>
            <Disclosure.Body>
              {item.children.map(child => renderMenuItem(child))}
            </Disclosure.Body>
          </Disclosure.Content>
        </Disclosure>
      );
    }

    if (!item.path || !item.isMenu) return null;

    const isActive = location.pathname === item.path;
    const path = item.path;

    return (
      <div key={path} className="my-1">
        <Button
          variant={isActive ? 'tertiary' : 'ghost'}
          size="md"
          className={`w-full justify-start text-md ${isActive ? '' : 'text-gray-650 font-normal'}`}
          onClick={() => navigate(path)}
        >
          {item.icon ? <span className="mr-2">{item.icon}</span> : <span className="mr-3"></span>}
          {item.name}
        </Button>
      </div>
    );
  };

  return (
    <DisclosureGroup
      allowsMultipleExpanded={!accordion}
      expandedKeys={expandedKeys}
      onExpandedChange={(keys) => setExpandedKeys(keys as Set<string>)}
    >
      {routers.map(item => renderMenuItem(item))}
    </DisclosureGroup>
  );
}
