import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  // stateの初期値をconstructorで定義
  constructor(props){
    // React.Componentクラスを継承しているのでsuperで親クラスのconstructorを呼んでやる必要がある
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      // 渡されたpropsからvalueを表示している
      // onClickでクリックされた時のイベントを定義
      // setStateでstateの値を更新する
      <button className="square" onClick={ () => this.setState({ value: 'X' }) }>
        {this.state.value}
      </button>
    );
  }
}

class Board extends React.Component {
  // ここで子のstateの状態を記録する
  constructor(props){
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  renderSquare(i) {
    // ここでprops として value という名前の値を Square に渡すようにしている
    return <Square value={i}/>;
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
