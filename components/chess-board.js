import boardElement from "./board-element.js"
import initalBoard from "../utils/initialBoard.js"
import legalMove from "../utils/legalMoves.js"
const { ref, watchEffect } = Vue

export default {
  components: {
    boardElement
  },
  setup() {
    const board = ref(initalBoard())
    const activePlayer = ref({
      pn: "p1",
      inCheck: false,
      blockableSquares: [],
      dominatedSquares: []
    })

    const handleSetBoardActive = (config) => {
      if((activePlayer.value.pn === "p1" && config.black) || (activePlayer.value.pn === "p2" && config.white))
        return
      const lm = legalMove(board.value, {
        ...config, ...activePlayer.value 
      })
      board.value = board.value.map(item => ({
        ...item, 
        active: item.name === config.name ? true : false,
        moveAllowed: lm.includes(item.name) ? true : false
      }))
      
    }

    const handlePieceMove = (config) => {
      const activeElement = board.value.find(item => item.active)
      activePlayer.value = {
        pn: activePlayer.value.pn === "p1" ? "p2" : "p1",
        inCheck: false,
        blockableSquares: [],
        dominatedSquares: []
      }

      board.value = board.value.map(item => {
        if(item.active) {
          return {...item, active: false, black:null, white: null}
        }
        if(item.name === config.name) {
          return {...item, black: activeElement.black, white: activeElement.white, moveAllowed: false}
        }
        return { ...item, moveAllowed: false }
      })

      setNextMove()
    }

    const setNextMove = () => {
      const currentPlayer = activePlayer.value.pn === "p1" ? "white" : "black"
      const opp = activePlayer.value.pn === "p1" ? "black" : "white"
      const queenSquare = board.value.find(item => item[currentPlayer]  === "K")
      board.value.forEach(item => {
        if(item[opp]) {
          const lm = legalMove(board.value, {
            ...item, 
            inCheck: false, 
            blockableSquares: [], 
            dominatedSquares: []
          })

          if(lm.includes(queenSquare.name))
            {
              activePlayer.value.inCheck = true
              activePlayer.value.blockableSquares = Array.from(new Set([...lm, item.name, ...activePlayer.value.blockableSquares ]))
            }
          activePlayer.value.dominatedSquares = Array.from(new Set([...lm, ...activePlayer.value.dominatedSquares ]))
        }
      })
    }

    return {
      board,
      handleSetBoardActive,
      handlePieceMove,
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