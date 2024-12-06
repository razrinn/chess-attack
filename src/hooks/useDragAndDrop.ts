import { useState } from 'react';

interface Position {
  row: number;
  col: number;
}

export const useDragAndDrop = (
  onMove: (from: Position, to: Position) => void
) => {
  const [dragStart, setDragStart] = useState<Position | null>(null);

  const handleDragStart = (row: number, col: number) => {
    setDragStart({ row, col });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (toRow: number, toCol: number) => {
    if (!dragStart) return;
    onMove(dragStart, { row: toRow, col: toCol });
    setDragStart(null);
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDrop,
  };
};
