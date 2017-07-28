var gameOfLife = {

  width: 12,
  height: 12, // width and height dimensions of the board
  stepInterval: null, // should be used to hold reference to an interval that is "playing" the game

  createAndShowBoard: function () {

    // create <table> element
    var goltable = document.createElement("tbody");

    // build Table HTML
    var tablehtml = '';
    for (var h=0; h<this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w=0; w<this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;

    // add table to the #board element
    var board = document.getElementById('board');
    board.appendChild(goltable);

    // once html elements are added to the page, attach events to them
    this.setupBoardEvents();
  },

  forEachCell: function (iteratorFunc) {

    for (var i=0;i<this.height;i++) {
      for (var j=0;j<this.width;j++) {
        var cell=document.getElementById(i + "-" + j)
          iteratorFunc(cell,i,j);

      }
    }
  },

  setupBoardEvents: function() {

    // each board cell has an CSS id in the format of: "x-y"
    // where x is the x-coordinate and y the y-coordinate
    // use this fact to loop through all the ids and assign
    // them "click" events that allow a user to click on
    // cells to setup the initial state of the game
    // before clicking "Step" or "Auto-Play"

    var onCellClick = function (e) {
      // QUESTION TO ASK YOURSELF: What is "this" equal to here?
      // how to set the style of the cell when it's clicked
      if (this.dataset.status == 'dead') {
        this.className = 'alive';
        this.dataset.status = 'alive';
      } else {
        this.className = 'dead';
        this.dataset.status = 'dead';
      }
    };

    // add event listener for every cell
    this.forEachCell(function (cell,i,j) {
      cell.addEventListener("click",onCellClick.bind(cell))
    });

    // reset randomize
    var resetButton = document.getElementById('reset_btn');

    var stepButton = document.getElementById('step_btn');
    stepButton.addEventListener('click',this.step.bind(this));
  



    var resetClick = function (e) {

      this.forEachCell(function (cell,i,j) {
        if (Math.random() < .5) {
          cell.className = 'alive';
          cell.dataset.status = 'alive';
        } else {
          cell.className = 'dead';
          cell.dataset.status = 'dead';
        }
      });
    }

    resetButton.addEventListener('click',resetClick.bind(this));

    // clear board
    var clearButton = document.getElementById('clear_btn');
    var clearBoard = function (e) {

        this.forEachCell(function (cell,i,j) {

        cell.className = 'dead';
        cell.dataset.status = 'dead';

      });
    }

    clearButton.addEventListener('click',clearBoard.bind(this));

    document.getElementById("5-4").dataset.status="alive";
    document.getElementById("5-4").className="alive";

    document.getElementById("6-4").dataset.status="alive";
    document.getElementById("6-4").className="alive";
    document.getElementById("7-4").dataset.status="alive";
    document.getElementById("7-4").className="alive";
    this.step();

  },

  step: function () {

    // Here is where you want to loop through all the cells
    // on the board and determine, based on it's neighbors,
    // whether the cell should be dead or alive in the next
    // evolution of the game.
    //
    // You need to:
    // 1. Count alive neighbors for all cells
    // 2. Set the next state of all cells based on their alive neighbors
    var countAliveNeighbors = function (cell) {
      var id = cell.id;
      var coordinates = id.split("-");
      var x = coordinates[0];
      var y = coordinates[1];

      var numAlive = 0;
      for (var i = x-1; i <= x+1; i++) {
        for (var j = y-1; j <= y+1; j++) {
          if (!(i === x && j === y) && document.getElementById(i+"-"+j) &&
            document.getElementById(i+"-"+j).dataset.status=="alive") {
            numAlive++;
          }
        }
      }

      return numAlive;
    }

    var aliveNeighbors = {};

    this.forEachCell(function(cell,i,j) {
      console.log(cell);
      aliveNeighbors[i+"-"+j] = countAliveNeighbors(cell);
      console.log(aliveNeighbors[i+"-"+j]);
    });
    this.forEachCell(function(cell,i,j) {
      if (cell.dataset.status =="alive" && (aliveNeighbors[i+"-"+j] === 2 || aliveNeighbors[i+"-"+j] === 3)) {
        cell.dataset.status = "alive";
        cell.className = 'alive'
      } else if (cell.dataset.status =="alive"  && aliveNeighbors[i+"-"+j] <2) {
        cell.dataset.status = "dead"
        cell.className = 'dead';
      } else if (cell.dataset.status =="alive" && aliveNeighbors[i+"-"+j] >3) {
        cell.dataset.status ="dead"
        cell.className = 'dead';
      } else if (cell.dataset.status =="dead" && aliveNeighbors[i+"-"+j] === 3) {
        cell.dataset.status="alive"
        cell.className = 'alive';
      }
    })
  },

  enableAutoPlay: function () {
    // Start Auto-Play by running the 'step' function
    // automatically repeatedly every fixed time interval
  }

};

gameOfLife.createAndShowBoard();
