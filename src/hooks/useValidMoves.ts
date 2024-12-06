import { Move, PieceState, Position } from '../types';

export const useValidMoves = (
  pieces: (PieceState | null)[][],
  lastPawnMove: Move | null
) => {
  const isValidPosition = (row: number, col: number) => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  };

  const isEnemyPiece = (
    row: number,
    col: number,
    currentColor: 'white' | 'black'
  ) => {
    const piece = pieces[row][col];
    return piece && piece.color !== currentColor;
  };

  const getPawnMoves = (row: number, col: number, color: 'white' | 'black') => {
    const moves: Position[] = [];
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;

    // Forward move
    if (
      isValidPosition(row + direction, col) &&
      !pieces[row + direction][col]
    ) {
      moves.push({ row: row + direction, col });

      // Double move from starting position
      if (
        row === startRow &&
        isValidPosition(row + 2 * direction, col) &&
        !pieces[row + 2 * direction][col]
      ) {
        moves.push({ row: row + 2 * direction, col });
      }
    }

    // Regular captures
    const captureSquares = [
      { row: row + direction, col: col - 1 },
      { row: row + direction, col: col + 1 },
    ];

    captureSquares.forEach(({ row: r, col: c }) => {
      if (isValidPosition(r, c) && isEnemyPiece(r, c, color)) {
        moves.push({ row: r, col: c });
      }
    });

    // En passant
    if (
      lastPawnMove &&
      row === (color === 'white' ? 3 : 4) && // Check if pawn is on correct rank
      Math.abs(lastPawnMove.from.row - lastPawnMove.to.row) === 2 && // Check if last move was a double pawn push
      lastPawnMove.to.row === row && // Check if enemy pawn is on same rank
      Math.abs(col - lastPawnMove.to.col) === 1 && // Check if enemy pawn is on adjacent file
      lastPawnMove.piece.color !== color
    ) {
      // Check if it was enemy's pawn
      moves.push({ row: row + direction, col: lastPawnMove.to.col });
    }

    return moves;
  };

  const getRookMoves = (row: number, col: number, color: 'white' | 'black') => {
    const moves: Position[] = [];
    const directions = [
      [-1, 0], // up
      [1, 0], // down
      [0, -1], // left
      [0, 1], // right
    ];

    directions.forEach(([dRow, dCol]) => {
      let currentRow = row + dRow;
      let currentCol = col + dCol;

      while (isValidPosition(currentRow, currentCol)) {
        if (!pieces[currentRow][currentCol]) {
          moves.push({ row: currentRow, col: currentCol });
        } else if (isEnemyPiece(currentRow, currentCol, color)) {
          moves.push({ row: currentRow, col: currentCol });
          break;
        } else {
          break;
        }
        currentRow += dRow;
        currentCol += dCol;
      }
    });

    return moves;
  };

  const getKnightMoves = (
    row: number,
    col: number,
    color: 'white' | 'black'
  ) => {
    const moves: Position[] = [];
    const knightMoves = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];

    knightMoves.forEach(([dRow, dCol]) => {
      const newRow = row + dRow;
      const newCol = col + dCol;

      if (
        isValidPosition(newRow, newCol) &&
        (!pieces[newRow][newCol] || isEnemyPiece(newRow, newCol, color))
      ) {
        moves.push({ row: newRow, col: newCol });
      }
    });

    return moves;
  };

  const getBishopMoves = (
    row: number,
    col: number,
    color: 'white' | 'black'
  ) => {
    const moves: Position[] = [];
    const directions = [
      [-1, -1], // up-left
      [-1, 1], // up-right
      [1, -1], // down-left
      [1, 1], // down-right
    ];

    directions.forEach(([dRow, dCol]) => {
      let currentRow = row + dRow;
      let currentCol = col + dCol;

      while (isValidPosition(currentRow, currentCol)) {
        if (!pieces[currentRow][currentCol]) {
          moves.push({ row: currentRow, col: currentCol });
        } else if (isEnemyPiece(currentRow, currentCol, color)) {
          moves.push({ row: currentRow, col: currentCol });
          break;
        } else {
          break;
        }
        currentRow += dRow;
        currentCol += dCol;
      }
    });

    return moves;
  };

  const getQueenMoves = (
    row: number,
    col: number,
    color: 'white' | 'black'
  ) => {
    return [
      ...getRookMoves(row, col, color),
      ...getBishopMoves(row, col, color),
    ];
  };

  const getKingMoves = (row: number, col: number, color: 'white' | 'black') => {
    const moves: Position[] = [];
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    // Regular king moves
    directions.forEach(([dRow, dCol]) => {
      const newRow = row + dRow;
      const newCol = col + dCol;

      if (
        isValidPosition(newRow, newCol) &&
        (!pieces[newRow][newCol] || isEnemyPiece(newRow, newCol, color))
      ) {
        moves.push({ row: newRow, col: newCol });
      }
    });

    // Castling logic
    const isKingStartPosition =
      color === 'white' ? row === 7 && col === 4 : row === 0 && col === 4;
    if (isKingStartPosition) {
      // Check kingside castling
      if (
        !pieces[row][5] &&
        !pieces[row][6] &&
        pieces[row][7]?.type === 'rook'
      ) {
        moves.push({ row, col: col + 2 });
      }
      // Check queenside castling
      if (
        !pieces[row][3] &&
        !pieces[row][2] &&
        !pieces[row][1] &&
        pieces[row][0]?.type === 'rook'
      ) {
        moves.push({ row, col: col - 2 });
      }
    }

    return moves;
  };

  const getValidMoves = (row: number, col: number): Position[] => {
    const piece = pieces[row][col];
    if (!piece) return [];

    // Get all possible moves without considering check
    let moves: Position[] = [];
    switch (piece.type) {
      case 'pawn':
        moves = getPawnMoves(row, col, piece.color);
        break;
      case 'rook':
        moves = getRookMoves(row, col, piece.color);
        break;
      case 'knight':
        moves = getKnightMoves(row, col, piece.color);
        break;
      case 'bishop':
        moves = getBishopMoves(row, col, piece.color);
        break;
      case 'queen':
        moves = getQueenMoves(row, col, piece.color);
        break;
      case 'king':
        moves = getKingMoves(row, col, piece.color);
        break;
    }

    const kingPosition = findKing(pieces, piece.color);
    if (!kingPosition) return moves;

    // If king is in check, only allow moves that block the check or capture the attacking piece
    if (isKingInCheck(pieces, piece.color)) {
      // Find the attacking piece(s)
      const attackingPieces: Position[] = [];
      const attackPaths: Position[][] = [];

      const opponentColor = piece.color === 'white' ? 'black' : 'white';
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const attacker = pieces[r][c];
          if (attacker?.color === opponentColor) {
            let attackerMoves: Position[] = [];
            switch (attacker.type) {
              case 'pawn':
                attackerMoves = getPawnMoves(r, c, attacker.color);
                break;
              case 'rook':
                attackerMoves = getRookMoves(r, c, attacker.color);
                break;
              case 'knight':
                attackerMoves = getKnightMoves(r, c, attacker.color);
                break;
              case 'bishop':
                attackerMoves = getBishopMoves(r, c, attacker.color);
                break;
              case 'queen':
                attackerMoves = getQueenMoves(r, c, attacker.color);
                break;
              case 'king':
                attackerMoves = getKingMoves(r, c, attacker.color);
                break;
            }

            if (
              attackerMoves.some(
                (move) =>
                  move.row === kingPosition.row && move.col === kingPosition.col
              )
            ) {
              attackingPieces.push({ row: r, col: c });

              // Calculate attack path for sliding pieces
              if (['bishop', 'rook', 'queen'].includes(attacker.type)) {
                const path: Position[] = [];
                const dx = Math.sign(kingPosition.col - c);
                const dy = Math.sign(kingPosition.row - r);
                let pathRow = r + dy;
                let pathCol = c + dx;

                while (
                  pathRow !== kingPosition.row ||
                  pathCol !== kingPosition.col
                ) {
                  path.push({ row: pathRow, col: pathCol });
                  pathRow += dy;
                  pathCol += dx;
                }
                attackPaths.push(path);
              }
            }
          }
        }
      }

      // If it's the king moving, allow any safe square
      if (piece.type === 'king') {
        return moves.filter((move) => {
          const simulatedBoard = pieces.map((row) => [...row]);
          simulatedBoard[move.row][move.col] = piece;
          simulatedBoard[row][col] = null;
          return !isKingInCheck(simulatedBoard, piece.color);
        });
      }

      // If more than one piece is attacking, only king can move
      if (attackingPieces.length > 1) {
        return [];
      }

      // Filter moves to only those that block the check or capture the attacker
      return moves.filter((move) => {
        // Can capture the attacking piece
        if (
          attackingPieces.some(
            (attacker) => move.row === attacker.row && move.col === attacker.col
          )
        ) {
          const simulatedBoard = pieces.map((row) => [...row]);
          simulatedBoard[move.row][move.col] = piece;
          simulatedBoard[row][col] = null;
          return !isKingInCheck(simulatedBoard, piece.color);
        }

        // Can block the attack path
        if (
          attackPaths.some((path) =>
            path.some((pos) => move.row === pos.row && move.col === pos.col)
          )
        ) {
          const simulatedBoard = pieces.map((row) => [...row]);
          simulatedBoard[move.row][move.col] = piece;
          simulatedBoard[row][col] = null;
          return !isKingInCheck(simulatedBoard, piece.color);
        }

        return false;
      });
    }

    // Rest of the existing pin detection logic
    // Reference to existing code:

    return moves;
  };

  const findKing = (
    board: (PieceState | null)[][],
    color: 'white' | 'black'
  ): Position | null => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece?.type === 'king' && piece.color === color) {
          return { row, col };
        }
      }
    }
    return null;
  };

  const isKingInCheck = (
    board: (PieceState | null)[][],
    kingColor: 'white' | 'black'
  ): boolean => {
    const kingPosition = findKing(board, kingColor);
    if (!kingPosition) return false;

    const opponentColor = kingColor === 'white' ? 'black' : 'white';

    // Check all squares for opponent pieces
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece?.color === opponentColor) {
          // For sliding pieces (bishop, rook, queen), check if there are blocking pieces
          if (['bishop', 'rook', 'queen'].includes(piece.type)) {
            const dx = Math.sign(kingPosition.col - col);
            const dy = Math.sign(kingPosition.row - row);

            // Check if the piece can move in this direction
            const canMove =
              piece.type === 'rook'
                ? dx === 0 || dy === 0
                : piece.type === 'bishop'
                ? Math.abs(dx) === Math.abs(dy)
                : true; // queen can move in any direction

            if (canMove) {
              let currentRow = row + dy;
              let currentCol = col + dx;
              let blocked = false;

              while (
                currentRow !== kingPosition.row ||
                currentCol !== kingPosition.col
              ) {
                if (!isValidPosition(currentRow, currentCol)) {
                  blocked = true;
                  break;
                }
                if (board[currentRow][currentCol] !== null) {
                  blocked = true;
                  break;
                }
                currentRow += dy;
                currentCol += dx;
              }

              if (!blocked) return true;
            }
          } else {
            // For non-sliding pieces (pawn, knight, king), use the existing move calculation
            let moves: Position[] = [];
            switch (piece.type) {
              case 'pawn':
                moves = getPawnMoves(row, col, piece.color);
                break;
              case 'knight':
                moves = getKnightMoves(row, col, piece.color);
                break;
              case 'king':
                moves = getKingMoves(row, col, piece.color);
                break;
            }

            if (
              moves.some(
                (move) =>
                  move.row === kingPosition.row && move.col === kingPosition.col
              )
            ) {
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  const isCheckmate = (
    board: (PieceState | null)[][],
    kingColor: 'white' | 'black'
  ): boolean => {
    // If the king is not in check, it's not checkmate
    if (!isKingInCheck(board, kingColor)) return false;

    // Try all possible moves for all pieces of the king's color
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece?.color === kingColor) {
          const moves = getValidMoves(row, col);

          // Try each move to see if it gets out of check
          for (const move of moves) {
            // Create a temporary board to test the move
            const tempBoard = board.map((row) => [...row]);
            tempBoard[move.row][move.col] = tempBoard[row][col];
            tempBoard[row][col] = null;

            // If this move gets us out of check, it's not checkmate
            if (!isKingInCheck(tempBoard, kingColor)) {
              return false;
            }
          }
        }
      }
    }

    // If we've tried all moves and none get us out of check, it's checkmate
    return true;
  };

  return { getValidMoves, isKingInCheck, isCheckmate };
};
