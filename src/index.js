import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 自身でstateの管理をしなくなったので関数コンポーネントとして定義
function Square(props) {
  return (
    // onClickでクリックされた時のイベントを定義
    // クリックされた時に親のonClickを呼び出すようにする
    <button
      className={
        props.isHighlight ? `square highlight-color` : `square`
        }
      onClick={props.onClick}
    >
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
              // 渡って来た配列（勝ちに判定がでたline）に i が含まれているかどうか
              isHighlight={ this.props.winLine.includes(i) }
              key={i}
            />;
  }
render() {
  // 一辺が何マスの盤面を作るか
  const boardSideLength = 3;
  // boardSideLengthから盤面のsquareの数を出して0から始まる配列にする
  const boardSquares = [...Array(boardSideLength ** 2).keys()];
  // 配列からrowごとのまとまりを作る
  const boardSquaresList = boardSquares.reduce((square, i) => {
    const lastSquare = square[square.length - 1];
    if (lastSquare.length === boardSideLength) {
      square.push([i]);
      return square;
    }
    lastSquare.push(i);
    return square;
  }, [[]]);
  return (
    <div>
      { 
        boardSquaresList.map((rowSquares, i) => {
          return(
            <div className="board-row" key={i}>
              {
                rowSquares.map((square) =>{
                  return(
                    this.renderSquare(square)
                  )
                })
              }
            </div>
          )
        })
      }
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
      isAsc: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // calculateWinnerの結果もしくはsquares[i]があれば以降の処理は行わない（クリックしても反応しない）
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

  handleOrder() {
    this.setState({
      isAsc: !this.state.isAsc,
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
    const winnerInfo = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      // moveがない場合はGo to startを表示する
      const item = move ?
        `Go to move #${move}（col: ${step.col}, row: ${step.row}）`:
        `Go to start`;
      return (
        // moveはこのリストにおいて一意のものなのでkeyの値にできる
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            { move === this.state.stepNumber ? <strong>{item}</strong> : item }
          </button>
        </li>
      );
    });

    let status;
    let winLine = [];
    if (winnerInfo === null) {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    } else if (winnerInfo === 'draw') {
      status = `Draw`; 
    } else {
      status = `Winner: ${winnerInfo.player}`; 
      winLine = winnerInfo.line;
    }

    const orderBottun = this.state.isAsc ? '↑OLD NEW↓' : '↑NEW OLD↓';
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            // 勝ち判定が出た場合勝ちにつながったlineが配列ではいる
            winLine={winLine}
      />

        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button onClick={() => this.handleOrder()}>
              {orderBottun}
            </button>
          </div>
          <ol>
            { this.state.isAsc ? moves : moves.reverse() }
          </ol>
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
      // 勝ったプレイヤーと勝ちにつながったラインをreturnする
      return { player: squares[a], line: [a, b, c] };
    }
  }
  // ここでDraw判定
  if (!squares.includes(null)) {
    return 'draw';
  }
  return null;
}
