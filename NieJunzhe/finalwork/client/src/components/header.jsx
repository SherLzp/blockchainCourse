import React from 'react';
import { Input } from 'antd';
import {getAccount} from "../contracts/contract";

const { Search } = Input;
const onSearch = value => console.log(value);



async function handleClick() {
    let t = await getAccount();
    console.log(t)
}

class Header extends React.Component {


    render(){
        return (
            <div>
                <button onClick={handleClick}> get account </button>
            </div>
        );
    }
}
export default Header;