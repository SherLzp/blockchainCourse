import React from 'react';
import '../styles/index.scss';

class Index extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }
    go2_launch(){
        window.location.href = '/launch';
    }
    go2_view(){
        window.location.href = '/view';
    }
    go2_myfunds(){
        window.location.href = '/myfunds';
    }
    go2_mylaunchs(){
        window.location.href = '/mylaunchs';
    }
    render(){
        document.title = 'crowdfunding';
        return (
            <div className='index'>
                <button class='button' 
                onClick={this.go2_launch}>
                    launch
                </button>

                <button class='button'
                onClick={this.go2_view}>
                    view
                </button>

                <button class='button'
                onClick={this.go2_myfunds}>
                    my funds
                </button>

                <button class='button'
                onClick={this.go2_mylaunchs}>
                    my launchs
                </button>
                
                <div>Crowdfunding</div>
            </div>
        )
    }
}

export default Index;