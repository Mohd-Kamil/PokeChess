# ♟️ PokéChess

> **"Gotta Capture 'Em All!"**
> A modern, responsive Chess application reimagined with a nostalgic 8-bit Pokémon aesthetic.

![PokeChess Banner](src/assets/board/board.png)
*(Replace this with a real screenshot of your game!)*

## 🌟 Features

*   **Classic Gameplay with a Twist**: Full Chess rules implementation (Castling, En Passant, Promotion) wrapped in a charming pixel-art UI.
*   **🤖 Advanced AI Opponents**: Challenge 4 distinct bot personalities, from the blunder-prone "Youngster Joey" to the Grandmaster-level "Champion Cynthia" (powered by Minimax + Alpha-Beta Pruning).
*   **📱 Fully Responsive**: Seamless experience on Desktop and Mobile (supports Portrait & Landscape).
*   **🎨 Dynamic Visuals**:
    *   **Custom Drag & Drop**: Smooth manual piece movement with `react-dnd`.
    *   **Legal Move Highlights**: Professional dot indicators and capture rings.
    *   **Animations**: Framer Motion powered transitions for moves and captures.
*   **🔊 Immersive Audio**:
    *   Custom "Felt" move sounds.
    *   Satisfying capture impacts.
    *   Victory fanfares and check alerts.

## 🛠️ Tech Stack

*   **Frontend**: React (Vite)
*   **Styling**: Tailwind CSS, Pixel Art CSS
*   **Logic**: `chess.js` (Game Rules)
*   **Drag & Drop**: `react-dnd` + `react-dnd-html5-backend` & `react-dnd-touch-backend`
*   **Animation**: Framer Motion
*   **Audio**: Web Audio API + Custom Assets

## 🚀 Getting Started

### Prerequisites
*   Node.js (v14 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Mohd-Kamil/PokeChess.git
    cd PokeChess
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` to play!

## 📦 Deployment

This project is optimized for deployment on **Netlify** or **Vercel**.

1.  Build the project:
    ```bash
    npm run build
    ```
2.  Upload the `dist` folder to your hosting provider.

## 🎮 How to Play

1.  **Select a Difficulty**: Choose your opponent from the Main Menu.
2.  **Move Pieces**: Drag and drop pieces or Tap-to-Select and Tap-to-Move.
3.  **Capture**: Take the opponent's Pokemon to win material.
4.  **Promote**: Reach the end of the board with a Pawn to evolve it!
5.  **Checkmate**: Trapping the King wins the game!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit Pull Requests to help improve the game.

## 📄 License

This project is open-source and available under the MIT License.

---
*Created with ❤️ by [Mohd Kamil](https://github.com/Mohd-Kamil)*
