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
    const activePlayer = ref("p1")

    const handleSetBoardActive = (config) => {
      if((activePlayer.value === "p1" && config.black) || activePlayer.value === "p2" && config.white)
        return
      const lm = legalMove(board.value, config)
      board.value = board.value.map(item => ({
        ...item, 
        active: item.name === config.name ? true : false,
        moveAllowed: lm.includes(item.name) ? true : false
      }))
      
    }

    const handlePieceMove = (config) => {
      const activeElement = board.value.find(item => item.active)
      activePlayer.value = activePlayer.value === "p1" ? "p2" : "p1"
      board.value = board.value.map(item => {
        if(item.active) {
          return {...item, active: false, black:null, white: null}
        }
        if(item.name === config.name) {
          return {...item, black: activeElement.black, white: activeElement.white, moveAllowed: false}
        }
        return { ...item, moveAllowed: false }
      })
    }

    return {
      board,
      handleSetBoardActive,
      handlePieceMove
    }
  },
  template: 
  `
    <div class="chess__board">
      <boardElement 
        v-for="(item, index) in board" 
        :config="item" 
        @setActive="handleSetBoardActive" 
        @movable="handlePieceMove"
        :name="item.name"
      />
    </div>
  `
}