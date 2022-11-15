

const availabeRow = ["a", "b", "c", "d", "e", "f", "g", "h"]

const pMoves = (board, current) => {
  const allowedMoved = []
  if (current.white) {
    const pos = current.name.split("")
    allowedMoved.push(`${pos[0]}${Number(pos[1]) - 1}`)
    allowedMoved.push(`${pos[0]}${Number(pos[1]) - 2}`)
  } 
  if (current.black) {
    const pos = current.name.split("")
    allowedMoved.push(`${pos[0]}${Number(pos[1]) + 1}`)
    allowedMoved.push(`${pos[0]}${Number(pos[1]) + 2}`)
  }
  return allowedMoved
}

const bMoves = (board, current) => {
  return {}
}

const qMoves = ({ board, current  }) => {
  return {}
}

const rMoves = (board, current) => {
  return {}
}

const kMoves = (board, current) => {
  return {}
}

const knMoves = (board, current) => {
  return {}
}

const functionMapper = {
  pMoves,
  bMoves,
  qMoves,
  rMoves,
  kMoves,
  knMoves
}


const legalMove = (board,current) => {
  if(current.black)
    return functionMapper[`${current.black.toLowerCase()}Moves`](board, current)
  if(current.white)
    return functionMapper[`${current.white.toLowerCase()}Moves`](board, current)

}

export default legalMove