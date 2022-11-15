import boardElement from "./board-element.js"
import initalBoard from "../utils/initialBoard.js"
import legalMove from "../utils/legalMoves.js"
const { ref } = Vue

export default {
  components: {
    boardElement
  },
  setup() {
    const board = ref(initalBoard())

    const handleSetBoardActive = (config) => {
      const lm = legalMove(board.value, config)
      board.value = board.value.map(item => ({
        ...item, 
        active: item.name === config.name ? true : false,
        moveAllowed: lm.includes(item.name) ? true : false
      }))
    }
    return {
      board,
      handleSetBoardActive
    }
  },
  template: 
  `
    <div class="chess__board">
      <boardElement v-for="(item, index) in board" :config="item" @setActive="handleSetBoardActive"/>
    </div>
  `
}