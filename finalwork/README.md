# 众筹合约 康大凯 3180105501

## 如何运行项目

1. 下载Ganache并创建workspace并按下图配置![image-20210108143641203](./image/image1_1.png)

2. 下载并解压源代码，cmd打开，npm install

3. 将contract文件夹下的CrowdFunding.sol文件的内容复制，在remix中编译部署合约到本地（编译器版本选择0.6.12，并勾选Enable optimization，MetaMask连接到本地测试网络）![image-20210108144614471](./image/image1_4.png)

   <img src="./image/image1_6.png" alt="image-20210108145128354" style="zoom:50%;" />

4. 将部署后生成的合约地址，复制到eth文件下的CrowdFunding.js文件中的第542行处<img src="./image/image1_2.png" alt="image-20210108144155922" style="zoom:80%;" />![image-20210108144311816](./image/image1_3.png)

5. 在命令行输入yarn start，若报错则按提示安装相应的包![image-20210108144845231](./image/image1_5.png)

6. 在Chrome浏览器输入 localhost:3000

   ![image-20210108145249386](./image/image1_7.png)

## 系统运行截图

##### 用户A发起众筹

![image-20210108145635679](./image/image2_1.png)

##### 发起的众筹可在首页查看

![image-20210108145712688](./image/image2_2.png)

##### 用户A投资给该项目2 ETH

![image-20210108145930750](./image/image2_3.png)

页面刷新，已筹集金额发生变化

![image-20210108145958020](./image/image2_4.png)

##### 用户B投资给该项目3 ETH后，用户A查看项目详情

项目详情中有投资人及其投资金额的列表，而此时该项目已经集资完毕，投资按钮失效

![image-20210108150250168](./image/image2_5.png)

##### 显示过期众筹项目

过期项目无法投资（截图时间为2021/1/8 15:09）

![image-20210108150923553](./image/image2_6.png)

##### 用户A查看自己发起和投资的众筹项目

![image-20210108151352041](./image/image2_7.png)

##### 用户A作为项目发起者，对集资成功项目发起一个资金使用请求

![image-20210108151509493](./image/image2_8.png)

##### 用户A查看自己创建的项目的请求列表

![image-20210108160152201](./image/image2_9.png)

##### 用户A查看自己投资的项目的请求列表

投票按钮处显示投资人所持有的票数，最少票数为请求通过所需要的最少票数。

![image-20210108160521173](./image/image2_10.png)

##### 用户A给请求投支持票

![image-20210108160711369](./image/image2_11.png)

票数刷新![image-20210108160735778](./image/image2_12.png)

##### 用户B给请求投支持票![image-20210108160812949](./image/image2_13.png)

超过最小票数，请求状态更新为已通过

![image-20210108160910876](./image/image2_14.png)

##### 用户B给请求投反对票

![image-20210108161224125](./image/image2_15.png)

票数已无法达到最少票数，请求状态更新为未通过

![image-20210108161239478](./image/image2_16.png)