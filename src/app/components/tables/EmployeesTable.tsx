// src/graphql/user.queries.ts
import { gql } from "@apollo/client";

export const GET_USERS_BY_BUSINESS = gql`
  query GetUsersByBusiness($businessId: String!) {
    usersByBusiness(businessId: $businessId) {
      id
      name
      role
      email
      status
      lastLogin
    }
  }
`;

// src/views/apps/userprofile/employees/EmployeesCard.tsx

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState, useMemo } from "react";
import BlankCard from "../shared/BlankCard";
import {
  IconSearch,
  IconMail,
  IconUserCheck,
  IconClock,
  IconDots,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { useQuery } from "@apollo/client";

import { User } from "@/entitys"; // Asumiendo que User entity está tipada
import { useBusiness } from "@/store/bussines";
import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import DeleteUserModal from "../forms/form-horizontal/ModalDeleteUser";

// NOTA: Usaremos un businessId simulado. En producción, vendría del Contexto de la sesión.
const SIMULATED_BUSINESS_ID = "b-123456";

// Datos de contacto de ejemplo (reemplazamos los íconos sociales por íconos de empleado)
const EmployeeContactIcons = [
  { name: "Email", icon: <IconMail size="18" color="#006097" /> },
  { name: "Status", icon: <IconUserCheck size="18" color="#1877F2" /> },
  { name: "Last Login", icon: <IconClock size="18" color="#D7336D" /> },
];

// Tipo de datos basado en el User model
interface EmployeeType {
  id: string;
  name: string;
  role: string;
  email: string;
  status: string;
  lastLogin: string; // Usaremos string para simplificar
}

const EmployeesCard = () => {
  // Usamos Apollo useQuery para traer los datos del backend

  const { business } = useBusiness();
  const { data, loading, error, refetch } = useQuery<{
    usersByBusiness: EmployeeType[];
  }>(GET_USERS_BY_BUSINESS, {
    variables: { businessId: business?.id },
    fetchPolicy: "cache-and-network",
  });
  const [openDelete,setOpenDelete] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const open = Boolean(anchorEl);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const employees: EmployeeType[] = data?.usersByBusiness || [];

  const filterEmployees = (emp: EmployeeType[], cSearch: string) => {
    if (emp)
      return emp.filter(
        (t) =>
          t.name.toLocaleLowerCase().includes(cSearch.toLocaleLowerCase()) ||
          t.role.toLocaleLowerCase().includes(cSearch.toLocaleLowerCase())
      );
    return emp;
  };

  const getFilteredEmployees = useMemo(
    () => filterEmployees(employees, search),
    [employees, search]
  );


   const handleClick = (
      event: React.MouseEvent<HTMLButtonElement>,
      id: string
    ) => {
      setAnchorEl(event.currentTarget);
      setSelectedId(id);
    };
  

  
    const handleClose = () => {
      setAnchorEl(null);
      setSelectedId(null);
    };
  
    const handleEdit = (id:any) => {
        router.push(`/local/${business?.id}/employees/edit?userId=${id}`)
      handleClose();
    };
  
    const handleDelete = () => {
      console.log("Eliminando empleado:", selectedId);
      if (!selectedId) return; // Validación de seguridad
  

  
      // Llamada a la mutación con las variables requeridas
      setOpenDelete(true)
  
    };

  if (loading) return <Typography>Cargando empleados...</Typography>;
  if (error)
    return (
      <Typography color="error">
        Error al cargar empleados: {error.message}
      </Typography>
    );
  if (employees.length === 0)
    return (
      <Typography className="p-4 text-center">
        No hay empleados registrados para este negocio.
      </Typography>
    );


    
  return (
    <>
      <Grid container spacing={3}>
        <Grid item sm={12} lg={12}>
          <Stack direction="row" alignItems={"center"} mt={2}>
            <Box>
              <Typography variant="h3">
                Empleados &nbsp;
                <Chip
                  label={getFilteredEmployees.length}
                  color="secondary"
                  size="small"
                />
              </Typography>
            </Box>
            <Box ml="auto" width={{ xs: "100%", sm: "250px" }}>
              <TextField
                id="outlined-search"
                placeholder="Buscar Empleado o Rol"
                size="small"
                type="search"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconSearch size="14" />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>
          </Stack>
        </Grid>
        {getFilteredEmployees.map((profile) => {
          // Lógica para el chip de estado
          const statusColor = profile.status === "active" ? "success" : "error";
          const lastLogin = profile.lastLogin
            ? new Date(profile.lastLogin).toLocaleDateString()
            : "Nunca";

          return (
            <Grid item sm={12} lg={4} key={profile.id}>
              <BlankCard className="hoverCard">
                <CardContent>
                  <Stack direction={"column"} gap={2} alignItems="center">
                    <Avatar
                      alt={profile.name}
                      // Aquí se usaría profile.avatar si tu modelo User lo incluyera
                      sx={{
                        width: "80px",
                        height: "80px",
                        bgcolor: "primary.main",
                      }}
                    >
                      {profile.name.charAt(0)}
                    </Avatar>
                    <Box textAlign={"center"}>
                      <Typography variant="h5" fontWeight={600}>
                        {profile.name}
                      </Typography>
                      {/* Rol de Empleado */}
                      <Typography variant="subtitle2" color="primary.main">
                        {profile.role}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
                <Divider />
                <Box p={2} py={1} sx={{ backgroundColor: "grey.100" }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      {/* Email */}
                      <IconMail size="18" color="#006097" />
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {profile.email}
                      </Typography>
                    </Stack>
                    {/* Estado (Activo/Inactivo) */}
                    <Chip
                      label={profile.status}
                      color={statusColor}
                      size="small"
                    />
                       <IconButton onClick={(e) => handleClick(e, profile.id)}>
                      <IconDots width={18} />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={open && selectedId === profile.id} // Solo abre el menú del ítem seleccionado
                      onClose={handleClose}
                    >
                      <MenuItem onClick={() => handleEdit(selectedId)}>
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

                      <DeleteUserModal
                        open={openDelete}
                        userId={profile.id}
                        userName={profile.name}
                        onClose={() => setOpenDelete(false)}
                        onDeleted={() => {
                          refetch(); // o navegación / toast
                        }}
                      />
                    </Menu>
                  </Stack>
                </Box>
                <Divider />
                <Box p={2} py={1} textAlign={"center"}>
                  <Typography variant="caption" color="textSecondary">
                    Último Acceso: {lastLogin}
                  </Typography>
                </Box>
              </BlankCard>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default EmployeesCard;
