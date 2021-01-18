import React from 'react';

const Navbar = ({ account }) => {
    return (
        <nav className="navbar navbar-dark bg-dark shadow mb-5">
        <p className="navbar-brand my-auto">去中心化众筹DAPP</p>
        <ul className="navbar-nav">
          <li className="nav-item text-white">当前用户地址 : {account} </li>
        </ul>
      </nav>
    )
}
export default Navbar