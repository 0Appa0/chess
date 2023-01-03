const rowMapper = {
  a: ["", "", "b", "c"],
  b: ["", "a", "c", "d"],
  c: ["a", "b", "d", "e"],
  d: ["b", "c", "e", "f"],
  e: ["c", "d", "f", "g"],
  f: ["d", "e", "g", "h"],
  g: ["e", "f", "h", ""],
  h: ["f", "g", "", ""],
};

const availabeRow = ["a", "b", "c", "d", "e", "f", "g", "h"];

const getVerticalMoveList = ({ pos, rank, config, board }) => {
  const res = [];
  config.forEach((item) => {
    for (let i = 0; i < item.number; i++) {
      let newPos =
        item.moveType === "backwards"
          ? rank + (pos + (i + 1))
          : rank + (pos - (i + 1));
      let boardPos = board.find((item) => item.name === newPos);
      if (boardPos) {
        if (
          item.type === "pawn" &&
          (boardPos[item.piece] || boardPos[item.opp])
        )
          break;
        if (boardPos[item.piece]) break;
        if (boardPos[item.opp]) {
          res.push(newPos);
          break;
        }
        res.push(newPos);
      }
    }
  });

  return res;
};

const getHorizontalMoveList = ({ pos, rank, config, board }) => {
  const res = [];
  config.forEach((item) => {
    let temRank = rank;
    for (let i = 0; i < item.number; i++) {
      let newPos =
        item.moveType === "left"
          ? rowMapper[temRank][1] + pos
          : rowMapper[temRank][2] + pos;
      temRank =
        item.moveType === "left"
          ? rowMapper[temRank][1]
          : rowMapper[temRank][2];
      let boardPos = board.find((item) => item.name === newPos);
      if (boardPos) {
        if (boardPos[item.piece]) break;
        if (boardPos[item.opp]) {
          res.push(newPos);
          break;
        }
        res.push(newPos);
      }
    }
  });

  return res;
};

const getHorseMoves = ({ pos, rank, board, config }) => {
  const res = [];
  let horseMoves = [
    [-2, 1],
    [-2, 2],
    [2, 1],
    [2, 2],
    [1, 0],
    [-1, 0],
    [1, 3],
    [-1, 3],
  ];
  for (let i = 0; i < 8; i++) {
    let newPos = rowMapper[rank][horseMoves[i][1]] + (pos + horseMoves[i][0]);
    let boardPos = board.find((item) => item.name === newPos);
    if (boardPos) {
      if (!boardPos[config.piece]) res.push(newPos);
    }
  }
  return res;
};

const getDiagonalMoveList = ({ pos, rank, config, board }) => {
  const res = [];
  config.forEach((item) => {
    let temRank = rank;
    for (let i = 0; i < item.number; i++) {
      let newPos;
      if (item.moveType === "fRight") {
        newPos = rowMapper[temRank][2] + (pos - (i + 1));
        temRank = rowMapper[temRank][2];
      }
      if (item.moveType === "bRight") {
        newPos = rowMapper[temRank][2] + (pos + (i + 1));
        temRank = rowMapper[temRank][2];
      }
      if (item.moveType === "fLeft") {
        newPos = rowMapper[temRank][1] + (pos - (i + 1));
        temRank = rowMapper[temRank][1];
      }
      if (item.moveType === "bLeft") {
        newPos = rowMapper[temRank][1] + (pos + (i + 1));
        temRank = rowMapper[temRank][1];
      }

      let boardPos = board.find((item) => item.name === newPos);
      if (boardPos) {
        if (boardPos[item.piece]) break;
        if (boardPos[item.opp]) {
          res.push(newPos);
          break;
        }
        if (item.type !== "pawn") res.push(newPos);
      }
    }
  });

  return res;
};

const pMoves = (board, current) => {
  const [rank, pos] = current.name.split("");
  let allowedMoves = [];
  let number = 1;
  if (current.white && Number(pos) === 7) number = 2;
  if (current.black && Number(pos) === 2) number = 2;
  const vConfig = [
    {
      number,
      moveType: current.white ? "forwards" : "backwards",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
      type: "pawn",
    },
  ];

  const dConfig = [
    {
      number: 1,
      moveType: current.white ? "fLeft" : "bLeft",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
      type: "pawn",
    },
    {
      number: 1,
      moveType: current.white ? "fRight" : "bRight",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
      type: "pawn",
    },
  ];

  const verticalMoveList = getVerticalMoveList({
    pos: Number(pos),
    rank,
    config: vConfig,
    board,
  });
  const diagonalMoveList = getDiagonalMoveList({
    pos: Number(pos),
    rank,
    config: dConfig,
    board,
  });

  allowedMoves = [...verticalMoveList, ...diagonalMoveList];

  if (current.inCheck)
    allowedMoves = allowedMoves.filter((item) =>
      current.blockableSquares.includes(item)
    );

  return allowedMoves;
};

