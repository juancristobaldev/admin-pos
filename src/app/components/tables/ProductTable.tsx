// src/graphql/queries.ts (o donde organices tus queries)
import { gql, useMutation } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts($businessId: ID!) {
    products(businessId: $businessId) {
      id
      name
      description
      price
      category
      available
      # businessId  <-- Descomenta si necesitas filtrar o validar
    }
  }
`;

// src/components/ProductManagement/ProductTable.tsx
import React from "react";
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Typography,
  Chip,
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  TableHead,
  CircularProgress,
  Box,
  Stack,
} from "@mui/material";
import BlankCard from "../shared/BlankCard";
import {
  IconDots,
  IconEdit,
  IconTrash,
  IconCurrencyDollar,
  IconTag,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";

// 1. Definición de la Mutación
const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(input: { id: $id })
  }
`;

// 2. Uso del Hook useMutation

// 3. Función handleDelete

// Definimos la interfaz basada en tu Schema
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  category: string;
  // imageUrl?: string; // Si decides agregar imágenes en el futuro
}

const ProductTable = ({ businessId }: { businessId: any }) => {
  // 1. Hook de Apollo para traer datos reales

  const [
    runDeleteMutation, // Función para ejecutar la mutación
    { loading: loadingDelete, error: errorDelete }, // Estado de la mutación (opcional para feedback UI)
  ] = useMutation(DELETE_PRODUCT_MUTATION, {
    // Opciones: Se ejecuta cuando la mutación es exitosa
    onCompleted: (data) => {
      console.log(`Producto ${data.deleteProduct} eliminado con éxito.`);
    },
    // Opciones: Se ejecuta si hay un error del servidor o red
    onError: (err) => {
      console.error("Error al eliminar:", err.message);
    },
  });

  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    pollInterval: 5000, // Opcional: Refresca cada 5s para ver cambios de otros usuarios (casi tiempo real)
    variables: { businessId },
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const open = Boolean(anchorEl);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const router = useRouter();

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleEdit = () => {
    router.push(`/local/${businessId}/inventory/edit?id=${selectedId}`);
    // Aquí abrirías tu modal de edición pasando el ID
    handleClose();
  };

  const handleDelete = () => {
    console.log("Eliminando producto:", selectedId);
    if (!selectedId) return; // Validación de seguridad

    console.log("Eliminando producto:", selectedId);

    // Llamada a la mutación con las variables requeridas
    runDeleteMutation({
      variables: {
        id: selectedId,
      },
    });
    handleClose();
  };

  // 2. Estado de Carga
  if (loading) {
    return (
      <BlankCard>
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Cargando catálogo...</Typography>
        </Box>
      </BlankCard>
    );
  }

  // 3. Estado de Error
  if (error) {
    return (
      <BlankCard>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 5,
            color: "error.main",
          }}
        >
          <IconAlertCircle />
          <Typography sx={{ ml: 1 }}>
            Error al cargar productos: {error.message}
          </Typography>
        </Box>
      </BlankCard>
    );
  }

  const products: Product[] = data?.products || [];

  return (
    <BlankCard className="mt-4">
      <TableContainer>
        <Table aria-label="product table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6">Producto</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Categoría</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Precio</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Estado</Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" sx={{ py: 3 }}>
                    No hay productos registrados aún.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              products.map((row) => (
                <TableRow key={row.id} hover>
                  {/* Nombre y Descripción */}
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      {/* Placeholder de imagen o icono si no hay URL */}
                      <Avatar
                        variant="rounded"
                        sx={{ bgcolor: "primary.light", color: "primary.main" }}
                      >
                        {row.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {row.name}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          color="textSecondary"
                          sx={{
                            maxWidth: "200px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {row.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  {/* Categoría */}
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconTag width={16} color="#6A89CC" />
                      <Typography variant="subtitle2" fontWeight={600}>
                        {row.category}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* Precio */}
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconCurrencyDollar width={16} color="green" />
                      <Typography variant="subtitle1" fontWeight={600}>
                        {row.price.toFixed(2)}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* Disponibilidad */}
                  <TableCell>
                    <Chip
                      label={row.available ? "Disponible" : "Agotado"}
                      size="small"
                      sx={{
                        backgroundColor: row.available
                          ? "success.light"
                          : "error.light",
                        color: row.available ? "success.main" : "error.main",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>

                  {/* Acciones */}
                  <TableCell>
                    <IconButton onClick={(e) => handleClick(e, row.id)}>
                      <IconDots width={18} />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={open && selectedId === row.id} // Solo abre el menú del ítem seleccionado
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleEdit}>
                        <ListItemIcon>
                          <IconEdit width={18} />
                        </ListItemIcon>
                        Editar
                      </MenuItem>
                      <MenuItem
                        onClick={handleDelete}
                        sx={{ color: "error.main" }}
                      >
                        <ListItemIcon>
                          <IconTrash width={18} color="#FA896B" />
                        </ListItemIcon>
                        Eliminar
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </BlankCard>
  );
};

export default ProductTable;
