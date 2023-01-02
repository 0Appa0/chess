
export default {
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  emits: ['setActive', 'movable'],
  setup(props, context) {
    const handleMouseDown = (e) => {
      e.preventDefault()
      if(e.type === "mousedown")
        handleDragStart(e)
      if(e.type === "mouseup")
        handleDragEnd(e)
      if((!props.config.black && !props.config.white) || props.config.active) 
        return
      context.emit('setActive', props.config)
    }
    const handleDragStart = (e) =>{
      if(!props.config.black && !props.config.white)
        return
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

    const handleMovableCLick = (e) => {
      if(!props.config.moveAllowed) 
        return
      context.emit('movable', props.config)
    }

    return {
      handleDragStart,
      handleDragEnd,
      handleDrop,
      handleMouseDown,
      handleMovableCLick,
    }
  },
  template: 
  `
    <div 
      class="chess__block" 
      :color="config.color"
      :class="[config.active ? 'active' : '', config.moveAllowed ? 'movable': '']"
      @click="handleMovableCLick"
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