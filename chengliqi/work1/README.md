<div align ="center">
    <h1>
        区块链与数字货币作业一：
    </h1>
</div>

<div align ="center">
    <h2>
        SHA256算法实现及其在区块链中作用
    </h2>
</div>

<div align ="center">
    <h2>
        程礼棋 3180102634
    </h2>
</div>

<div align ="center">
    <h3>
        2020/12/07
    </h3>
</div>            

**实验环境：Python3.6+Pycharm**

1. 用python语言完成了**自己的sha256**，可以**对任意长度、任意可识别符号（中文、英文、数字等）进行hash散列加密**。并利用了python自带的sha256算法进行检验正确性。

2. 设计**实验一**，比较两个大文件是否相同，利用sha256散列加密后比较和常规字符串比较，对比两者速率，发现sha256对于检测数据是否相同有显著性能提高的作用，且由于尚未发现碰撞，正确性也有保证。

3. 设计**实验二**，完成了自己的小型区块链，仅完成了每个块区块头的信息传递，利用上一块的hash值带入下一块继续计算，证明区块链的保密性和对于信息的难修改性，利用sha256算法来计算链，使得链长越长，该链的交易数据越值得信任，正确性越强，**验证了SHA256在区块数据中的锁定作用**

4. 设计**实验三**，完善了自己的小型区块链，**验证了SHA256在PoW中的作用**

 



 