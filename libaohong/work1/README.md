# 作业1：SHA-256算法实现及其在比特币区块链中的应用

## 一、比特币区块链中SHA-256算法及其应用介绍

安全散列算法（英语：Secure Hash Algorithm，缩写为SHA）是一个密码散列函数家族，是FIPS所认证的安全散列算法。能计算出一个数字消息所对应到的，长度固定的字符串（又称消息摘要）的算法。且若输入的消息不同，它们对应到不同字符串的机率很高。

SHA家族的五个算法，分别是SHA-1、SHA-224、SHA-256、SHA-384，和SHA-512，由美国国家安全局（NSA）所设计，并由美国国家标准与技术研究院（NIST）发布；是美国的政府标准。后四者有时并称为SHA-2。

比特币采用的SHA-256算法是SHA-2下细分出的一种算法，对于任意长度的输入数据，SHA256都会产生一个256bit长的哈希值，通常用一个长度为64的十六进制字符串来表示，输出为256位，输出空间是2的256次方，目前尚未有破解方法。是在中本聪发明比特币时（2008）被公认为最安全最先进的算法之一。

SHA-256算法在构建Merkel树——比特币区块链中区块的微观结构——过程中，起着十分重要的作用：Merkle树中使用的散列算法就是SHA-256算法，即使用两次SHA-256算法计算结点的哈希值SHA256(SHA256(交易A))；

SHA-256算法还用于生成比特币公钥及地址：比特币区块链系统中对公钥进行加密用到的散列算法就是SHA-256，生成公钥hash值然后计算hash值的比特币地址；

SHA-256算法在比特币区块链工作量证明（proof of work）的共识机制中也发挥着重要作用：通过SHA-256这一高强度哈希计算进行算力竞争解决记账权，达成共识。而选择SHA-256算法作为工作量证明中的哈希算法的原因在于，SHA-256算法的特点就是已知答案验证正确很容易，但是要得到答案非常麻烦，需要一个一个数字去试，并且SHA-256这套算法的安全性是被世界各国密码学家所广泛承认的是相对来说目前最安全的加密算法，以现在的计算机破解SHA-256需要消耗极大的资源，无法获得收益。

## 二、实验环境说明

- 开发语言：C、C++
- 开发环境：VSCode、Dev-C++
- 运行环境：包括但不限于Windows 10，Linux系统，装有gcc
- 运行配置：在Windows系统下直接运行exe文件，在Linux及其他系统下需要安装gcc，并手工编译源代码文件

## 三、SHA-256算法原理及实现

### 3.1 常量初始化

SHA-256算法的第一步就是初始化在加密过程中将要运用到的8个哈希初值和64个哈希常量，这些初始化的数据都在SHA-256算法的官方说明中给出——其中8个哈希初值是对自然数中前8个质数（2,3,5,7,11,13,17,19）的平方根的小数部分取前32位而来，64个哈希常量是对自然数中前64个质数(2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97…)的立方根的小数部分取前32位而来。

初始化过程用C语言实现如下：

```c
static void initConstants() {
	h0 = 0x6a09e667UL;
	h1 = 0xbb67ae85UL;
	h2 = 0x3c6ef372UL;
	h3 = 0xa54ff53aUL;
	h4 = 0x510e527fUL;
	h5 = 0x9b05688cUL;
	h6 = 0x1f83d9abUL;
	h7 = 0x5be0cd19UL;
	unsigned long int tmp[64] = {
		0x428a2f98UL, 0x71374491UL, 0xb5c0fbcfUL, 0xe9b5dba5UL,
		0x3956c25bUL, 0x59f111f1UL, 0x923f82a4UL, 0xab1c5ed5UL,
		0xd807aa98UL, 0x12835b01UL, 0x243185beUL, 0x550c7dc3UL,
		0x72be5d74UL, 0x80deb1feUL, 0x9bdc06a7UL, 0xc19bf174UL,
		0xe49b69c1UL, 0xefbe4786UL, 0x0fc19dc6UL, 0x240ca1ccUL,
		0x2de92c6fUL, 0x4a7484aaUL, 0x5cb0a9dcUL, 0x76f988daUL,
		0x983e5152UL, 0xa831c66dUL, 0xb00327c8UL, 0xbf597fc7UL,
		0xc6e00bf3UL, 0xd5a79147UL, 0x06ca6351UL, 0x14292967UL,
		0x27b70a85UL, 0x2e1b2138UL, 0x4d2c6dfcUL, 0x53380d13UL,
		0x650a7354UL, 0x766a0abbUL, 0x81c2c92eUL, 0x92722c85UL,
		0xa2bfe8a1UL, 0xa81a664bUL, 0xc24b8b70UL, 0xc76c51a3UL,
		0xd192e819UL, 0xd6990624UL, 0xf40e3585UL, 0x106aa070UL,
		0x19a4c116UL, 0x1e376c08UL, 0x2748774cUL, 0x34b0bcb5UL,
		0x391c0cb3UL, 0x4ed8aa4aUL, 0x5b9cca4fUL, 0x682e6ff3UL,
		0x748f82eeUL, 0x78a5636fUL, 0x84c87814UL, 0x8cc70208UL,
		0x90befffaUL, 0xa4506cebUL, 0xbef9a3f7UL, 0xc67178f2UL
	};
	for (int i = 0; i < 64; i++) {
		k[i] = tmp[i];
	}
	return;
}
```

