'use client'


import { gql } from "@apollo/client";

export const DELETE_FLOOR = gql`
  mutation DeleteFloor($deleteFloorInput: DeleteFloorInput!) {
    deleteFloor(deleteFloorInput: $deleteFloorInput) {
      id
    }
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
  floorId: string;
  floorName?: string;
  onClose: () => void;
  onDeleted?: () => void;
};

const DeleteFloorModal = ({
  open,
  floorId,
  floorName,
  onClose,
  onDeleted,
}: Props) => {
  const [deleteFloor, { loading }] = useMutation(DELETE_FLOOR);

  const handleDelete = async () => {
    try {
      await deleteFloor({
        variables: {
          deleteFloorInput: {
            id: floorId,
          },
        },
      });

      onClose();
      onDeleted?.();
    } catch (error) {
      console.error("Error eliminando piso:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Eliminar piso</DialogTitle>

      <DialogContent>
        <Typography>
          ¿Seguro que deseas eliminar el piso{" "}
          <strong>{floorName ?? "seleccionado"}</strong>?
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

export default DeleteFloorModal;
