import boardElement from "./board-element.js"
import initalBoard from "../utils/initialBoard.js"
const { ref } = Vue

export default {
  components: {
    boardElement
  },
  setup() {
    const board = ref(initalBoard())
    return {
      board
    }
  },
  template: 
  `
    <div class="chess__board">
      <boardElement v-for="(item, index) in board" :config="item"/>
    </div>
  `
}