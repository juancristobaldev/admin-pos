"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { alpha, styled } from "@mui/material/styles";
import BlankCard from "@/app/components/shared/BlankCard";
import { format } from "date-fns";
import { ProductType } from "@/entitys";

const Cover = styled(BlankCard)({
  height: 280,
  position: "relative",
  backgroundSize: "cover",
});

type Props = {
  product: ProductType;
  index?: number;
};

const MenuFeaturedCard = ({ product, index }: Props) => {
  const main = index === 0;

  return (
    <Cover className="hoverCard">
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: (theme) =>
            alpha(theme.palette.grey[900], 0.55),
        }}
      />

      <Box
        position="relative"
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        p={3}
      >
        <Chip
          label={product.category}
          color="primary"
          sx={{ alignSelf: "flex-end" }}
        />

        <Box>
          <Typography variant="h4" color="white">
            {product.name}
          </Typography>

          <Typography variant="body2" color="grey.300" mt={1}>
            {product.description}
          </Typography>

          <Stack
            direction="row"
            justifyContent="space-between"
            mt={2}
            alignItems="center"
          >
            <Typography color="white" fontWeight={700}>
              ${product.price.toLocaleString()}
            </Typography>

            <Typography variant="caption" color="grey.400">
              {format(new Date(product.createdAt), "dd MMM yyyy")}
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Cover>
  );
};

export default MenuFeaturedCard;
