import chessBoard from "./components/chess-board.js"
const { onMounted } = Vue

export default {
  components: {
    chessBoard
  },
  setup() {
    onMounted(() => {
      document.addEventListener('mousemove', moveEvent)
    })
    const moveEvent = (e) => {
      let movablePiece = document.getElementsByClassName('dragging')[0];
      if (!movablePiece)
        return
      const offset = getOffset(movablePiece)
      let offsetValues = {}
      let values = movablePiece.style.transform.split("translate")[1].split(",")
      offsetValues.x= values[0].split("(")[1].split('px')[0]
      offsetValues.y = values[1].split(")")[0].split('px')[0]
      movablePiece.style = `transform:translate(${Number(offsetValues.x) - (offset.x - e.x)}px,${Number(offsetValues.y) - (offset.y - e.y)}px)`
    }

    const getOffset = (el) => {
      const rect = el.getBoundingClientRect();
      return {
        x: (rect.left + rect.right) / 2,
        y: (rect.top + rect.bottom) / 2
      };
    }
    return {
      moveEvent
    }
  },
  template: 
  `
    <div class="chess__main">
      <chessBoard id="chessboard"></chessBoard>
    </div>
  `
}