### 3.2 信息预处理（位填充）

前文中也提到SHA-256算法最终得到固定长度为256位的密文，而且加密过程对明文的格式有着严格的要求——每一轮加密处理固定长度为512位的明文块。然而在实际应用过程中，输入的明文长度往往不能满足位长度恰好为512的倍数，因此要在加密前对明文最后进行填充，使其位长度恰好达到512的倍数。SHA-256算法具体的填充规则如下：

首先在明文末尾进行填充使其最后一块位长度达到448。具体说来，如果明文位长度对512取模以后得到的x小于448，则要在后面补充448-x位；若x大于等于448，则要将这一块的512位都填满，然后再创建一个新的明文块填充448位——也就是说，即使长度已经满足对512取模后余数是448，填充也必须要进行。而填充的内容是，填充的首位为1，其余位全为0。

在对明文填充完毕，明文的最后一块达到了448位以后，要再将填充前原明文的位长度以大端规则下64位整数形式填充到末尾，长度也填充完毕后，明文的最后一块也达到了512位，整个明文便符合了位长度为512位的要求。

整个填充过程C语言代码如下：

```c
Message * preProcessing(unsigned char * message, unsigned long long int length) {
	unsigned long long int appendLength = (64 + 56 - (length & 0x3f)) & 0x3f;
	unsigned char * res = (unsigned char * ) malloc(sizeof(unsigned char) * (length + appendLength + 8));
	memset(res, 0, (length + appendLength + 8));
	memcpy(res, message, length);
	res[length] |= 0x80;
	unsigned char * totalBits = (unsigned char * ) malloc(sizeof(unsigned char) * 8);
	unsigned long int lowBits = (length << 3) & 0xffffffff;
	unsigned long int highBits = (length >> 29) & 0xffffffff;
	memcpy(totalBits, (unsigned char *)&highBits, 4);
	memcpy(totalBits + 4, (unsigned char *)&lowBits, 4);
	#ifdef LITTLE_ENDIAN
   	BigEndian(totalBits, 8); 
   	#endif
	memcpy((unsigned char *)(res + length + appendLength), totalBits, 8);
	free(totalBits); 
	Message * msg = (Message *) malloc(sizeof(unsigned char *) + sizeof(unsigned long long int));
	msg->message = res;
	msg->messageLength = length + appendLength + 8;
	return msg;
}
```

### 3.3 加密过程

在进行完初始化和明文预处理操作后，就要开始正式的加密过程了。在加密过程中会用到以下逻辑运算公式：
$$
Ch(x,y,z)=(x \wedge y) \oplus (\neg x \wedge z)
$$

$$
Ma(x,y,z) = ( x \wedge y ) \oplus ( x \wedge z ) \oplus ( y \wedge z )
$$

$$
\Sigma_{0} ( x ) = ROTR( x,2 ) \oplus ROTR( x ,13) \oplus ROTR( x,22 )
$$

$$
\Sigma_{1}(x) = ROTR(x,6) \oplus ROTR(x,11) \oplus ROTR(x,25)
$$

$$
\sigma_{0}(x) = ROTR(x,7) \oplus ROTR(x,18) \oplus SHR(x,3)
$$

$$
\sigma_{1}(x) = ROTR(x,17) \oplus ROTR(x,19) \oplus SHR(x,10)
$$

SHA-256算法加密时对明文的每一块（512位）进行处理，不断迭代更新最终的密文。其中对一个明文块加密的过程如下：

首先将明文块从512位64字节扩展到256字节的64个字（32位无符号整数），扩展时直接将明文块内容按位复制到前16个字中，之后的48个字都由前面的字按照以下规则进行逻辑运算得来：
$$
W_t= σ_1(W_{t−2})+W_{t−7}+σ_0(W{t−15})+W_{t−16}
$$

