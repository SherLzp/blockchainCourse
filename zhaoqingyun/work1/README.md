## README

### SHA256

sha256.cpp是SHA256算法，输入一段内容会输出这段内容的hash值，代码中限制了最大输入内容不超过10000字节，但算法实际上是可以输入无限长字符的

<img src="C:\Users\Dell\Desktop\blockchainCourse\zhaoqingyun\work1\asset\image-20201208004214403.png" alt="image-20201208004214403" style="zoom:67%;" />



### 实验一

chain.cpp是实验说明SHA256如何用于区块数据锁定，不打开140行的注释前是修改前的模拟区块链内容，打开注释后是对某一块内容进行微小修改后区块链的内容，通过对比可以发现SHA256对微小改动做出的反应

<img src="C:\Users\Dell\Desktop\blockchainCourse\zhaoqingyun\work1\asset\image-20201208003116194.png" alt="image-20201208003116194" style="zoom:67%;" />

对数据做出修改之前的区块链内容如下：

![image-20201208004401167](C:\Users\Dell\Desktop\blockchainCourse\zhaoqingyun\work1\asset\image-20201208004401167.png)

修改之后的区块链内容出现了巨大的变化：

![image-20201208004424943](C:\Users\Dell\Desktop\blockchainCourse\zhaoqingyun\work1\asset\image-20201208004424943.png)



### 实验二

pow.cpp是实验模拟PoW工作过程，通过修改122行的条件可以控制前置共有多少位0，本实验由于电脑性能原因设置为前6位0，可以在较快时间得到结果

<img src="C:\Users\Dell\Desktop\blockchainCourse\zhaoqingyun\work1\asset\image-20201208003417460.png" alt="image-20201208003417460" style="zoom:67%;" />

实验几次结果，均能在较快时间内找到前6位为0的结果，改为8位后仅仅通过一轮循环已经无法得到结果

<img src="C:\Users\Dell\Desktop\blockchainCourse\zhaoqingyun\work1\asset\image-20201208004514420.png" alt="image-20201208004514420" style="zoom:67%;" />

<img src="C:\Users\Dell\Desktop\blockchainCourse\zhaoqingyun\work1\asset\image-20201208004533482.png" alt="image-20201208004533482" style="zoom:67%;" />

以上三个文件的.exe文件可以直接运行





