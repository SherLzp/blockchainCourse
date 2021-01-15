import React from 'react';
import '../styles/mylaunchs.scss';
import { InputNumber } from 'antd';

let web3 = require('../backend/web3');
let contract = require('../backend/contract');

class MyLaunchs extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            indices: [],
            my_lchs: [],
            moneys: []
        }
    }
    get_mylaunchs = async() => {
        let accounts = await web3.eth.getAccounts();
        try{
            let num = await contract.methods.userLaunchsLen(accounts[0]).call();
            console.log(num);    
            let indices = [];
            for(let i=0; i<num; i++){
                let index = await contract.methods.userLaunchs(accounts[0], i).call();
                indices.push(index);
            }
            let prods = [];
            for(let i=0; i<num; i++){
                let p = await contract.methods.products(indices[i]).call();
                prods.push(p);
            }
            console.log('launchs', prods);
            this.setState({
                indices: indices,
                my_lchs: prods
            })
        }catch(e){

        }
    }
    request_use = async(index, money) => {
        money = parseInt(money);
        if(typeof(money) != typeof(1)){
            money = 1;
        }
        let accounts = await web3.eth.getAccounts();
        try {
            await contract.methods.request_use(index, money).send({
                from: accounts[0],
                //value: web3.utils.toWei(String(money), 'ether'),
                gas: '3000000',
            })
            window.location.reload()
            this.setState({ isClicked: false })
            alert('request success!');
        } catch (e) {
            console.log(e)
            this.setState({ isClicked: false })
            alert('failed!');
        }
    }

    num_input_change(index, value){
        let arr = this.state.moneys;
        arr[index] = value;
        this.setState({
            moneys: arr
        });
    }
    show(){
        console.log('show mylaunchs');
        return(
            <div className='launchs'>
                total: {this.state.my_lchs.length}
                {this.state.my_lchs.map((item, index)=>{
                    return (
                        <div className='launch' key={index}>
                            <div className='info'>
                                <div>product: {this.state.indices[index]} </div>
                                <div>goal: {item[1]} </div>
                                <div>current: {item[2]} </div>
                                {item['finished'] && <div>finished</div>}
                                {item['finished']===false && <div>unfinished</div>}
                            </div>
                            
                            {item['finished'] &&
                            <div className='req'>
                                <button className='btn-req' 
                                onClick={()=>{
                                    this.request_use(this.state.indices[index], this.state.moneys[index]);
                                }}>
                                    request use
                                </button>

                                <InputNumber id='num-input' size='small' className='number-input' 
                                min={1} max={item[2]} defaultValue={1}
                                onChange={(value)=>{
                                    this.num_input_change(index, value);
                                }}/>
                            </div>}
                        </div>
                    )
                })}
            </div>
        )
    }
    render(){
        return(
            <div className='mylaunchs'>
                <button onClick={this.get_mylaunchs}>my lanuchs</button>
                {this.show()}
            </div>
        );
    }
}

export default MyLaunchs;