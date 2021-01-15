import React from 'react';
import '../styles/launch.scss';
import { InputNumber } from 'antd';

let web3 = require('../backend/web3');
let contract = require('../backend/contract');

class Launch extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            contract: contract,
            money: 0,
            ddl: 1614524400000
        }
    }
    time2timestamp(s){
        let stamp = new Date(s);
        return stamp.getTime();
    }
    launch = async() => {
        let accounts = await web3.eth.getAccounts();
        console.log('ddl:', this.state.ddl);
        try {
            await contract.methods.launch(this.state.money, this.state.ddl).send({
                from: accounts[0],
                //value: web3.utils.toWei('0', 'ether'),
                gas: '3000000',
            })
            window.location.reload()
            this.setState({ isClicked: false })
            alert('success!');
        } catch (e) {
            console.log(e)
            this.setState({ isClicked: false })
            alert('failed!');
        }
    }

    num_input_change(value){
        this.setState({
            money: value
        });
    }

    ddl_input_change(event){
        this.setState({
            ddl: this.time2timestamp(event.target.value)
        });
    }

    render(){
        document.title = 'launch';
        return (
            <div className='launch'>
                <div className='need'>
                    need:
                    <InputNumber id='num-input' size='small' className='number-input' 
                        min={1} defaultValue={1}
                        onChange={(value)=>{
                            this.num_input_change(value);
                    }}/>
                </div>
                
                <div className='ddl'>
                    Deadline:
                    <input class='input' type='datetime-local' 
                        defaultValue="2021-02-28T23:59"
                        onChange={(event)=>{
                            this.ddl_input_change(event);
                    }}/>
                </div>

                <button class='button' onClick={this.launch}>
                    launch
                </button>
            </div>
        );
    }
}

export default Launch;