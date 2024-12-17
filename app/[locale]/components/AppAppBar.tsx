"use client"
import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
//import Sitemark from './SitemarkIcon';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';

import { useI18nContext } from '@/contexts/i18nContext';

import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PlaceIcon from '@mui/icons-material/Place';
// Mapping of icon names to components
const iconMapping: {
  [key: string]: React.ElementType
} = {
  people: PeopleIcon,
  school: SchoolIcon,
  library: LibraryBooksIcon,
  circle: AddCircleIcon,
  menu: MenuBookIcon,
  place: PlaceIcon
};
interface NavButtonProps {
  children: React.ReactNode;
  icon: string;
}
const NavButton = ({ children, icon }: NavButtonProps) => {
  const { locale } = useI18nContext();
  const IconComponent = iconMapping[icon.replace(/\s+/g, "")]; // Resolve the icon component
  return (
    <Button variant="text" fullWidth={true} color="info" size="small" href={`/${locale}/${children}`} >
      {IconComponent && <IconComponent />}
      {children}
    </Button >);
}

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: alpha(theme.palette.background.default, 0.4),
  boxShadow: theme.shadows[1],
  padding: '8px 12px',
}));


export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="sticky"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            {/* <Sitemark /> */}
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <NavButton icon="people">
                Member
              </NavButton>
              <NavButton icon="school">
                Research
              </NavButton>
              <NavButton icon="library">
                Publication
              </NavButton>
              <NavButton icon="circle">
                For Applicant
              </NavButton>
              <NavButton icon="menu">
                Lecture
              </NavButton>
              <NavButton icon="place">
                Access
              </NavButton>
            </Box>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <NavButton icon="people">
                  Member
                </NavButton>
                <NavButton icon="school">
                  Research
                </NavButton>
                <NavButton icon="library">
                  Publication
                </NavButton>
                <NavButton icon="circle">
                  For Applicant
                </NavButton>
                <NavButton icon="menu">
                  Lecture
                </NavButton>
                <NavButton icon="place">
                  Access
                </NavButton>
                <Divider sx={{ my: 3 }} />
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
