import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/material/styles";
import BannerContent from "./BannerContent";
import bannerbgImg1 from "/public/images/landingpage/bannerimg1.svg";
import bannerbgImg2 from "/public/images/landingpage/bannerimg2.svg";
import Image from "next/image";

const Banner = () => {
  const lgUp = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("lg")
  );

  const SliderBox = styled(Box)(() => ({
    "@keyframes slideUp": {
      "0%": { transform: "translate3d(0, 0, 0)" },
      "100%": { transform: "translate3d(0, -100%, 0)" },
    },
    animation: "slideUp 35s linear infinite",
  }));

  const SliderBox2 = styled(Box)(() => ({
    "@keyframes slideDown": {
      "0%": { transform: "translate3d(0, -100%, 0)" },
      "100%": { transform: "translate3d(0, 0, 0)" },
    },
    animation: "slideDown 35s linear infinite",
  }));

  return (
    <Box mb={{ xs: 6, lg: 10 }} sx={{ overflow: "hidden" }}>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent={{
            xs: "center",
            lg: "space-between",
          }}
        >
          {/* CONTENIDO */}
          <Grid
            item
            xs={12}
            sm={10}
            md={8}
            lg={6}
            display="flex"
            justifyContent={{
              xs: "center",
              lg: "flex-start",
            }}
            textAlign={{
              xs: "center",
              lg: "left",
            }}
          >
            <Box width="100%">
              <BannerContent />
            </Box>
          </Grid>

          {/* IMÁGENES SOLO DESKTOP */}
          {lgUp && (
            <Grid item xs={12} lg={6}>
              <Box
                p={3.2}
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.primary.light,
                  minWidth: "2000px",
                  height: "calc(100vh - 100px)",
                  maxHeight: "790px",
                }}
              >
                <Stack direction="row">
                  <Box>
                    <SliderBox>
                      <Image
                        src={bannerbgImg1}
                        alt="banner"
                        priority
                      />
                    </SliderBox>
                    <SliderBox>
                      <Image
                        src={bannerbgImg1}
                        alt="banner"
                        priority
                      />
                    </SliderBox>
                  </Box>
                  <Box>
                    <SliderBox2>
                      <Image
                        src={bannerbgImg2}
                        alt="banner"
                        priority
                      />
                    </SliderBox2>
                    <SliderBox2>
                      <Image
                        src={bannerbgImg2}
                        alt="banner"
                        priority
                      />
                    </SliderBox2>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Banner;
