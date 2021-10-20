import React from "react";
import { IconType } from "react-icons";
import { MdGridOn } from "react-icons/md";
import style from "./Drawer.module.scss";

// /**
//  * Either sets a new tab key or unsets the current tab key
//  * @param _key The active tab key to set or unset
//  * @param activeTab The currently active tab key
//  * @param setActiveTab The function to set the new active tab key
//  */
// function onTabClick(_key: number, activeTab: number, setActiveTab: (key: number) => void) {
//   if (_key === activeTab) {
//     setActiveTab(-1);
//     return;
//   }
//   setActiveTab(_key);
// }

// interface DrawerTabProps {
//   _key: number;
//   activeTab: number;
//   Icon: IconType;
//   name: string;
//   setActiveTab: (_key: number) => void;
// }

// /**
//  * Renders a tab to select or deselect the current tab to render
//  * @param _key The key to determine if this tab is active
//  * @param activeTab The currently active tab key
//  * @param name The name of the tab and content that this tab will open
//  * @param setActiveTab The function to set the new active key
//  */
// function DrawerTab({ _key, activeTab, Icon, name, setActiveTab }: DrawerTabProps) {
//   const activeClass = activeTab === _key ? style.active : "";
//   return (
//     <div className={`${style.tab} ${activeClass}`} onClick={() => onTabClick(_key, activeTab, setActiveTab)}>
//       <span className={style.tabIcon}><Icon/></span>
//       <span>{name}</span>
//     </div>
//   );
// }

// interface DrawerItemWrapperProps {
//   _key: number;
//   activeTab: number;
//   children: React.ReactElement;
// }

// /**
//  * Wraps a drawer item to apply style transformations and have pop out and otherwise be displayed
//  * @param _key The key to determine if this drawer item is active
//  * @param activeTab The currently active tab key
//  * @param children The drawer item to wrap
//  */
// function DrawerItemWrapper({ _key, activeTab, children }: DrawerItemWrapperProps) {
//   const activeClass = activeTab === _key ? style.open : "";
//   return (
//     <div className={`${style.contentContainer} ${activeClass}`}>
//       { children }
//     </div>
//   );
// }

// interface DrawerItemProps {
//   children: any;
//   name: string;
//   Icon: IconType;
// }

// /**
//  * Renders a drawer item within a drawer, as well as containing instructions for how to render a tab
//  * @param children The contents to render within the drawer.
//  * @param name The name of the drawer, to be displayed in the selection tab
//  */
// export function DrawerItem({ children, name, Icon }: DrawerItemProps): JSX.Element {
//   return (
//     <div>
//       <div><Icon/> {name}</div>
//       {children}
//     </div>
//   );
// }

// interface DrawerProps {
//   children: any;
// }

// /**
//  * Renders a drawer with one or multiple pages to switch between
//  * @param children The drawer items to render. They contain the information to render the tabs
//  */
// export function Drawer({ children }: DrawerProps): JSX.Element {
//   const [ activeTab, setActiveTab ] = React.useState(-1);
//   const drawerItems: JSX.Element[] = [];
//   const drawerTabs: JSX.Element[] = [];

//   let drawerItemArray: JSX.Element[] = [];

//   if (!children) { return <></>; }
//   if (!Array.isArray(children)) { drawerItemArray.push(children); }
//   else { drawerItemArray = children; }

//   drawerItemArray.forEach((drawerItem: JSX.Element, index: number) => {
//     if (drawerItem.type.name !== "DrawerItem") { return; }
//     drawerTabs.push(
//       <DrawerTab
//         key={index}
//         _key={index}
//         Icon={drawerItem.props.Icon}
//         name={drawerItem.props.name}
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//       />);
//     drawerItems.push(
//       <DrawerItemWrapper
//         key={index}
//         _key={index}
//         activeTab={activeTab}
//       >
//         {drawerItem}
//       </DrawerItemWrapper>
//     );
//   });

//   return (
//     <div className={style.drawer}>
//         <div className={style.tabContainer}>
//           {drawerTabs}
//         </div>

//         <div>
//           { drawerItems }
//         </div>
//     </div>
//   );
// }

interface DrawerProps {
  children: any;
}

export function Drawer(props: DrawerProps) {
  const [tab, setTab] = React.useState(-1);

  console.log(tab)

  return (
    <div className={`${style.drawer} ${tab !== -1 ? style.open : "" }`}>
      <div className={style.contentContainer}>
        <div className={style.content}>
          Hi! This is some test content!
        </div>
      </div>
      <div className={style.tabContainer}>
        <div className={style.tab} onClick={() => setTab(-1 * (tab + 1))}>
          <div className={style.tabIcon}>
            <MdGridOn/>
          </div>
          Test Text
        </div>
      </div>

      
    </div>
  )
}
