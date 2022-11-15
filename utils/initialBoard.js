let colorChecker = false

const initalBoard = () => (Array.from({length: 64}, (_, index) => {
  const availabeRow = ["a", "b", "c", "d", "e", "f", "g", "h"]
  const initialPositionBlack = {
    a1: 'R',
    b1: 'KN',
    c1: 'B',
    d1: 'Q',
    e1: 'K',
    f1: 'B',
    g1: 'KN',
    h1: "R",
    a2: 'P',
    b2: 'P',
    c2: 'P',
    d2: 'P',
    e2: 'P',
    f2: 'P',
    g2: 'P',
    h2: "P",
  }

  const initialPositionWhite = {
    a8: 'R',
    b8: 'KN',
    c8: 'B',
    d8: 'Q',
    e8: 'K',
    f8: 'B',
    g8: 'KN',
    h8: 'R',
    a7: 'P',
    b7: 'P',
    c7: 'P',
    d7: 'P',
    e7: 'P',
    f7: 'P',
    g7: 'P',
    h7: 'P'
  }
  
  const chessObj = {
    color:  colorChecker ? "black" : "white",
    column: (parseInt(index/8)) + 1, 
    black: initialPositionBlack[`${availabeRow[index%8]}${(parseInt(index/8)) + 1}`] || null, 
    white: initialPositionWhite[`${availabeRow[index%8]}${(parseInt(index/8)) + 1}`] || null, 
    row:  availabeRow[index%8],
    name: `${availabeRow[index%8]}${(parseInt(index/8)) + 1}`,
  }
  colorChecker = !colorChecker
  if ((index + 1)%8 === 0)
    colorChecker = !colorChecker
  return chessObj
}))

export default initalBoard