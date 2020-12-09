# 运行说明

使用python sha256.py即可，想要测试自己输入，请修改 if\__name__ == '\_\_main__'下的内容 

目前只支持字节流的hash运算，不支持bit流的hash运算

aaa.py 是个简单产生长字符串的代码，aaa.txt是输出

# 测试结果

##### 在线测试结果

![network_1](assests\network_1.png)

##### 自己结果

![me_1](assests\me_1.png)

##### 在线测试结果

![network_2](assests\network_2.png)

##### 自己结果

![me_2](assests\me_2.png)

##### 长字符串测试

![](assests\long_string)

![image-20201209155157234](assests\network_long.png)

由于SHA256很难碰撞，所以在三次试验后可以确定代码正确无误。

更换网站测试是因为前一个网站使用js在线测试，复制长字符串结果不正确

