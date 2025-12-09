import Menuitems from "./MenuItems";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "@/store/hooks";
import NavItem from "./NavItem";
import NavCollapse from "./NavCollapse";
import NavGroup from "./NavGroup/NavGroup";
import { AppState } from "@/store/store";
import { toggleMobileSidebar } from "@/store/customizer/CustomizerSlice";
import { useContext } from "react";
import { useClientContext } from "@/store/me";
import { uniqueId } from "lodash";
import { IconAperture } from "@tabler/icons-react";

const SidebarItems = () => {
  const { businesses } = useClientContext();
  const pathname = usePathname();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf("/"));
  const customizer = useSelector((state: AppState) => state.customizer);
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));
  const hideMenu: any = lgUp
    ? customizer.isCollapse && !customizer.isSidebarHover
    : "";
  const dispatch = useDispatch();
  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {Menuitems.map((item) => {
          // {/********SubHeader**********/}

          if (item.search === "businesses" && !businesses.length)
            return (
              <NavItem
                item={{
                  id: uniqueId(),
                  title: "Crear tu primer local",
                  icon: IconAperture,
                  href: "/local",

                  chipColor: "secondary",
                }}
                key={item.id}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                onClick={() => dispatch(toggleMobileSidebar())}
              />
            );

          /*
            createdAt
: 
"2025-12-09T00:34:10.272Z"
email
: 
"juancristobaldev@gmail.com"
id
: 
"2620ed35-bb49-4b00-9d17-3f4c67254ee0"
name
: 
"Juan Quezada"
status
: 
"Active"
            */
          if (item.search === "businesses" && businesses.length)
            return businesses.map((item, index) => (
              <NavItem
                item={{
                  title: item.name,
                  href: `/local/${item.id}`,
                  icon: IconAperture,
                }}
                key={item.id}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                onClick={() => dispatch(toggleMobileSidebar())}
              />
            ));
          if (item.subheader) {
            return (
              <NavGroup item={item} hideMenu={hideMenu} key={item.subheader} />
            );

            // {/********If Sub Menu**********/}
            /* eslint no-else-return: "off" */
          } else if (item.children) {
            return (
              <NavCollapse
                menu={item}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                pathWithoutLastPart={pathWithoutLastPart}
                level={1}
                key={item.id}
                onClick={() => dispatch(toggleMobileSidebar())}
              />
            );

            // {/********If Sub No Menu**********/}
          } else {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                onClick={() => dispatch(toggleMobileSidebar())}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
