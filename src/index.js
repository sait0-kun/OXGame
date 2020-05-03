import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() { // Boradを出力し、valueとonClickを全てのマス目に設定する
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // this.state.history{squares: array(0)'null'}を抜き出す
    const current = history[history.length - 1]; // history配列の長さ-1が現在地？
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return; //Gameの勝敗決定後or既にsquares[i]が埋まっている場合は押せない
    }
    squares[i] = this.state.xIsNext ? "O" : "X"; //マス目に入るマーク
    this.setState({
      history: history.concat([
        {
          squares: squares, // []内に{}を収納 例:[0:{squares: Array(9)}]
          col: (i % 3) + 1, // 0~8の剰余で列設定
          row: Math.floor(i / 3) + 1 //0~8の除算、小数点以下切り捨てで行設定
        }
      ]),
      stepNumber: history.length, // history配列の長さで更新
      xIsNext: !this.state.xIsNext // true false の反転
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + '('+ step.row + ',' + step.col +')':
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    
    let status;
    if (winner) { //勝敗判定
      status = "Winner: " + winner; 
    } else {
      status = "Next player: " + (this.state.xIsNext ? "O" : "X"); //まだゲーム続く場合の手番表示
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) { // 勝敗判定の定義関数
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) { // XXX or OOO となったら、XかOを返す
      return squares[a];
    }
  }
  return null;
}
