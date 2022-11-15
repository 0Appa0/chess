
export default {
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  emits: ['setActive'],
  setup(props, context) {
    const handleMouseDown = (e) => {
      console.log(e.type)
      e.preventDefault()
      if(e.type === "mousedown")
        handleDragStart(e)
      if(e.type === "mouseup")
        handleDragEnd(e)
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


    const handleElementClick = (e) => {
      if((!props.config.black && !props.config.white) || props.config.active) 
        return
      context.emit('setActive', props.config)
    }

    return {
      handleDragStart,
      handleDragEnd,
      handleDrop,
      handleMouseDown,
      handleElementClick
    }
  },
  template: 
  `
    <div 
      class="chess__block" 
      :color="config.color"
      :class="[config.active ? 'active' : '', config.moveAllowed ? 'movable': '']"
    >
      <div 
        class="pi"  
        :white="config.white" 
        :black="config.black" 
        v-if="config.white || config.black" 
        @mousedown="handleMouseDown"
        @mouseup="handleMouseDown"
        @click="handleElementClick"
      />
    </div>
  `
}