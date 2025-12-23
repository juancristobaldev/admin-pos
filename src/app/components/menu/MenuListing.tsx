'use client';

import Grid from '@mui/material/Grid';
import { useQuery, gql } from '@apollo/client';

import { useBusiness } from '@/store/bussines';
import MenuFeaturedCard from './MenuItem';

const GET_PRODUCTS = gql`
  query Products($businessId: ID!) {
    products(businessId: $businessId) {
      id
      name
      description
      price
      category
      available
      createdAt
    }
  }
`;

type Props = {
  businessId: string;
};

const MenuListing = () => {
const {business} = useBusiness()
  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    variables: { businessId:business?.id },
  });

  if (loading) return <p>Cargando menú...</p>;
  if (error) return <p>Error cargando productos</p>;

  return (
    <Grid container spacing={3}>
      {data.products.map((product: any, index:any) => (
        <Grid
          item
          key={product.id}
          xs={12}      // mobile → 1 columna
          sm={6}       // tablet → 2 columnas
          md={4}       // desktop → 3 columnas ✅
        >
          <MenuFeaturedCard  key={index} product={product} />
        </Grid>
      ))}
    </Grid>
  );
};

export default MenuListing;
