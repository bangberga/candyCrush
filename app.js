document.addEventListener("DOMContentLoaded", () => {
  const scoreDisplay = document.getElementById("score");
  const grid = document.querySelector(".grid");
  const candies = ["red", "yellow", "green", "blue", "orange", "purple"];
  let squares = [];
  const width = 8;
  let matchFound;
  let score = 0;

  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const candyType = Math.floor(Math.random() * candies.length);
      let square = document.createElement("div");
      square.setAttribute("class", candies[candyType]);
      square.setAttribute("draggable", true);
      grid.appendChild(square);
      squares.push(square);
    }
    newBoard();
  }
  function newBoard() {
    squares.forEach((square) => {
      if (square.className === "") {
        const candyType = Math.floor(Math.random() * candies.length);
        square.className = candies[candyType];
      }
    });
    checkForMatch();
    score = 0;
    scoreDisplay.innerHTML = score;
    if (matchFound === true) newBoard();
  }
  createBoard();
  squares.forEach((index) => {
    index.addEventListener("dragstart", dragStart);
    index.addEventListener("drop", dragDrop);
    index.addEventListener("dragover", dragOver);
  });

  let draggedCandy;
  let draggedTypeCandy;
  let droppedCandy;
  let droppedTypeCandy;
  let draggedCandyIndex;
  let droppedCandyIndex;
  let draggedRightEdge;
  let draggedLeftEdge;
  function dragStart() {
    draggedCandy = this;
    draggedTypeCandy = draggedCandy.className;
    draggedCandyIndex = squares.indexOf(draggedCandy);

    draggedRightEdge = draggedCandyIndex % width === width - 1 ? true : false;
    draggedLeftEdge = draggedCandyIndex % width === 0 ? true : false;
  }
  function dragOver(e) {
    e.preventDefault();
  }
  function dragDrop() {
    droppedCandy = this;
    droppedTypeCandy = droppedCandy.className;
    droppedCandyIndex = squares.indexOf(droppedCandy);

    if (
      droppedCandyIndex === draggedCandyIndex - width ||
      droppedCandyIndex === draggedCandyIndex + width ||
      (droppedCandyIndex === draggedCandyIndex - 1 && !draggedLeftEdge) ||
      (droppedCandyIndex === draggedCandyIndex + 1 && !draggedRightEdge)
    ) {
      squares[droppedCandyIndex].className = draggedTypeCandy;
      squares[draggedCandyIndex].className = droppedTypeCandy;
      checkForMatch();
      if (matchFound === false) {
        setTimeout(() => {
          squares[draggedCandyIndex].className = draggedTypeCandy;
          squares[droppedCandyIndex].className = droppedTypeCandy;
        }, 500);
      } else {
        setTimeout(moveDown, 200);
      }
    }
  }
  function checkForMatch() {
    let clearIndex = [];
    matchFound = false;
    for (let i = 0; i < squares.length; i++) {
      if (i % width !== width - 1 && i % width !== width - 2) {
        if (
          squares[i].className.includes(squares[i + 1].className) &&
          squares[i].className.includes(squares[i + 2].className)
        ) {
          clearIndex.push(i);
          clearIndex.push(i + 1);
          clearIndex.push(i + 2);
        }
      }
      if (i < 48) {
        if (
          squares[i].className.includes(squares[i + width].className) &&
          squares[i].className.includes(squares[i + width * 2].className)
        ) {
          clearIndex.push(i);
          clearIndex.push(i + width);
          clearIndex.push(i + width * 2);
        }
      }
    }
    if (clearIndex.length === 0) matchFound = false;
    else {
      matchFound = true;
      score += clearIndex.length;
      scoreDisplay.innerHTML = score;
    }
    squares.forEach((square, index) => {
      if (clearIndex.includes(index)) square.className = "";
    });
  }
  let columnCandies;
  function moveDown() {
    for (let i = 0; i < width; i++) {
      columnCandies = [];
      for (let j = i; j < width * width; j += width) {
        const candyType = squares[j].className;
        columnCandies.push(candyType);
      }
      let filteredColumn = columnCandies.filter((candy) => candy);
      let missing = columnCandies.length - filteredColumn.length;
      let empty = Array(missing).fill("");
      let newColumnCandies = empty.concat(filteredColumn);
      newColumnCandies.forEach((candy, index, arr) => {
        if (!candy) {
          const candyType = Math.floor(Math.random() * candies.length);
          arr[index] = candies[candyType];
        }
      });
      let indexCandy = 0;
      for (let j = i; j < width * width; j += width) {
        squares[j].className = newColumnCandies[indexCandy];
        indexCandy++;
      }
    }
    checkForMatch();
    if (matchFound === true) setTimeout(moveDown, 200);
  }
});
