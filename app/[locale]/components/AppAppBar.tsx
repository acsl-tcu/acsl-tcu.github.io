"use client";
import * as React from "react";
import { useI18nContext } from "@/contexts/i18nContext";
import { useI18nRouter } from "@/hooks/useI18nRouter";

// import ColorModeIconDropdown from "../shared-theme/ColorModeIconDropdown";
// import MenuIcon from "@mui/icons-material/Menu";
// import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

// // アイコンのマッピング
// import {
//   People as PeopleIcon,
//   School as SchoolIcon,
//   LibraryBooks as LibraryBooksIcon,
//   AddCircle as AddCircleIcon,
//   MenuBook as MenuBookIcon,
//   Place as PlaceIcon,
// } from "@mui/icons-material";

// const iconMapping: { [key: string]: React.ElementType } = {
//   people: PeopleIcon,
//   school: SchoolIcon,
//   library: LibraryBooksIcon,
//   circle: AddCircleIcon,
//   menu: MenuBookIcon,
//   place: PlaceIcon,
// };

interface NavButtonProps {
  children?: React.ReactNode;
  icon: string;
}

const NavButton = ({ children, icon }: NavButtonProps) => {
  const { locale } = useI18nContext();
  // const IconComponent = iconMapping[icon.replace(/\s+/g, "")];

  return (
    <a href={`/${locale}/${children}`} className="text-gray-700 hover:text-black flex items-center gap-2">
      {icon} {/* {IconComponent && <IconComponent />} */}
      {children}
    </a>
  );
};

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const { switchLocale } = useI18nRouter();
  const { locale } = useI18nContext();

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

  return (
    <header className="sticky top-0 bg-opacity-40 backdrop-blur-md border border-gray-300 shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <nav className="hidden md:flex space-x-4">
          <NavButton icon="people">Member</NavButton>
          <NavButton icon="school">Research</NavButton>
          <NavButton icon="library">Publication</NavButton>
          <NavButton icon="circle">For Applicant</NavButton>
          <NavButton icon="menu">Lecture</NavButton>
          <NavButton icon="place">Access</NavButton>
        </nav>

        <button
          onClick={() => switchLocale(locale === "ja" ? "en" : "ja")}
          className="border border-gray-500 px-3 py-1 rounded-md hover:bg-gray-200"
        >
          Click me!
        </button>

        <div className="md:hidden flex gap-2">
          {/* <ColorModeIconDropdown size="medium" /> */}
          <button onClick={toggleDrawer(true)} aria-label="Menu button">
            aa  {/* <MenuIcon /> */}
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-12 bg-white p-4 shadow-md">
          <div className="flex justify-end">
            <button onClick={toggleDrawer(false)}>
              bb {/* <CloseRoundedIcon /> */}
            </button>
          </div>
          <nav className="flex flex-col space-y-2">
            <NavButton icon="people">Member</NavButton>
            <NavButton icon="school">Research</NavButton>
            <NavButton icon="library">Publication</NavButton>
            <NavButton icon="circle">For Applicant</NavButton>
            <NavButton icon="menu">Lecture</NavButton>
            <NavButton icon="place">Access</NavButton>
          </nav>
        </div>
      )}
    </header>
  );
}