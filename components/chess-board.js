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
    const availabeRow = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const checkmate = ref(false)
    const activePlayer = ref({
      pn: "p1",
      inCheck: false,
    })

    const handleSetBoardActive = (config) => {
      if((activePlayer.value.pn === "p1" && config.black) || (activePlayer.value.pn === "p2" && config.white))
        return
      let lm = legalMove(board.value, {
        ...config, ...activePlayer.value 
      })
      const tempBoard = board.value
      lm = lm.filter(item => checkifMoveChecks({ tempBoard, lm: item, config }))

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
      let moves = []
      board.value.forEach(item => {
        if(item[currentPlayer]) {
          let lm = legalMove(board.value, {
            ...item,
            ...activePlayer.value
          })
          lm = lm.filter(move => checkifMoveChecks({ tempBoard: board.value, lm: move, config: item }))
          moves = [...moves, ...lm]
        }
      })
      if(moves.length === 0) 
        checkmate.value = true
    }

    const checkifMoveChecks = ({ tempBoard, lm, config}) => {
      let moveAllowed = true
      const currentPlayer = activePlayer.value.pn === "p1" ? "white" : "black"
      const opp = activePlayer.value.pn === "p1" ? "black" : "white"
      tempBoard = tempBoard.map(item => {
        if(item.name === config.name ) {
          return {...item, active: false, black:null, white: null}
        }
        if(item.name === lm) {
          return { ...item, black: config.black, white: config.white, moveAllowed: false}
        }
        return { ...item, moveAllowed: false }
      })
      let queenSquare = tempBoard.find(item => item[currentPlayer]  === "K")
      tempBoard.forEach(item => {
        if(item[opp]) {
          const m = legalMove(tempBoard, {
            ...item, 
            inCheck: false, 
          })
          if(m.includes(queenSquare.name))
            moveAllowed = false
        }
      })
      return moveAllowed
    }

    return {
      board,
      handleSetBoardActive,
      handlePieceMove,
      checkifMoveChecks,
      checkmate,
      activePlayer
    }
  },
  template: 
  `
  {{ checkmate }}
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