const bMoves = (board, current) => {
  const [rank, pos] = current.name.split("");
  let allowedMoves = [];
  const dConfig = [
    {
      number: 7 - availabeRow.indexOf(rank),
      moveType: "fRight",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
    {
      number: 7 - (7 - availabeRow.indexOf(rank)),
      moveType: "fLeft",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
    {
      number: 7 - (7 - availabeRow.indexOf(rank)),
      moveType: "bLeft",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
    {
      number: 7 - availabeRow.indexOf(rank),
      moveType: "bRight",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
  ];

  const diagonalMoveList = getDiagonalMoveList({
    pos: Number(pos),
    rank,
    config: dConfig,
    board,
  });
  allowedMoves = [...diagonalMoveList];

  if (current.inCheck)
    allowedMoves = allowedMoves.filter((item) =>
      current.blockableSquares.includes(item)
    );

  return allowedMoves;
};

const qMoves = (board, current) => {
  const [rank, pos] = current.name.split("");
  let allowedMoves = [];
  const dConfig = [
    {
      number: 7 - availabeRow.indexOf(rank),
      moveType: "fRight",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
    {
      number: 7 - (7 - availabeRow.indexOf(rank)),
      moveType: "fLeft",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
    {
      number: 7 - (7 - availabeRow.indexOf(rank)),
      moveType: "bLeft",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
    {
      number: 7 - availabeRow.indexOf(rank),
      moveType: "bRight",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
  ];

  const hConfig = [
    {
      number: 7 - (7 - availabeRow.indexOf(rank)),
      moveType: "left",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
    {
      number: 7 - availabeRow.indexOf(rank),
      moveType: "right",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
  ];

  const vConfig = [
    {
      number: 7 - (8 - Number(pos)),
      moveType: "forwards",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
    {
      number: 7 - (Number(pos) - 1),
      moveType: "backwards",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
  ];

  allowedMoves = [
    ...getHorizontalMoveList({
      config: hConfig,
      board,
      rank,
      pos: Number(pos),
    }),
    ...getVerticalMoveList({ config: vConfig, board, rank, pos: Number(pos) }),
    ...getDiagonalMoveList({ pos: Number(pos), rank, config: dConfig, board }),
  ];

  if (current.inCheck)
    allowedMoves = allowedMoves.filter((item) =>
      current.blockableSquares.includes(item)
    );

  return allowedMoves;
};

const rMoves = (board, current) => {
  const [rank, pos] = current.name.split("");
  let allowedMoves = [];

  const hConfig = [
    {
      number: 7 - (7 - availabeRow.indexOf(rank)),
      moveType: "left",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
    {
      number: 7 - availabeRow.indexOf(rank),
      moveType: "right",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
  ];

  const vConfig = [
    {
      number: 7 - (8 - Number(pos)),
      moveType: "forwards",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
    {
      number: 7 - (Number(pos) - 1),
      moveType: "backwards",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
  ];

  allowedMoves = [
    ...getHorizontalMoveList({
      config: hConfig,
      board,
      rank,
      pos: Number(pos),
    }),
    ...getVerticalMoveList({ config: vConfig, board, rank, pos: Number(pos) }),
  ];

  if (current.inCheck)
    allowedMoves = allowedMoves.filter((item) =>
      current.blockableSquares.includes(item)
    );

  return allowedMoves;
};

const kMoves = (board, current) => {
  const [rank, pos] = current.name.split("");
  let allowedMoves = [];
  const dConfig = [
    {
      number: 1,
      moveType: "fRight",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
    {
      number: 1,
      moveType: "fLeft",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
    {
      number: 1,
      moveType: "bLeft",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
    {
      number: 1,
      moveType: "bRight",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
  ];

  const hConfig = [
    {
      number: 1,
      moveType: "left",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
    {
      number: 1,
      moveType: "right",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
  ];

  const vConfig = [
    {
      number: 1,
      moveType: "forwards",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
    {
      number: 1,
      moveType: "backwards",
      piece: current.white ? "white" : "black",
      opp: current.white ? "black" : "white",
    },
  ];

  allowedMoves = [
    ...getHorizontalMoveList({
      config: hConfig,
      board,
      rank,
      pos: Number(pos),
    }),
    ...getVerticalMoveList({ config: vConfig, board, rank, pos: Number(pos) }),
    ...getDiagonalMoveList({ pos: Number(pos), rank, config: dConfig, board }),
  ];

  if (current.inCheck)
    allowedMoves = allowedMoves.filter(
      (item) => !current.dominatedSquares.includes(item)
    );

  return allowedMoves;
};

const knMoves = (board, current) => {
  const [rank, pos] = current.name.split("");
  let allowedMoves = [];
  allowedMoves = [
    ...getHorseMoves({
      rank,
      pos: Number(pos),
      board,
      config: {
        piece: current.white ? "white" : "black",
        opp: current.white ? "black" : "white",
      },
    }),
  ];
  if (current.inCheck)
    allowedMoves = allowedMoves.filter((item) =>
      current.blockableSquares.includes(item)
    );

  return allowedMoves;
};

const functionMapper = {
  pMoves,
  bMoves,
  qMoves,
  rMoves,
  kMoves,
  knMoves,
};

const legalMove = (board, current) => {
  if (current.black)
    return functionMapper[`${current.black.toLowerCase()}Moves`](
      board,
      current
    );
  if (current.white)
    return functionMapper[`${current.white.toLowerCase()}Moves`](
      board,
      current
    );
};

export default legalMove;
