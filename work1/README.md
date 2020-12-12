# README

main.cpp包含了单条字符转换为SHA256与ProofOfWork的模拟实现过程。通过输入不同的指令，程序会给出相应结果。

## 使用指南

程序编译运行后，会给出引导语句：

> **Enter 1** to execute SHA256 algorithm for single string, and **enter P** to execute ProofOfWork.
> **Enter Q **to quit.

输入1并回车，则程序会给出提示：

> Please enter a single string, with 'Enter' in the end.

需要输入单条语句，并以回车结尾，程序会给出该条语句经SHA256算法的哈希值。

输入P并回车，则程序会给出提示：

> Please enter a string, and then give a number of 0. The process will give out the additionnal number(which is sequential from 1 to 2^64).

程序会提示需要两个参数：

> Please enter a single string, with 'Enter' in the end.

> Please enter the number of 0:

同样需要输入单条语句以回车结尾，随后程序会顺序的在该语句后加入附加值，范围从1到2^64。考虑到普通PC的一般性能，该程序仅支持不超过32位的前导零。



## Test Case 1

输入1，则执行单条字符的SHA256哈希值。

输出结果以粗体标出

> Enter 1 to execute SHA256 algorithm for single string, and enter P to execute ProofOfWork.
> Enter Q to quit.
> 1
> Please enter a single string, with 'Enter' in the end.
> Test 2020/12/11 3180103852
> **5bcb681f86a60fb5c0d1f28b37360b6d19d751789bbb4c923522f3eabbe147f9**
> Enter 1 to execute SHA256 algorithm for single string, and enter P to execute ProofOfWork.
> Enter Q to quit.
> 1
> Please enter a single string, with 'Enter' in the end.
> This is a bitcoin block header
> **65952adde8ff434965e18937fac71085e49298d352d690387e2d0b089db12d96**
> Enter 1 to execute SHA256 algorithm for single string, and enter P to execute ProofOfWork.
> Enter Q to quit.
> 1
> Please enter a single string, with 'Enter' in the end.
> How Are You? I am Fine, Thank you      
> **380ac24385e3a468a200db06f428d895ded27f6434fd8e1ab3b3313e9f72f195**
> Enter 1 to execute SHA256 algorithm for single string, and enter P to execute ProofOfWork.
> Enter Q to quit.
> Q

## Test Case 2

输入P，随后输入一条语句与要求的前导零个数（小于32位）。程序会给出满足条件的附加值与哈希值。

> Enter 1 to execute SHA256 algorithm for single string, and enter P to execute ProofOfWork.
> Enter Q to quit.
> P
> Please enter a string, and then give a number of 0. The process will give out the additionnal number(which is sequential from 1 to 2^64).
> Please enter a single string, with 'Enter' in the end.
> ==I am Satoshi Nakamoto==
> Please enter the number of 0 (no more than 32):==10==
> **The Result is: I am Satoshi Nakamoto266
> SHA256:003f0706e8284c32f8ae3102fd285c861840e114e0b2abeb63e1770b821cb7d5
> Addition number is: 266**
> Enter 1 to execute SHA256 algorithm for single string, and enter P to execute ProofOfWork.
> Enter Q to quit.
> P
> Please enter a string, and then give a number of 0. The process will give out the additionnal number(which is sequential from 1 to 2^64).
> Please enter a single string, with 'Enter' in the end.
> ==Blockchain is fun==
> Please enter the number of 0 (no more than 32):==20==
> **The Result is: Blockchain is fun671780
> SHA256:00000c6a785aa68155b1f4ee48ba1c97e5514011e7689286f611cca19ce47613
> Addition number is: 671780**
>
> Enter 1 to execute SHA256 algorithm for single string, and enter P to execute ProofOfWork.
> Enter Q to quit.
> P 
> Please enter a string, and then give a number of 0. The process will give out the additionnal number(which is sequential from 1 to 2^64).
> Please enter a single string, with 'Enter' in the end.
> ==Blockchain is fun==
> Please enter the number of 0 (no more than 32):==15==
> **The Result is: Blockchain is fun32379
> SHA256:0001515a212140fe263923d4c4103e2bb410c2a30e7d1df542e8d6fe2ef9f585
> Addition number is: 32379**
> Enter 1 to execute SHA256 algorithm for single string, and enter P to execute ProofOfWork.
> Enter Q to quit.
> P
> Please enter a string, and then give a number of 0. The process will give out the additionnal number(which is sequential from 1 to 2^64).
> Please enter a single string, with 'Enter' in the end.
> ==Test== 
> Please enter the number of 0 (no more than 32):==33==
> Error! The number should be no more than 32)

