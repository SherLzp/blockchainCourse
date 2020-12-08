# 作业1 SHA256实现及作用说明

> Developer：李想
>
> 学号：3180103542
>
> 日期：2020/12/03
>
> 具体报告已发送至助教邮箱

## 实验环境和运行说明

* 语言：python 3.7.5
* IDE：VScode
* sha256.py文件直接运行即可即可。
* PoW.py, PoW_sum.py, Compare.py三个文件调用了sha256.py中的sha256函数，需要放在同一路径下运行该目录下。其中Compare.py同一路径下需包含对比的1.txt和2.txt

## 文件说明和运行样例

> 详细的多角度测试放在报告中了，这里仅展示样例输入测试

### sha256.py

实现SHA256算法

![sha256](C:\Users\14262\Desktop\大三上\区块链\blockchainCourse\LiXiang\work1\asset\sha256.png)

### PoW.py

实现简易工作量证明机制

![PoW](C:\Users\14262\Desktop\大三上\区块链\blockchainCourse\LiXiang\work1\asset\PoW.png)

### PoW_sum.py

工作量证明机制简单变式，用于说明SHA256算法性质及其在区块链和PoW中的作用

![PoW_sum](C:\Users\14262\Desktop\大三上\区块链\blockchainCourse\LiXiang\work1\asset\PoW_sum.png)

### Compare.py

用于证明SHA256在Merkle树中的快速比较文件功能

算法举例对比了1.txt和2.txt两个大文件中的内容（上传的两文件内容不一致）

![](C:\Users\14262\Desktop\大三上\区块链\blockchainCourse\LiXiang\work1\asset\Compare.png)

