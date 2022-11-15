const { ref } = Vue

export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const bkgImg = ref({})

    const moveEvent = (e) => {
      let movablePiece = document.getElementById('movablePiece');
      if (!movablePiece)
        return
      let left = e.pageX;
      let top = e.pageY;
      movablePiece.style.left = left + 'px';
      movablePiece.style.top = top + 'px';
    }

    const handleDragStart = (e) =>{
      e.preventDefault()
      document.addEventListener('mousemove', moveEvent)
      if(e.type === "touchstart")
        return
      const style = getComputedStyle(e.target)
      const height = style.height
      const width = style.width
      bkgImg.value = style.backgroundImage
      const elem = document.createElement("div")
      elem.id = "movablePiece"
      elem.style.backgroundImage = bkgImg.value
      elem.style.height = height
      elem.style.width = width
      elem.style.position = "fixed"
      elem.style.left = e.clientX + "px"
      elem.style.top = e.clientY + "px"
      elem.style.backgroundRepeat = "no-repeat"
      elem.style.backgroundSize = "contain"
      const board = document.getElementById("chessboard")
      board.appendChild(elem)
    }

    const handleDragEnd = (e) => {
      // e.preventDefault()

      document.getElementById("movablePiece").remove()
      document.removeEventListener("mousemove", moveEvent)
    }
    const handleDrop = (e) => {
      console.log("drop");
    }
    return {
      bkgImg,
      handleDragStart,
      handleDragEnd,
      handleDrop
    }
  },
  template: 
  `
    <div 
      class="chess__block" 
      :white="config.white" 
      :black="config.black" 
      :color="config.color"
      @click="handleDragStart"
      @mouseup="handleDragEnd"
    >
    </div>
  `
}