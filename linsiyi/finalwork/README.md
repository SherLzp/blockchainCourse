### 1.如何运行项目

- 配置好node.js,npm,yarn,ganache,metaMask插件

- 在ganache中搭建私有网络,端口为7545；

- 在metaMask中选择LocalHost7545，并用私钥把ganache得到的账户导入钱包；

- 用remix对contracts/donate.sol进行编译,再对钱包中的一个账号进行部署连接(Deploy)

- 点击Remix中的编译界面下的ABI进行复制,贴入到eth/donate.js中的ABI数据中

  ![image-20210116212441813](C:\Users\lin45\AppData\Roaming\Typora\typora-user-images\image-20210116212441813.png)

- 点击Remix部署界面中的合约地址进行复制,贴到eth/donate.js的address数据中

  ![image-20210116212717490](C:\Users\lin45\AppData\Roaming\Typora\typora-user-images\image-20210116212717490.png)

- 在主目录下输入,即可运行

```
yarn start
```



### 2.运行成功界面截图

- 主界面:全部众筹项目

![主界面](C:\Users\lin45\Desktop\主界面.jpg)



- 新建众筹项目

![新建众筹项目](C:\Users\lin45\Desktop\新建众筹项目.jpg)



- 对项目投资

![投资项目](C:\Users\lin45\Desktop\投资项目.jpg)



- 查看我投资的项目

![投资项目](C:\Users\lin45\Desktop\投资项目.jpg)



- 查看未完成的项目

![查看未完成的项目](C:\Users\lin45\Desktop\查看未完成的项目.jpg)



- 查看我创建的项目

![查看我创建的项目](C:\Users\lin45\Desktop\查看我创建的项目.jpg)



- 新增使用请求

![新增使用请求](C:\Users\lin45\Desktop\新增使用请求.jpg)



- 对资金的使用投票

![对资金使用进行投票](C:\Users\lin45\Desktop\对资金使用进行投票.jpg)



- 使用请求通过

![使用请求通过](C:\Users\lin45\Desktop\使用请求通过.jpg)



- 使用被拒绝

![请求被拒绝](C:\Users\lin45\Desktop\请求被拒绝.jpg)