然后循环64次让每一个字参与一系列逻辑运算来更新8个用来更新密文块的字（初始化为原密文块），这些逻辑运算都是前面讲述的逻辑运算单元的组合，都详细写在说明中，在此不再赘述具体的公式。循环结束后利用这8个字来更新密文块，至此对一个明文块的加密就结束了。C语言代码如下：

```c
void processOneBlock(unsigned char * block) {
	unsigned long int extendBlock[64];
	unsigned long int a, b, c, d, e, f, g, h, s0, s1, maj, ch, t1, t2;
	#ifdef LITTLE_ENDIAN
   	BigEndian(block, 64); 
   	#endif
	memcpy((unsigned char *)extendBlock, block, 64);
	for(int i = 16; i < 64; i++) {
		s0 = ROL(extendBlock[i - 15], 25) ^ ROL(extendBlock[i - 15], 14) ^ (extendBlock[i - 15] >> 3);
        s1 = ROL(extendBlock[i - 2], 15) ^ ROL(extendBlock[i - 2], 13) ^ (extendBlock[i - 2] >> 10);
        extendBlock[i] = extendBlock[i - 16] + s0 + extendBlock[i - 7] + s1;
	}
    a = h0;
	b = h1;
	c = h2;
	d = h3;
	e = h4;
	f = h5;
	g = h6;
	h = h7;
	for(int i = 0; i < 64; i++) {
		s0 = ROL(a, 30) ^ ROL(a, 19) ^ ROL(a, 10);
        maj = (a & b) ^ (a & c) ^ (b & c);
        t2 = s0 + maj;
        s1 = ROL(e, 26) ^ ROL(e, 21) ^ ROL(e, 7);
        ch = (e & f) ^ ((~e) & g);
        t1 = h + s1 + ch + k[i] + extendBlock[i];
        h = g;
        g = f;
        f = e;
        e = d + t1;
        d = c;
        c = b;
        b = a;
        a = t1 + t2;
	}
	h0 = h0 + a;
    h1 = h1 + b;
    h2 = h2 + c;
    h3 = h3 + d;
    h4 = h4 + e;
    h5 = h5 + f;
    h6 = h6 + g;
    h7 = h7 + h;
}
```

在对所有明文块都进行了一轮迭代以后，将最终的密文块按大端规则拼接在一起便得到了最终的256位密文。C语言代码如下：

```c
unsigned char * process(unsigned char * message, unsigned long long int length) {
	unsigned char * res = (unsigned char * ) malloc(sizeof(unsigned char) * 32);
	for(int i = 0; i < length; i += 64) {
		unsigned char block[64];
		memcpy(block, (unsigned char *)(message + i), 64);
		processOneBlock(block);
	}
	memcpy((unsigned char *)res, (unsigned char *)&h0, 4);
   	memcpy((unsigned char *)(res + 4), (unsigned char *)&h1, 4);
   	memcpy((unsigned char *)(res + 8), (unsigned char *)&h2, 4);
   	memcpy((unsigned char *)(res + 12), (unsigned char *)&h3, 4);
   	memcpy((unsigned char *)(res + 16), (unsigned char *)&h4, 4);
   	memcpy((unsigned char *)(res + 20), (unsigned char *)&h5, 4);
   	memcpy((unsigned char *)(res + 24), (unsigned char *)&h6, 4);
   	memcpy((unsigned char *)(res + 28), (unsigned char *)&h7, 4);
	#ifdef LITTLE_ENDIAN
   	BigEndian(res, 32); 
	#endif
	return res;
}
```

## 四、实验结果数据分析SHA-256算法在比特币区块链中的作用

### 4.1 代码正确性验证及SHA-256算法在加密公钥时的作用

为了验证C语言实现的SHA-256加密程序的正确性，用C语言编写的测试程序如下：

```c
void test1(void) {
	char flag = 'Y'; 
	while(flag == 'Y') {
		initConstants();
		unsigned char tmp[MAXSIZE];
		printf("请输入明文（不超过2k个字符）："); 
		gets((char *)tmp);
		printf("明文："); 
		puts((char *)tmp);
		Message * msg = preProcessing(tmp, (unsigned long long int)strlen((char *)tmp));
		unsigned char * res = process(msg->message, msg->messageLength);
		printf("密文：") ;
		for(int i = 0; i < 32; i++) {
			printf("%02X", res[i]);
		}
		printf("\n继续？(Y/N)");
		flag = getchar();
		getchar(); 
	}
} 
```

我们输入一段测试用报文“This is a test message."，可以得到如下密文输出：

