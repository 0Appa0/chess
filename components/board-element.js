const { ref } = Vue

export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  emits: ['click'],
  setup(_props, context) {

    const handleMouseDown = (e) => {
      console.log(e.type)
      e.preventDefault()
      if(e.type === "mousedown")
        handleDragStart(e)
      if(e.type === "mouseup")
        handleDragEnd(e)
    }
    const handleDragStart = (e) =>{
      e.target.removeEventListener("onmousedown", handleMouseDown)
      e.target.classList.add("dragging")
      const offset = getOffset(e)
      e.target.style = `transform:translate(${(e.x - offset.x)}px,${(e.y - offset.y)}px)`
    }

    const getOffset = (el) => {
      const rect = el.target.getBoundingClientRect();
      return {
        x: (rect.left + rect.right) / 2,
        y: (rect.top + rect.bottom) / 2
      };
    }

    const handleDragEnd = (e) => {
      e.target.classList.remove("dragging")
      e.target.style = ""
    }
    const handleDrop = (e) => {
      console.log("drop");
    }

    const handleClick = (e) => {
    }

    return {
      handleDragStart,
      handleDragEnd,
      handleDrop,
      handleClick,
      handleMouseDown
    }
  },
  template: 
  `
    <div 
      class="chess__block" 
      :color="config.color"
    >
      <div 
        class="pi"  
        :white="config.white" 
        :black="config.black" 
        v-if="config.white || config.black" 
        @mousedown="handleMouseDown"
        @mouseup="handleMouseDown"
      />
    </div>
  `
}