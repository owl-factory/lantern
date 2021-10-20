import React from "react";
import { IconType } from "react-icons";
import { MdGridOn } from "react-icons/md";
import style from "./Drawer.module.scss";

/**
 * Either sets a new tab key or unsets the current tab key
 * @param _key The active tab key to set or unset
 * @param activeTab The currently active tab key
 * @param setActiveTab The function to set the new active tab key
 */
function onTabClick(_key: number, tab: number, setTab: (key: number) => void) {
  if (_key === tab) {
    setTab(-1);
    return;
  }
  setTab(_key);
}

interface DrawerTabProps {
  _key: number;
  tab: number;
  Icon: IconType;
  name: string;
  setTab: (_key: number) => void;
}

/**
 * Renders a tab to select or deselect the current tab to render
 * @param _key The key to determine if this tab is active
 * @param activeTab The currently active tab key
 * @param name The name of the tab and content that this tab will open
 * @param setActiveTab The function to set the new active key
 */
function DrawerTab({ _key, tab, Icon, name, setTab }: DrawerTabProps) {
  const activeClass = tab === _key ? style.active : "";
  return (
    <div className={`${style.tab} ${activeClass}`} onClick={() => onTabClick(_key, tab, setTab)}>
      <div className={style.tabIcon}><Icon/></div>
      {name}
    </div>
  );
}

interface DrawerItemWrapperProps {
  _key: number;
  tab: number;
  children: React.ReactElement;
}

/**
 * Wraps a drawer item to apply style transformations and have pop out and otherwise be displayed
 * @param _key The key to determine if this drawer item is active
 * @param activeTab The currently active tab key
 * @param children The drawer item to wrap
 */
function DrawerContentWrapper({ _key, tab, children }: DrawerItemWrapperProps) {
  const activeClass = tab === _key ? style.open : "";
  return (
    <div className={`${style.content} ${activeClass}`}>
      { children }
    </div>
  );
}

interface DrawerContentProps {
  children: any;
  name: string;
  Icon: IconType;
}

/**
 * Renders a drawer item within a drawer, as well as containing instructions for how to render a tab
 * @param children The contents to render within the drawer.
 * @param name The name of the drawer, to be displayed in the selection tab
 */
export function DrawerContent({ children, name, Icon }: DrawerContentProps): JSX.Element {
  return (
    <div>
      <div><Icon/> {name}</div>
      {children}
    </div>
  );
}

interface DrawerProps {
  children: any;
}

export function Drawer({children}: DrawerProps) {
  const [tab, setTab] = React.useState(-1);
  const drawerContents: JSX.Element[] = [];
  const drawerTabs: JSX.Element[] = [];

  let childrenArray: JSX.Element[] = [];

  if (!children) { return <></>; }
  if (!Array.isArray(children)) { childrenArray.push(children); }
  else { childrenArray = children; }

  childrenArray.forEach((child: JSX.Element, index: number) => {
    if (child.type?.name !== "DrawerContent") { return; }
    drawerTabs.push(
      <DrawerTab
        key={index}
        _key={index}
        Icon={child.props.Icon}
        name={child.props.name}
        tab={tab}
        setTab={setTab}
      />
    );
    drawerContents.push(
      <DrawerContentWrapper
        key={index}
        _key={index}
        tab={tab}
      >
        {child}
      </DrawerContentWrapper>
    );
  });

  return (
    <div className={`${style.drawer} ${tab !== -1 ? style.open : "" }`}>
      <div className={style.contentContainer}>
        {drawerContents}
      </div>
      <div className={style.tabContainer}>
        {drawerTabs}
      </div>
    </div>
  );
}
