README

3180106177 程诗卓

运行步骤：

1. 部署链
2. 修改众筹管理器地址
3. 在crowdfund 目录下 yarn start运行



## 1	Chain Deploy

- Open Ganache, create new workspace
 ![image-20210114174657130](C:\Users\Eternal\AppData\Roaming\Typora\typora-user-images\image-20210114174657130.png)
- Add project by truffle_config.js, rest as default

![image-20210114175318362](C:\Users\Eternal\AppData\Roaming\Typora\typora-user-images\image-20210114175318362.png)

- modify the truffle-config.js

  ![image-20210114175235086](C:\Users\Eternal\AppData\Roaming\Typora\typora-user-images\image-20210114175235086.png)

- compile and migrate

~~~
truffle compile
truffle migrate
~~~



![image-20210114175433801](C:\Users\Eternal\AppData\Roaming\Typora\typora-user-images\image-20210114175433801.png)

## 2	Configure

- Open  Ganache and find the contract deployed. Copy the address

![image-20210114175914962](C:\Users\Eternal\AppData\Roaming\Typora\typora-user-images\image-20210114175914962.png)

- Open ```crowdfund\src\App.js``` and modify managerAddr to the address

  ![image-20210114180333285](C:\Users\Eternal\AppData\Roaming\Typora\typora-user-images\image-20210114180333285.png)

- copy the ```Funding.json``` and ```FundManager.json``` to ```./crowdfund/src``` 
 ![image-20210114180145952](C:\Users\Eternal\AppData\Roaming\Typora\typora-user-images\image-20210114180145952.png)

## 3	Open The DApp

at ./crowdfund

```
yarn install
yarn start
```

All the funding and proposal result

![image-20210114203903854](C:\Users\Eternal\AppData\Roaming\Typora\typora-user-images\image-20210114203903854.png)

Funding you started and donated:

![image-20210114213747623](C:\Users\Eternal\AppData\Roaming\Typora\typora-user-images\image-20210114213747623.png)

You can donate and propose and start a new funding

![image-20210114220022408](C:\Users\Eternal\AppData\Roaming\Typora\typora-user-images\image-20210114220022408.png)

## 4	Connect to the Local Network

import the accounts by private key

![image-20210114200600805](C:\Users\Eternal\AppData\Roaming\Typora\typora-user-images\image-20210114200600805.png)



 ![image-20210114200621143](C:\Users\Eternal\AppData\Roaming\Typora\typora-user-images\image-20210114200621143.png)





## 5	Create a Funding

![image-20210114205956030](C:\Users\Eternal\AppData\Roaming\Typora\typora-user-images\image-20210114205956030.png)

input the information

click start

and your funding will be on the board

![image-20210114210041835](C:\Users\Eternal\AppData\Roaming\Typora\typora-user-images\image-20210114210041835.png)

## 6	Donate

input the funding address and amount (ether)

![image-20210114220209376](C:\Users\Eternal\AppData\Roaming\Typora\typora-user-images\image-20210114220209376.png)

you need to confirm twice to add the invest to the invest list. (only the first time will send value)

![image-20210114220332704](C:\Users\Eternal\AppData\Roaming\Typora\typora-user-images\image-20210114220332704.png)

![image-20210114220341820](C:\Users\Eternal\AppData\Roaming\Typora\typora-user-images\image-20210114220341820.png)

Note: the donate amount may exceed the amount but the vote weight total amount is the goal amount.

![image-20210114221319974](C:\Users\Eternal\AppData\Roaming\Typora\typora-user-images\image-20210114221319974.png)

e.g.

Goal: 20 ether

A donates 11 ether

B donates 11 ether

then no matter A and B votes, the proposal will immediately be over. (exceed 50%)

So which side will win is about what time you vote.


## 7	Raise a proposal

![image-20210114220422532](C:\Users\Eternal\AppData\Roaming\Typora\typora-user-images\image-20210114220422532.png)

Similar to donate. Proposal will change the vote status:

![image-20210114220956611](C:\Users\Eternal\AppData\Roaming\Typora\typora-user-images\image-20210114220956611.png)



## 8	Vote for proposal

![image-20210114221012740](C:\Users\Eternal\AppData\Roaming\Typora\typora-user-images\image-20210114221012740.png)

input the address.

When you are not a donator, error will occur.

The vote result will take effect when the weight of either side(Y/N) is passed 50% of goal Amount.

For one funding only one proposal will be going on at a time.