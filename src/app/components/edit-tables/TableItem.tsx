// src/components/FloorPlan/TableItem.tsx
import React, { useRef } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Box, Typography } from "@mui/material";

// Definimos los tipos para las formas visuales
export type ShapeType =
  | "square"
  | "circle"
  | "rectangle-v"
  | "rectangle-h"
  | "wall";

interface TableItemProps {
  id: string;
  name: string; // El número de la mesa
  x: number;
  y: number;
  shape: ShapeType | string;
  color: string;
  onStop: (id: string, x: number, y: number) => void; // Callback al soltar
  readOnly?: boolean; // Para modo "solo ver"
}

const TableItem = ({
  id,
  name,
  x,
  y,
  shape,
  color,
  onStop,
  readOnly = false,
}: TableItemProps) => {
  const nodeRef = useRef(null); // Necesario para evitar warnings en React StrictMode

  // Definir estilos según la forma (basado en tu imagen)
  const getShapeStyles = () => {
    switch (shape) {
      case "square":
        return { width: 80, height: 80, borderRadius: 2 };
      case "circle":
        return { width: 60, height: 60, borderRadius: "50%" };
      case "rectangle-v":
        return { width: 80, height: 160, borderRadius: 2 };
      case "rectangle-h":
        return { width: 160, height: 80, borderRadius: 2 };
      case "wall":
        return { width: 40, height: 300, borderRadius: 4 }; // La barra gris
      default:
        return { width: 80, height: 80, borderRadius: 2 };
    }
  };

  const styles = getShapeStyles();

  const handleStop = (e: DraggableEvent, data: DraggableData) => {
    // Actualizamos las coordenadas al soltar
    onStop(id, data.x, data.y);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x, y }}
      onStop={handleStop}
      disabled={readOnly}
      bounds="parent" // No permite salir del contenedor
      grid={[10, 10]} // "Snap to grid" para alinear más fácil (opcional)
    >
      <Box
        ref={nodeRef}
        sx={{
          ...styles,
          position: "absolute",
          backgroundColor: color,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: readOnly ? "default" : "move",
          boxShadow: 3,
          transition: "box-shadow 0.2s",
          "&:hover": {
            boxShadow: readOnly ? 3 : 6,
            zIndex: 10,
          },
          color: "#1a1a1a",
          fontWeight: "bold",
          userSelect: "none", // Evita seleccionar el texto al arrastrar
        }}
      >
        {/* Solo mostramos número si no es una pared */}
        {shape !== "wall" && (
          <Typography variant="h6" fontWeight="bold">
            {name}
          </Typography>
        )}
      </Box>
    </Draggable>
  );
};

export default TableItem;
