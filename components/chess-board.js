import boardElement from "./board-element.js"
import initalBoard from "../utils/initialBoard.js"
import legalMove from "../utils/legalMoves.js"
import Mask from "./mask.js"
const { ref } = Vue

export default {
  components: {
    boardElement,
    Mask
  },
  emits:["setNewGame"],
  props: {
    resetGame: {
      type: String,
      default: "false"
    }
  },
  watch: {
    resetGame(newVal) {
      if(newVal === "true") {
        this.board = initalBoard()
        this.activePlayer = { pn: "p1", inCheck: false}
        this.checkmate = false
        this.casatable = {
          "p1": {left: true, right: true},
          "p2": {left: true, right: true}
        }
        this.$emit("setNewGame")
      }
    }
  },

  setup(props) {
    const board = ref(initalBoard())
    const endMessage = ref("")
    const checkmate = ref(false)
    const activePlayer = ref({
      pn: "p1",
      inCheck: false,
    })
    const casatable = ref({
      "p1": {left: true, right: true},
      "p2": {left: true, right: true}
    })

    const handleSetBoardActive = (config) => {
      if((activePlayer.value.pn === "p1" && config.black) || (activePlayer.value.pn === "p2" && config.white))
        return
        let lm 
      if((config.black || config.white ) === "K")
        {
          lm = legalMove(board.value, {
            ...config, 
            ...activePlayer.value, 
            left: activePlayer.value.inCheck ? false : casatable.value[activePlayer.value.pn]['left'],
            right: activePlayer.value.inCheck ? false : casatable.value[activePlayer.value.pn]['right']
          })
        }
      else {
        lm = legalMove(board.value, {
          ...config, ...activePlayer.value 
        })
      }
      
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
      let pendingRookMove = []
      board.value = board.value.map(item => {
        if(activeElement.white === "K" && activeElement.name === "e8")
          {
            casatable.value.p1.left = false
            casatable.value.p1.right = false
          }
        if(activeElement.black === "K" && activeElement.name === "e1") {
            casatable.value.p2.left = false
            casatable.value.p2.right = false
        }
        if(activeElement.white === "R" && activeElement.name === "h8")
          casatable.value.p1.right = false
        if(activeElement.white === "R" && activeElement.name === "a8")
          casatable.value.p1.left = false

        if(activeElement.black === "R" && activeElement.name === "a1")
          casatable.value.p2.left = false
        if(activeElement.black === "R" && activeElement.name === "h1")
          casatable.value.p2.right = false

        if(item.active) {
          return {...item, active: false, black:null, white: null}
        }

        if(item.name === config.name) {
          if(Number(config.name.split("")[1]) === 1 && activeElement.white === "P")
            return { ...item, black: activeElement.black, white: "Q", moveAllowed: false }

          if(Number(config.name.split("")[1]) === 8 && activeElement.black === "P")
            return { ...item, black: "Q", white: null, moveAllowed: false }

          if(activeElement.white === "K" && activeElement.name === "e8" && item.name === "g8") {
            casatable.value.p1 = { left: false, right: false }
            pendingRookMove = ["h8", "f8", "white"]
          }
          
          if(activeElement.white === "K" && activeElement.name === "e8" && item.name === "c8") {
            casatable.value.p1 = { left: false, right: false }
            pendingRookMove = ["a8", "d8", "white"]
          }

          if(activeElement.black === "K" && activeElement.name === "e1" && item.name === "g1") {
            casatable.value.p2 = { left: false, right: false }
            pendingRookMove = ["h1", "f1", "black"]
          }

          if(activeElement.black === "K" && activeElement.name === "e1" && item.name === "c1") {
            casatable.value.p2 = { left: false, right: false }
            pendingRookMove = ["a1", "d1", "black"]
          }

          return {...item, black: activeElement.black, white: activeElement.white, moveAllowed: false}
        }

        return { ...item, moveAllowed: false }
      })

      if(pendingRookMove.length !== 0) {
        board.value = board.value.map(item => {
          if(item.name === pendingRookMove[0]) 
            return { ...item, black: null, white: null }
          if(item.name === pendingRookMove[1]) 
            return { 
              ...item, 
              black: pendingRookMove[2] === "white" ? null : "R", 
              white: pendingRookMove[2] === "black" ? null : "R" 
            }
          return { ...item }
        })
      }

      activePlayer.value = {
        pn: activePlayer.value.pn === "p1" ? "p2" : "p1",
        inCheck: false,
      }

      setNextMove()
    }

    const setNextMove = () => {
      const kingEl = document.getElementsByClassName("check")[0]
      if(kingEl)
        kingEl.classList.remove("check")
      const currentPlayer = activePlayer.value.pn === "p1" ? "white" : "black"
      const opp = activePlayer.value.pn === "p1" ? "black" : "white"
      let queenSquare = board.value.find(item => item[currentPlayer]  === "K")

      let moves = []
      board.value.forEach(item => {
        if(item[opp]) {
          let lm = legalMove(board.value, {
            ...item,
            ...activePlayer.value
          })
          if(lm.includes(queenSquare.name))
              {
                activePlayer.value.inCheck = true
                const king = document.querySelectorAll(`[name="${queenSquare.name}"]`)[0]
                king.classList.add("check")
              }
        }
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
        {
          checkmate.value = true
          if(activePlayer.value.inCheck)
            endMessage.value = `${opp} wins!!!!!`
          else
            endMessage.value = "Draw stalemate"
        }
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

    const handleCloseMask = () => {
      checkmate.value = false
    }

    return {
      board,
      handleSetBoardActive,
      handlePieceMove,
      checkifMoveChecks,
      checkmate,
      activePlayer,
      endMessage,
      handleCloseMask
    }
  },
  template: 
  `
    <div class="chess__board" :key="resetGame">
      <Mask :message="endMessage" v-if="checkmate" @closeMask="handleCloseMask"/>
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