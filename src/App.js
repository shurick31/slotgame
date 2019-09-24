import React from 'react';
import GenerateImage from './components/GenerateImage';
import Spinner from './components/Spinner';

import './App.css';


const RepeatButton = (props) => {
  return (
    <button
      id='repeatButton'
      onClick={props.onClick}>
      Press to play!
        </button>
  );
}



const WinSpan = (props) => {
  const { amount } = props;
  return (
    <span className="win-amount">
      {amount}
    </span>
  );
}



export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      winner: null,
      balance: 0,
      debugMode: false,
      enterValue: 0,
      showDebug: false
    }
    this.finishHandler = this.finishHandler.bind(this)
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ winner: null, balance: this.state.balance - 1, winLines: null, win: null });
    this.emptyArray();
    this._child1.forceUpdateHandler();
    this._child2.forceUpdateHandler();
    this._child3.forceUpdateHandler();
  }


  static matches = [];

  compareArrays = (arr1, arr2) => {
    let result = false;
    if (arr1.length !== arr2.length) {
      return result;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      } else {
        result = true;
      }

    }
    return result;
  }

  finishHandler = (value) => {
    Dashboard.matches.push(value);



    if (Dashboard.matches.length === 3) {

      const first = Dashboard.matches[0];
      let results = Dashboard.matches.every(match => match === first)
      let firstLine = [];
      let secondLine = [];
      let thirdLine = [];
      let imgHeight = 121;
      for (let i = 1; i < 4; i++) {
        let symbol = this.state['array_' + (i)].find(e => e.posy === Math.abs(Dashboard.matches[i - 1]));
        firstLine.push(symbol.image);
        let next = Math.abs(Dashboard.matches[i - 1]) === imgHeight * 4 ? 0 : Math.abs(Dashboard.matches[i - 1]) + imgHeight;
        symbol = this.state['array_' + (i)].find(e => e.posy === next);
        secondLine.push(symbol.image);
        next = next === imgHeight * 4 ? 0 : next + imgHeight;
        symbol = this.state['array_' + (i)].find(e => e.posy === next);
        thirdLine.push(symbol.image);

      }

      this.setState({ firstLine, secondLine, thirdLine }, () => {
        this.resolveWin();
      });
    }
  }

  resolveCherries = (icon) => {
    const { firstLine, secondLine, thirdLine } = this.state;
    //const wins = [2000, 1000, 4000];
    const wins = {
      'Cherry.png': [2000, 1000, 4000],
      '3xBAR.png': [50, 50, 50],
      '2xBAR.png': [20, 20, 20],
      'BAR.png': [10, 10, 10],
      '7.png': [150, 150, 150]
    }
    const winIcons = [icon, icon, icon];

    // using return winning lines to avoid use async setState
    if (this.compareArrays(winIcons, firstLine)) {
      return { win: wins[icon][0], line: 'firstLine' };
    }
    if (this.compareArrays(winIcons, secondLine)) {
      return { win: wins[icon][1], line: 'secondLine' };
    }
    if (this.compareArrays(winIcons, thirdLine)) {
      return { win: wins[icon][2], line: 'thirdLine' };
    }
    return false;
  }

  resolveCherryMix = (lines) => {

    let tmpWin = 0;
    let winCost = 75;
    let winLines = [];
    let allowedIcons = ['Cherry.png', '7.png'];
    for (let line of lines) {
      let matched = 0;
      for (let icon of this.state[line]) {
        if (allowedIcons.indexOf(icon) > -1) {
          matched++
        }
      }
      if (matched === 3) {
        tmpWin += winCost;
        matched = 0;
        winLines.push(line);
      }
    }
    if (tmpWin > 0) {
      return { win: tmpWin, line: winLines };
    } else {
      return null;
    }

  }

  resolveBars = (lines) => {
    // means that is not one of 3 3xBAR or 3 2xBAR or 3 BAR 
    // they're reolved before
    let tmpWin = 0;
    let winLines = [];
    for (let line of lines) {
      let matched = 0;
      for (let sym of this.state[line]) {
        if (sym.indexOf('BAR') > -1) {
          matched++;
        }
      }
      if (matched === 3) {
        tmpWin += 5;
        matched = 0;
        winLines.push(line);
      }
    }

    //return tmpWin;
    if (tmpWin > 0) {
      return { win: tmpWin, line: winLines };
    } else {
      return null;
    }

  }

  resolveWin = () => {

    const lines = ['firstLine', 'secondLine', 'thirdLine'];
    // to collect full lines to avoid check them again
    let winLines = [];
    let winning = 0;

    // cherries first
    let wins = this.resolveCherries('Cherry.png');
    if (wins) {
      winning += wins.win;
      winLines.push(wins.line);
    }
    wins = this.resolveCherries('7.png');

    if (wins) {
      winning += wins.win;
      winLines.push(wins.line);
    }

    wins = this.resolveCherries('3xBAR.png');
    if (wins) {
      winning += wins.win;
      winLines.push(wins.line);
    }

    wins = this.resolveCherries('2xBAR.png');
    if (wins) {
      winning += wins.win;
      winLines.push(wins.line);
    }
    wins = this.resolveCherries('BAR.png');
    if (wins) {
      winning += wins.win;
      winLines.push(wins.line);
    }

    let notWins = lines.filter(x => !winLines.includes(x));
    let mixWins = this.resolveCherryMix(notWins);
    if (mixWins) {
      winLines = winLines.concat(mixWins.line);
      winning += mixWins.win;
    }
    let barWins = this.resolveBars(notWins);
    if (barWins) {
      winLines = winLines.concat(barWins.line);
      winning += barWins.win;
    }

    // other combos

    this.setState({ balance: this.state.balance + winning, win: winning, winLines }, () => {
      this.timeout = setTimeout(() => {
        this.setState({ win: null }, () => { clearTimeout(this.timeout) });
      }, 3000);
    });
  }



  emptyArray() {
    Dashboard.matches = [];
  }


  getImage = (img, idx, combo) => {
    this.setState({
      ['image_' + idx]: img,
      ['array_' + idx]: combo,
    })
  }

  setBalance = () => {

    if (this.state.enterValue) {
      this.setState({
        balance: +this.state.balance + +this.state.enterValue,
        enterValue: 0
      });
    }
  }

  toggleDebugPanel = () => {
    this.setState({ showDebug: !this.state.showDebug });
  }

  changeInput = (e) => {
    this.setState({ enterValue: e.target.value });
  }

  switchDebugMode = (e) => {
    this.setState({
      debugMode: !this.state.debugMode,
      debugIcon: null,
      debugPosition: null
    });
  }

  debugSelect = (event, name) => {
    if (name === 'Icon') {
      if (event.target.value) {
        let debugIconsPos = [];
        debugIconsPos.push(-this.state.array_1.find(e => e.image === event.target.value).posy);
        debugIconsPos.push(-this.state.array_2.find(e => e.image === event.target.value).posy);
        debugIconsPos.push(-this.state.array_3.find(e => e.image === event.target.value).posy);
        this.setState({
          ['debug' + name]: event.target.value,
          debugIconsPos: debugIconsPos
        });
      } else {
        this.setState({
          ['debug' + name]: event.target.value,
          debugIconsPos: null
        });
      }

    } else {

    }
    this.setState({
      ['debug' + name]: event.target.value
    });
  }

  render() {

    const { balance } = this.state;
    let balanceColor = '#9f0';
    if (balance < 10) {
      balanceColor = '#f90';
    }
    if (balance < 5) {
      balanceColor = '#f55';
    }
    let checked = '';
    if (this.state.debugMode) {
      checked = ' checked';
    }
    let debugRules = null;
    if (this.state.debugMode && this.state.debugPosition && this.state.debugIconsPos) {
      debugRules = {
        pos: this.state.debugPosition,
        icon: this.state.debugIconsPos,
      }
    }

    let debugPanelClassName = "debug-panel";
    if (!this.state.showDebug) {
      debugPanelClassName += " hidden";
    }

    if (this.state.winLines) {
      for (let line of this.state.winLines) {

      }
    }
    return (
      <div>

        <div style={{ display: 'flex' }}>
          <GenerateImage reel={1} getImage={this.getImage} />
          <GenerateImage reel={2} getImage={this.getImage} />
          <GenerateImage reel={3} getImage={this.getImage} />
        </div>


        <div>
          <div className="balance-container">
            <h3>Your balance: <span style={{ color: balanceColor }}>{this.state.balance}</span>
              <span className="no-credits">{this.state.balance === 0 ?
                'Please enter some amount of credits to start!' :
                null}</span>

              {this.state.win ? <WinSpan amount={this.state.win} /> : null}
            </h3>

            <div className="input-container">
              <input
                type="text"
                onChange={this.changeInput}
                value={this.state.enterValue} />
              <button onClick={this.setBalance}>
                Pay
              </button>
            </div>
          </div>
        </div>





        {this.state.image_3 ?
          <div className="spinner-container">

            <Spinner onFinish={this.finishHandler} ref={(child) => { this._child1 = child; }} timer="1000" image={this.state.image_1} balance={this.state.balance} debug={debugRules} reel={0} />
            <Spinner onFinish={this.finishHandler} ref={(child) => { this._child2 = child; }} timer="1400" image={this.state.image_2} balance={this.state.balance} debug={debugRules} reel={1} />
            <Spinner onFinish={this.finishHandler} ref={(child) => { this._child3 = child; }} timer="2200" image={this.state.image_3} balance={this.state.balance} debug={debugRules} reel={2} />
            <div className="gradient-fade"></div>
            {this.state.winLines && this.state.winLines.indexOf('firstLine') > -1 ?
              <div className="first-line-win"></div> : null
            }

            {this.state.winLines && this.state.winLines.indexOf('secondLine') > -1 ?
              <div className="second-line-win"></div> : null
            }
            {this.state.winLines && this.state.winLines.indexOf('thirdLine') > -1 ?
              <div className="third-line-win"></div> : null
            }
          </div> : null}

        {this.state.balance > 0 ?
          <div className="spinner-button">
            <RepeatButton onClick={this.handleClick} />
          </div>
          : null}
        <div className="debug-header" onClick={this.toggleDebugPanel}>
          Show debug panel  {this.state.showDebug ? <span className="chevron top"></span> : <span className="chevron bottom"></span>}
        </div>
        <div className={debugPanelClassName}>
          <div className="d-flex row">
            <label htmlFor="debug-checker">Enable debug mode</label>
            <input type="checkbox" value={this.state.debugMode} onChange={this.switchDebugMode} />
          </div>
          {this.state.debugMode ?
            <React.Fragment>
              <label htmlFor="debug-selector-icon">Select Icon</label>
              <select id="debug-selector-icon" onChange={(e) => this.debugSelect(e, 'Icon')} value={this.state.debugIcon || ''}>
                <option value="">---</option>
                <option value="7.png">7</option>
                <option value="Cherry.png">Cherry</option>
                <option value="BAR.png">BAR</option>
                <option value="2xBAR.png">2XBAR</option>
                <option value="3xBAR.npm">3xBAR</option>
              </select>
              <label htmlFor="debug-selector-position">Select Position</label>
              <select id="debug-selector-position" onChange={(e) => this.debugSelect(e, 'Position')} value={this.state.debugPosition || ''}>
                <option value="">---</option>
                <option value="1">Top</option>
                <option value="2">Middle</option>
                <option value="3">Bottom</option>
              </select>
            </React.Fragment> : null}
        </div>
      </div>
    );
  }
}



