import React, { createRef } from "react";
import { WrapperState } from '../../interfaces/index';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../store';
import { 
    incrementBreakLength, 
    decrementBreakLength, 
    incrementSessionLength,
    decrementSessionLength,
    setSessionLength, 
    setBreakLength,
    setMinutes,
    setSeconds,
} from '../../store/clockSlice';
import './Wrapper.scss';
import beeb from '../../assets/beep.mp3';
import { flushSync } from "react-dom";
// Props from Redux store and actions
const mapState = (state: RootState) => ({
    breakLength: state.clock.breakLength,
    sessionLength: state.clock.sessionLength,
    minutes: state.clock.minutes,
    seconds: state.clock.seconds
  });
  
  const mapDispatch = {
    incrementBreakLength,
    decrementBreakLength,
    incrementSessionLength,
    decrementSessionLength,
    setBreakLength,
    setSessionLength,
    setMinutes,
    setSeconds
  };
  
  // Create connector
  const connector = connect(mapState, mapDispatch);
  
  // Define props type using `ConnectedProps`
  type PropsFromRedux = ConnectedProps<typeof connector>;
  type WrapperProps = PropsFromRedux & {
    breakLength?: number,
    sessionLength?: number,
  };

class Wrapper extends React.Component<WrapperProps,WrapperState> {
    audio:any;

    constructor(props:WrapperProps){
        super(props);
        this.state = {
            mode: true,
            interval: undefined,
            break: false
        }
        this.audio = createRef();
    }

    componentDidMount() {
        if (this.props.breakLength! !== undefined) {
          this.props.setBreakLength(this.props.breakLength!);
        }
        if (this.props.sessionLength! !== undefined) {
            this.props.setSessionLength(this.props.sessionLength!);
            this.props.setMinutes(this.props.sessionLength!);
        }
    }

    handleBreakLength = (type:string) => {
        if(this.state.interval === undefined && this.state.mode === true){
            const { incrementBreakLength,decrementBreakLength } = this.props;
            if(type == 'inc')
                incrementBreakLength();
            else decrementBreakLength();
        }
    }

    handleSessionLength = (type:string) => {
        if(this.state.interval === undefined && this.state.mode === true){
            const { incrementSessionLength,decrementSessionLength } = this.props;
            if(type == 'inc')
                incrementSessionLength();
            else decrementSessionLength();  
        }  
    }

    handleStopPause = () =>{
        this.setState({mode: !this.state.mode});
        if(this.state.mode === true && this.state.interval === undefined ) {
            this.setState({
                interval : setInterval(()=>{       
                              
                if(this.props.seconds === 0 && this.props.minutes === 0){
                    if(this.state.break == false){
                        flushSync(()=>{this.setState({break: !this.state.break})});
                        this.audio.current.currentTime = 0;
                        this.audio.current.play();           
                        this.props.setMinutes(this.props.breakLength);
                        this.props.setSeconds(0);
                    }
                    else {
                        flushSync(()=>{this.setState({break: !this.state.break})});
                        this.audio.current.currentTime = 0;
                        this.audio.current.play();     
                        this.props.setMinutes(this.props.sessionLength);
                        this.props.setSeconds(0);
                    }
                    return;
                }
                else if(this.props.seconds === 0 ){
                    this.props.setMinutes(this.props.minutes-1);
                    this.props.setSeconds(59);
                }
                else {
                    this.props.setMinutes(this.props.minutes);
                    this.props.setSeconds(this.props.seconds-1);
                }
            },1000)});
        }
        else {
            clearInterval(this.state.interval)
            this.setState({interval : undefined});
        };
    }

    handleReset = () => {
        clearInterval(this.state.interval);
        this.audio.current.currentTime = 0;
        this.audio.current.pause(); 
        this.setState({
            mode: true,
            interval: undefined,
            break: false
        });
        this.props.setBreakLength(5);
        this.props.setSessionLength(25);
        this.props.setMinutes(25);
        this.props.setSeconds(0);
    }

    render() { 
        const { breakLength,sessionLength,minutes,seconds  } = this.props;

        return ( 
            <main className="main-wrapper">
                <div className="row">
                    <div className="break-label-container">
                        <p id="break-label">Break Length</p>
                        <div className="row">
                            <span id="break-decrement" onClick={()=>this.handleBreakLength('dec')}>-</span>
                            <p id="break-length">{breakLength}</p>
                            <span id="break-increment" onClick={()=>this.handleBreakLength('inc')}>+</span>
                        </div>
                    </div>
                    <div className="session-label-container">
                        <p id="session-label">Session Length</p>
                        <div className="row">
                            <span id="session-decrement" onClick={()=>this.handleSessionLength('dec')}>-</span>
                            <p id="session-length">{sessionLength}</p>
                            <span id="session-increment" onClick={()=>this.handleSessionLength('inc')}>+</span>
                        </div>
                    </div>
                </div>
             
                <div className={this.state.break == false ? 'timer session' : 'timer break'}>
                    <div id="timer-label">
                        <p>{this.state.break == false ? 'Session' : 'Break'}</p>
                    </div>
                    <div id="time-left">
                        <p>{String(minutes).length === 1 ? '0'+minutes : minutes}:{String(seconds).length === 1 ? '0'+seconds : seconds}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="start-stop-btn">
                        <button id="start_stop" onClick={this.handleStopPause}>Start/Stop</button>
                    </div>
                    <div className="reset-btn">
                        <button id="reset" onClick={this.handleReset}>Reset</button>
                    </div>
                </div>
                <audio ref={this.audio} id="beep" src={beeb}></audio>
            </main>
         );
    }
}
 
export default connector(Wrapper);