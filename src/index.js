import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 自身でstateの管理をしなくなったので関数コンポーネントとして定義
function Square(props) {
  return (
    // onClickでクリックされた時のイベントを定義
    // クリックされた時に親のonClickを呼び出すようにする
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    // ここでprops として 自分のstateのsquearesで子のstateを管理する
    // SquareにはvalueとonClickをpropsとして渡している
    return <Square
              value={ this.props.squares[i] }
              // onClickが呼ばれた時にhandleClickという関数を呼び出す
              onClick={ () => this.props.onClick(i) }
            />;
  }

  render() {
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
  // ここで盤面の情報を履歴とともに保持し、手順の管理もする
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // xIsNextがtureならXをfalseならOを代入する
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    // historyに盤面の情報を追加する
    this.setState({
      history: history.concat([{
        squares: squares,
        col: (i % 3) + 1,
        row: Math.floor(i / 3) + 1,
      }]),
      stepNumber: history.length,
      // 真偽値を逆に更新する
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    // 実行されたらsetStateでstateを更新する
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      // moveがない場合はGo to startを表示する
      const decs = move ?
        `Go to move #${move}（col: ${step.col}, row: ${step.row}）`:
        `Go to start`;
      return (
        // moveはこのリストにおいて一意のものなのでkeyの値にできる
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{decs}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner: ${winner}`; 
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
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

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
