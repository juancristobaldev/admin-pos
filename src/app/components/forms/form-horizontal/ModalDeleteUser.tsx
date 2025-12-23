"use client";

import { gql } from "@apollo/client";

export const DELETE_USER = gql`
  mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input)
  }
`;
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useMutation } from "@apollo/client";


type Props = {
  open: boolean;
  userId: string;
  userName?: string;
  onClose: () => void;
  onDeleted?: () => void;
};

const DeleteUserModal = ({
  open,
  userId,
  userName,
  onClose,
  onDeleted,
}: Props) => {
  const [deleteUser, { loading }] = useMutation(DELETE_USER);

  const handleDelete = async () => {
    try {
      await deleteUser({
        variables: {
          input: {
            id: userId,
          },
        },
      });

      onClose();
      onDeleted?.();
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      alert("❌ No se pudo eliminar el empleado");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Eliminar empleado</DialogTitle>

      <DialogContent>
        <Typography>
          ¿Seguro que deseas eliminar al empleado{" "}
          <strong>{userName ?? "seleccionado"}</strong>?
        </Typography>

        <Typography color="error" mt={1}>
          Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>

        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={loading}
        >
          {loading ? "Eliminando..." : "Sí, eliminar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserModal;
