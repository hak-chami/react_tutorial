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
  // ここで子のstateの状態を記録する
  constructor(props){
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  handleClick(i){
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({ squares: squares });
  }

  renderSquare(i) {
    // ここでprops として 自分のstateのsquearesで子のstateを管理する
    // SquareにはvalueとonClickをpropsとして渡している
    return <Square
              value={ this.state.squares[i] }
              // onClickが呼ばれた時にhandleClickという関数を呼び出す
              onClick={ () => this.handleClick(i) }
            />;
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
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
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
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
