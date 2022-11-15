import chessBoard from "./components/chess-board.js"
const { onMounted } = Vue

export default {
  components: {
    chessBoard
  },
  template: 
  `
    <div class="chess__main">
      <chessBoard id="chessboard"></chessBoard>
    </div>
  `
}