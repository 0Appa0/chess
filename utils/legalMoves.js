


const pawnMoves = ({ position, board }) => {
  return {}
}

const bishopMoves = ({ position, board }) => {
  return {}
}

const queenMoves = ({ position, board  }) => {
  return {}
}

const rookMoves = ({ position, board }) => {
  return {}
}

const kingMoves = ({ position, board }) => {
  return {}
}

const knightMoves = ({ position, board }) => {
  return {}
}

const functionMapper = {
  pawnMoves,
  bishopMoves,
  queenMoves,
  rookMoves,
  kingMoves,
  knightMoves
}


const legalMove = ({ position, board, piece }) => {
  return functionMapper[`${piece}Movess`]({ position, board })
}

export default { legalMove }