import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import Navigation from '@/app/components/Navigation';

export default function Home() {
  return (
    <Box>
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={0} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h1" gutterBottom>
            Laboratory Name
          </Typography>
          <Typography variant="h2" color="primary" gutterBottom>
            Welcome to Our Research Lab
          </Typography>
          <Typography variant="body1" paragraph>
            Our laboratory focuses on cutting-edge research in [your field].
            We are dedicated to advancing knowledge and fostering innovation
            through collaborative research and educational excellence.
          </Typography>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Latest News
              </Typography>
              <Typography variant="body1">
                [Your latest news and updates will go here]
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Recent Publications
              </Typography>
              <Typography variant="body1">
                [Your recent publications will go here]
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
// "use client"
// import { useEffect } from 'react';
// import React from 'react';
// import { useI18nRouter } from '@/hooks/useI18nRouter';

// const Home: React.FC = () => {
//   const { appendBrowserLocale } = useI18nRouter();
//   useEffect(() => {
//     appendBrowserLocale();
//   });
//   return (
//     <div className="container">
//     </div>
//   );
// };
// export default Home;


