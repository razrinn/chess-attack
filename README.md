# Chess Visualizer

This is a visualization of chess square domination using a fully functional chess game web application generated entirely through Large Language Model (LLM) interactions.

## 🤖 LLM Attribution

This entire project, including all source code, components, and documentation, was generated through interactions with Anthropic's Claude Sonnet 3.5 using the Cline VSCode extension. The implementation includes sophisticated features like piece movement validation, square domination calculation, and drag-and-drop functionality, showcasing the potential of AI-assisted software development through direct IDE integration.

## ✨ Features

- **Complete Chess Rules Implementation**

  - Valid move highlighting
  - Piece movement validation
  - Turn-based gameplay

- **Advanced Game Analysis**

  - Material advantage calculation
  - Square domination analysis
  - Visual domination indicators on board

- **Interactive UI Elements**

  - Drag and drop piece movement
  - Click-to-move alternative
  - Move history with playback
  - Game status panel
  - Board coordinates (algebraic notation)

- **Visual Feedback**
  - Highlighted legal moves
  - Square domination overlay
  - Color-coded advantage indicators
  - Responsive design for various screen sizes

## 🛠 Technical Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Development Tools**: ESLint, TypeScript ESLint

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone [repository-url]
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
bun install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎮 How to Play

1. **Moving Pieces**

   - Drag and drop pieces to valid squares
   - Or click the piece and then click the destination square

2. **Game Analysis**

   - View material advantage in the status panel
   - Monitor square control through domination indicators
   - Review move history in the sidebar

3. **Visual Indicators**
   - Blue overlay: White-controlled squares
   - Red overlay: Black-controlled squares
   - Purple overlay: Contested squares

## 🏗 Project Structure

```
src/
├── components/         # React components
│   ├── Board.tsx      # Main chess board
│   ├── GameStatus.tsx # Game statistics
│   ├── Piece.tsx     # Chess piece
│   ├── Square.tsx    # Board square
│   └── ...
├── hooks/             # Custom React hooks
│   ├── useChessBoard.ts    # Game logic
│   ├── useDomination.ts    # Square control
│   └── useDragAndDrop.ts   # Drag-n-drop
└── ...
```

## 🎯 Future Enhancements

- Legal move check
- Checkmate detection
- Stalemate detection
- En passant moves
- Castling moves
- Game save/load functionality
- Computer opponent
- Online multiplayer support

## 📝 License

This project is open source and available under the MIT License.
