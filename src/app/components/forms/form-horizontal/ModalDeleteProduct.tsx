"use client"

import { gql } from '@apollo/client';

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($input: DeleteProductInput!) {
    deleteProduct(input: $input)
  }
`;

// components/DeleteProductModal.tsx
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
  } from '@mui/material';
  import { useMutation } from '@apollo/client';
  
  interface DeleteProductModalProps {
    open: boolean;
    onClose: () => void;
    productId: string;
    onDeleted?: (id: string) => void;
  }
  
  export default function DeleteProductModal({
    open,
    onClose,
    productId,
    onDeleted,
  }: DeleteProductModalProps) {
    const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT, {
      onCompleted: (data) => {
        onDeleted?.(data.deleteProduct);
        onClose();
      },
      onError: (error) => {
        console.error(error);
        alert(error.message);
      },
    });
  
    const handleDelete = async () => {
      await deleteProduct({
        variables: {
          input: {
            id: productId,
          },
        },
      });
    };
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Eliminar producto</DialogTitle>
  
        <DialogContent>
          <Typography>
            ¿Estás seguro que deseas eliminar este producto?
            <br />
            <strong>Esta acción no se puede deshacer.</strong>
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
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  