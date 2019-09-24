import React from 'react';
import './../App.css';

export default class Spinner extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            reel: props.reel,
            balance: props.balance,
            debug: props.debug || false,
        }
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    };

    forceUpdateHandler() {
        this.reset();
    };

    reset() {
        if (this.timer) {
            clearInterval(this.timer);
        }

        this.start = this.setStartPosition();

        this.setState({
            position: this.start,
            timeRemaining: this.props.timer
        });

        this.timer = setInterval(() => {
            this.tick()
        }, 100);
    }

    state = {
        position: 0,
        lastPosition: null
    }
    static iconHeight = 121;
    multiplier = Math.floor(Math.random() * (4 - 1) + 1);

    start = this.setStartPosition();
    speed = Spinner.iconHeight * this.multiplier;
    timer = null;
    setStartPosition() {
        return ((Math.floor((Math.random() * 5))) * Spinner.iconHeight) * -1;
    }

    moveBackground() {
        let position = this.state.position - this.speed;
        let timeRemaining = this.state.timeRemaining - 100;

        if (this.state.debug && timeRemaining === 0) {
            let newPos = 0;
            let required = this.state.debug.icon[this.state.reel];
            if (this.state.debug.pos === "1") {
                newPos = required;
            } else if (this.state.debug.pos === "2") {
                if (required === 0) {
                    newPos = (121 * 4) * -1;
                } else {
                    newPos = required + 121;
                }
            } else if (this.state.debug.pos === "3") {
                if (required === 0) {
                    newPos = (121 * 3) * -1;
                } else if (Math.abs(required) === 121) {
                    newPos = (121 * 2) * -1;
                } else {
                    newPos = required + 242;
                }
            }

            this.setState({
                position: newPos,
                timeRemaining
            })
        } else {
            this.setState({
                position,
                timeRemaining
            })
        }

    }

    getSymbolFromPosition() {
        let { position } = this.state;
        if (this.state.debug) {
            this.props.onFinish(position);
            return false;
        }
        const totalSymbols = 5;
        const maxPosition = (Spinner.iconHeight * (totalSymbols - 1) * -1);
        let moved = (this.props.timer / 100) * this.multiplier
        let startPosition = this.start;
        let currentPosition = startPosition;

        for (let i = 0; i < moved; i++) {
            currentPosition -= Spinner.iconHeight;

            if (currentPosition < maxPosition) {
                currentPosition = 0;
            }
        }

        this.props.onFinish(currentPosition);
    }



    tick() {
        if (this.state.timeRemaining <= 0) {
            clearInterval(this.timer);
            this.getSymbolFromPosition();

        } else {
            this.moveBackground();
        }
    }

    componentDidMount() {
        clearInterval(this.timer);

        if (this.props.balance) {
            this.setState({
                position: this.start,
                timeRemaining: this.props.timer
            });

            this.timer = setInterval(() => {
                this.tick()
            }, 100);
        }

    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.debug) {
            this.setState({ debug: nextProps.debug });
        } else {
            this.setState({ debug: false });
        }
    }

    render() {
        let { position } = this.state;

        return (
            <div
                style={{
                    backgroundPosition: '0px ' + position + 'px',
                    background: '#fff url(' + this.props.image + ')'
                }}
                className={`reel`}

            />
        )
    }
}