![](\images\1.PNG)

与网上（链接：[在线SHA加密工具](http://www.jsons.cn/sha/)）正确的SHA-256算法加密比对，可以看到得到的密文结果一致：

![](\images\2.PNG)

由此可以证明我们对SHA-256算法的C语言实现是正确的。

在比特币区块链中，公钥的加密与地址的生成就是通过SHA-256算法实现的：
$$
公钥哈希值=RIMPED160(SHA256(公钥))
$$

$$
比特币地址=1+Base58(0+公钥哈希值+校验码)
$$

$$
校验码=前四字节(SHA256(SHA256(0+公钥哈希值)))
$$

由于RIMPED160等其他算法在本次作业中不涉及，因此前面的测试程序就能很好地说明SHA-256算法参与运算的过程。

### 4.2 SHA-256在构建Merkel树中的作用

比特币区块链中区块的微观结构采用Merkel树表示：

![](\images\5.PNG)

Merkle树是一种哈希二叉树，它是一种用作快速归纳和校验大规模数据完整性的数据结构。这种二叉树包含加密哈希值：叶节点是数据块的哈希值，非叶节点的哈希值是根据它下面子节点的值哈希计算得到。
在比特币网络中，Merkle树被用来归纳一个区块中的所有交易，同时生成整个交易集合的数字指纹，且提供了一种校验区块是否存在某交易的高效途径。
而Merkle树中的散列算法就是使用两次SHA-256算法计算结点的哈希值SHA256(SHA256(交易A))。接下来我们设计一个简单的测试来模拟Merkel树的构建过程。以下是C语言编写的测试代码：

```c
typedef struct treeNode {
	unsigned char * hashVal;
	struct treeNode * parent;
	struct treeNode * left;
	struct treeNode * right;
}MerkelNode;


MerkelNode * CreateNode(void) {
	MerkelNode * res = (MerkelNode *)malloc(sizeof(struct treeNode));
	res->hashVal = NULL;
	res->parent = res->left = res->right = NULL;
	return res;
}


unsigned char * orBits(unsigned char * op1, unsigned char * op2) {
	unsigned char * res = (unsigned char *)malloc(sizeof(unsigned char) * 32);
	for(int i = 0; i < 32; i++) {
		res[i] = op1[i] | op2[i];
	}
	return res;
}


void test2(void) {
	MerkelNode * head = CreateNode();
	MerkelNode * tmp = head;
	unsigned char trade[4][81] = {"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567893180101872zjdx1234", "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz3180101872zjdx01234567895678", 
									"zjdx0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ3180101872abcdefghijklmnopqrstuvwxyz0123", "3180101872zjdx0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ7890"};		
	for(int i = 0; i < 4; i++) {
		initConstants();
		Message * msg = preProcessing(trade[i], (unsigned long long int)strlen((char *)trade[i]));
		unsigned char * res = process(msg->message, msg->messageLength);
		initConstants();
		msg = preProcessing(res, 32);
		res = process(msg->message, msg->messageLength);
		MerkelNode * leafNode = CreateNode();
		leafNode->hashVal = res;
		if(i == 0) {
			head->left = leafNode;
		}
		tmp->right = leafNode;
		tmp = tmp->right; 
	}
	tmp = head->left;
	for(int i = 0; i < 2; i++) {
		unsigned char * buf = orBits(tmp->hashVal, tmp->right->hashVal);
		initConstants();
		Message * msg = preProcessing(buf, 32);
		unsigned char * res = process(msg->message, msg->messageLength);
		initConstants();
		msg = preProcessing(res, 32);
		res = process(msg->message, msg->messageLength);
		MerkelNode * leafNode = CreateNode();
		leafNode->hashVal = res;
		leafNode->left = tmp;
		tmp->parent = tmp->right->parent = leafNode;
		if(i == 0) {
			head->left = leafNode;
			tmp = tmp->right->right;
		}
		else if(i == 1) {
			head->left->right = leafNode;
		}
	}
	tmp = head->left;
	unsigned char * buf = orBits(tmp->hashVal, tmp->right->hashVal);
	initConstants();
	Message * msg = preProcessing(buf, 32);
	unsigned char * res = process(msg->message, msg->messageLength);
	initConstants();
	msg = preProcessing(res, 32);
	res = process(msg->message, msg->messageLength);
	MerkelNode * rootNode = CreateNode();
	rootNode->hashVal = res;
	rootNode->left = tmp;
	tmp->parent = tmp->right->parent = rootNode;
	head->left = rootNode;
	tmp = head->left;
	while(tmp != NULL) {
		MerkelNode * tmp2 = tmp;
		while(tmp2 != NULL) {
			for(int i = 0; i < 32; i++) {
				printf("%02X", tmp2->hashVal[i]);
			}
			printf("\n");
			tmp2 = tmp2->right;
		}
		printf("\n");
		tmp = tmp->left;
	}
}
```

为了简单起见，我们把交易的信息设置为一串字符串而非真正的交易内容，并且仅仅创建四个交易，结果如图所示：

![](\images\6.PNG)

其中第一组是最终Merkel树根节点的hash值，第二组是第二层的hash值，最后一组是四个叶节点的hash值。从叶节点对交易进行两次SHA-256加密开始一层层向上hash最终可以得到能表示整个区块的Merkel树。

### 4.3 SHA-256在工作量证明中的作用

SHA-256算法主要用于比特币区块链的工作量证明共识机制，具体过程如下：

首先生成Coinbase交易，并与其他所有准备打包进区块的交易组成交易列表，通过Merkle Tree算法生成Merkle Root Hash，然后把Merkle Root Hash及其他相关字段组装成区块头，如图所示：

![](\images\3.PNG)

将区块头的80字节数据作为工作量证明的输入，不停地变更区块头中的随机数（4字节）的数值，并对每次变更后的的区块头做双重SHA-256运算（即SHA-256(SHA-256(Block_Header))），将结果值与当前网络的目标值做对比，如果小于目标值，则解题成功，工作量证明完成。

注意在这里网络的目标值利用如下公式得到：
$$
最大目标值=0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffff
$$

$$
新难度值 = 旧难度值 \times ( 过去2016个区块花费时长 \div 20160 分钟 )
$$

$$
目标值=最大目标值 \div 难度值
$$

在这里举一个简单的例子来演示SHA-256算法在工作量证明中的使用。为了降低难度，我们把目标值手动设置为0x00fffffffffffffffffffffffffffffffffffffffffffffffffffffff，即满足双重SHA-256运算后的结果前8位为0即可，并将区块头除随机数外的其他部分都设置成一个固定的常量而非真正的区块头信息。由于在上述条件下难度大大降低，因此测试程序并没有采用随机数生成的方式，而是从零开始遍历所有可能的随机数，也能很快得到符合要求的结果值。下面是一段测试工作量证明过程的代码：

```c
void test2(void) {
	unsigned char tmp[80] = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567893180101872zjdx";
	for(unsigned long int i = 0; i < 0xffffffffUL; i++) {
		printf("尝试%d：", i);
		memcpy(tmp + 76, (unsigned char *)&i, 4);
		for(int i = 0; i < 80; i++) {
			printf("%02X", tmp[i]);
		}
		printf("\n");
		initConstants();
		Message * msg = preProcessing(tmp, (unsigned long long int)strlen((char *)tmp));
		unsigned char * res = process(msg->message, msg->messageLength);
		printf("结果值：") ;
		for(int i = 0; i < 32; i++) {
			printf("%02X", res[i]);
		}
		printf("\n");
		if((res[0]&0xf0) == 0) {
			printf("已找到！最终结果值为：");
			for(int i = 0; i < 32; i++) {
				printf("%02X", res[i]);
			}
			break;
		} 
	} 
}
```

测试程序输出的结果为：

![](\images\4.PNG)

从上面的简单测试就可以说明SHA-256算法在比特币区块链中的重要作用，要不断更换随机数并利用SHA-256加密来尝试获取符合目标值要求的结果。可以看到在尝试了327（编号从0开始）次后，程序就找到了比目标值小的SHA-256两次加密的结果值，当然实际情况下难度要远远超过测试时设置的难度，因此想要"挖矿"成功还是需要很多的运算量的。

## 五、运行方式

1. 编译运行SHA256.cpp文件（gcc）

2. 输入想要进行的测试编号：

   ![](\images\7.PNG)

3. 第2、3项测试程序会自动运行无需其他输入，第1项测试还需要输入要加密的明文（写在一行，若为汉字可能会因编码问题出现与网上程序结果不一致的情况），并在生成密文结果后选择是否继续输入验证（输入'Y'继续，'N'或其他字符退出）：

   ![](\images\8.PNG)

4. 在结束某项测试后也可以选择是否继续（输入'Y'继续，'N'或其他字符退出）：

   ![](\images\9.PNG)

## 附录

- 源代码文件：SHA256.cpp（代码主体用C语言编写，但为了防止不小心用到一些C++的特性所以后缀名用的是cpp，包含的头文件名也采用C++语言的格式）
- 可执行exe文件：SHA256.exe
