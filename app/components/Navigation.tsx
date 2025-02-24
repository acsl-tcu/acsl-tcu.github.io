import { AppBar, Toolbar, Button, Box, Container } from '@mui/material';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Navigation = () => {
  const pathname = usePathname();
  const routes = [
    { path: '/', label: 'Home' },
    { path: '/research', label: 'Research' },
    { path: '/publications', label: 'Publications' },
    { path: '/members', label: 'Members' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            {routes.map((route) => (
              <Link key={route.path} href={route.path} passHref>
                <Button
                  color="inherit"
                  sx={{
                    color: pathname === route.path ? 'secondary.main' : 'inherit',
                  }}
                >
                  {route.label}
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;
