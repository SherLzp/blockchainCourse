# Homework1 : SHA256

## 算法原理

SHA256算法主要步骤如下：

1. 将原始文件扩充为整数个512-bit的BLOCK。
2. 产生256-bit的初始向量H
3. 每次通过算法让当前的向量H和一个BLOCK混合计算产生新的向量，这一步包含：
   1. 通过512-bit的BLOCK产生64个32-bit的word
   2. 256-bit的向量H 和word联合产生一个新的256-bit向量

其中所有数据均以大端方式存储，数据计算亦是为大端存储下的结果。接下来依次讲解每个部分的原理。

### 原始数据扩充

首先将原文后补一个1，随后补0直至原文长度length满足：$length\equiv 448(mod 512)$ ，随后剩下的64位填充原始数据（即未扩充前）长度，因此SHA256算法最多可以加密长度为 $2^{64}-1$ 的文章。

### 产生256-bit的初始向量H

初始向量H为：（程序中通过unsigned int保存所有数据，后不赘述）

```c++
const unsigned int SHA256_V[8] = { 
	0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
	0x510e527f,	0x9b05688c, 0x1f83d9ab, 0x5be0cd19 
};
```

### 从BLOCK产生64个32-bit word

首先将BLOCK分解，512=32\*16 ，因此这64个数据的前十六个即为原BLOCK的拆分。

第17-64个word由如下方式产生：设第i个word为 $W_i$ 
$$
W_i=\sigma_1(W_{i-2}) + W_{i-7} + \sigma_0(W_{i-15})+W_{i-16}\\
\sigma_0(x) = S^7(x)\oplus S^{18}(x)\oplus R^3(x)\\
\sigma_1(x) = S^{17}(x)\oplus S^{19}(x)\oplus R^{10}(x)
$$
其中 $S^i(x)$ 表示x循环右移i位 $R^i(x)$ 表示逻辑右移i位，具体实现如下：

```c++
unsigned int shr(unsigned int x, int n)
{
	return (x << (32-n)) + (x >> n);
}
```



### 由向量和BLOCK产生新向量

首先让BLOCK产生64个word $W_i(0\le i\le 63)$ , 随后引入64个常量 $K_i(0\le i\le 63)$ :

```c++
const unsigned int SHA256_K[64] = {
	0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 
	0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
	0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 
	0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
	0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 
	0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
	0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 
	0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
	0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 
	0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
	0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 
	0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
	0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 
	0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
	0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 
	0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
};
```

每次将向量分成32-bit的八段，记为ABCDEFGH，随后将下面的操作循环64次：

![image-20201211151821377](C:\Users\Rivekon\AppData\Roaming\Typora\typora-user-images\image-20201211151821377.png)

图中的田字格即为将两条线的数值相加，而右侧的 $W_t$ 和 $K_t$ 即为刚才由BLOCK产生的word和常量word

四个紫色的方框对应下面的函数：
$$
Ch(x,y,z) = (x\and y) \oplus(\lnot x \and z)\\
Ma(x,y,z) = (x\and y)\oplus(y\and z)\oplus (z\and x)\\
\Sigma_0(x) = S^2(x)\oplus S^{13}(x)\oplus S^{22}(x)\\
\Sigma_1(x) = S^6(x)\oplus S^{11}(x)\oplus S^{25}(x)
$$
经过64次循环后，得到经BLOCK产生的新向量

### 让向量经过所有BLOCK，得出最终结果

最终的256-bit的密文即为原始向量H通过所有的512-bit BLOCK后得到的结果，而下面的实验中原文长度并非很长，所以在演示中只经过了一次上面的BLOCK加密过程，而实际上需要经过很多次加密（因为BLOCK数量很多）。



## 实验结果

测试程序如下：

```c++
#include "SHA256.h"
#include <stdio.h>

int main()
{
	unsigned char msg[16] = "abcdefg1234567";
	unsigned int length = 14;
	unsigned int vector[8];
	testOutput(msg, length);
	SHA256(msg, length, vector);
	printf("\nSHA256-Result: ");
	for (int i = 0; i <= 7; i++)
	{
		printf("%X", vector[i]);
	}
	printf("\n");
	return 0;
}
```

最终得到的“abcdefg1234567”的加密结果为：

![image-20201211152851228](C:\Users\Rivekon\AppData\Roaming\Typora\typora-user-images\image-20201211152851228.png)

C20D2EBA7FFDA0079812721B6F4E4E109E2F0C5E8CC3D1273A060DF6F7D9F339

与网上众多在线SHA256加密得到的答案相同



## 算法在区块链中的作用

1. 不可篡改性

   我们将数据随意改动一位，例如原始数据从“abcdefg1234567”（“61626364 65666731 32333435 36370000”）改为“abcdeff1234567”（"61626364 65666631 32333435 36370000"）

   最后经SHA256加密的结果为：

   A99A7A31C6B521CD3062618A0FC927147CB844DD397C2C312B9F4854EEF22C4

   ![image-20201211152902970](C:\Users\Rivekon\AppData\Roaming\Typora\typora-user-images\image-20201211152902970.png)

   可见原文相差一位对结果的影响是非常大的

2. 计算PoW（Proof of Work）

   PoW的计算原理是约定好一段前缀（“I am Satoshi Nakamoto”），以及工作难度n，随后所有希望竞争记账权的机器均在这个前缀后面添加一个递增的数字，找到第一个前n个bit均为0的SHA-256密文时，向全网广播这个数字，其他机器验证是否符合要求，如果符合要求则第一个找到这个数字的机器拥有记账权。

   例如课件中描述了n=4的情况：I am Satoshi Nakamoto13即满足前4个bit均为0，第一个算出数字13的获得记账权。

   由于需要保证接近十分钟获得一次记账权，工作难度会灵活改变，当大家在十分钟内都能算出来，则提高n，当大家都无法在十分钟内算出来，则减少n

   程序计算出来当工作难度上升时对应的解数字如下：（前缀为“I am Satoshi Nakamoto”）

   | 工作难度n |  解   |
   | :-------: | :---: |
   |     1     |   6   |
   |    2-4    |  13   |
   |     5     |  20   |
   |     6     |  95   |
   |    7-9    |  123  |
   |    10     |  266  |
   |   11-12   | 3583  |
   |   13-14   | 5016  |
   |    15     | 95292 |

   ![image-20201211160512622](C:\Users\Rivekon\AppData\Roaming\Typora\typora-user-images\image-20201211160512622.png)

   可以发现时间是指数级上升的。

