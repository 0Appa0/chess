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
      blockableSquares: [],
      dominatedSquares: []
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
              let blSquared = setPathToQueen({ lm, current: item, queenSquare })
              activePlayer.value.blockableSquares = Array.from(new Set([...blSquared, item.name, ...activePlayer.value.blockableSquares ]))
            }
          activePlayer.value.dominatedSquares = Array.from(new Set([...lm, ...activePlayer.value.dominatedSquares ]))
        }
      })

      let moves = []
      board.value.forEach(item => {
        if(item[currentPlayer]) {
          const lm = legalMove(board.value, {
            ...item,
            ...activePlayer.value
          })
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
      const queenSquare = tempBoard.find(item => item[currentPlayer]  === "K")
      tempBoard = tempBoard.map(item => {
        if(item.name === config.name ) {
          return {...item, active: false, black:null, white: null}
        }
        if(item.name === lm) {
          return {...item, black: config.black, white: config.white, moveAllowed: false}
        }
        return { ...item, moveAllowed: false }
      })

      tempBoard.forEach(item => {
        if(item[opp]) {
          const m = legalMove(tempBoard, {
            ...item, 
            inCheck: false, 
            blockableSquares: [], 
            dominatedSquares: []
          })
          if(m.includes(queenSquare.name))
            moveAllowed = false
        }
      })
      return moveAllowed
    }

    const setPathToQueen = ({ lm, current, queenSquare}) => {
      const cur = current.black || current.white
      let res = []
      const queenPos = queenSquare.name
      switch(cur) {
        case 'P':
          res = [current.name]
          break;
        case "KN":
          res = [current.name]
          break;
        default:
          res = [...getAllMoveList({queenPos, curPos: current.name })]
      }

      return res
    }

    const getAllMoveList = ({ queenPos, curPos }) => {
      let moveList = [curPos]
      let [qr, qp] = queenPos.split("")
      let [cr, cp] = curPos.split("")
      cp = Number(cp)
      qp = Number(qp)

      while(qr !== cr || cp !== qp){ 
        if(cp < qp)
          cp ++

        if (cp>qp)
          cp --
        
        if(availabeRow.indexOf(cr) < availabeRow.indexOf(qr))
          cr = availabeRow[availabeRow.indexOf(cr) + 1] 

        if(availabeRow.indexOf(cr) > availabeRow.indexOf(qr))
          cr = availabeRow[availabeRow.indexOf(cr) - 1] 
        
        moveList = Array.from(new Set([...moveList,  cr+cp ]))
      }

      return moveList
    }

    return {
      board,
      handleSetBoardActive,
      handlePieceMove,
      setPathToQueen,
      getAllMoveList,
      checkifMoveChecks,
      checkmate
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