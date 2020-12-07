#include <cstdio>
#include <cstdlib>
#include <cstring>

//机器如果本身就是大端存储的话置为0，否则为1 
#define LITTLE_ENDIAN 1
//算法正确性验证测试MODE置为1；Merkel树构建过程测试MODE置为2；工作量证明过程测试MODE置为3
int MODE = 1;
//算法正确性验证测试时可输入的最大字节数，可以修改 
#define MAXSIZE 2048 

unsigned long int h0, h1, h2, h3, h4, h5, h6, h7;
unsigned long int k[64];

typedef struct bufNode {
	unsigned char * message;
	unsigned long long int messageLength;
}Message;


#ifdef LITTLE_ENDIAN
static void BigEndian(unsigned char * buf, int buf_len)
{  
	unsigned char *cp = (unsigned char *)buf, t;
	for (int i = 0; i < buf_len / 4; i++) 
	{
	    t = cp[0];
	    cp[0] = cp[3];
	    cp[3] = t;
	    t = cp[1];
	    cp[1] = cp[2];
	    cp[2] = t;
	    cp += 4;
	}
}
#endif


static unsigned long int ROL(unsigned long int x, int number)
{
   return (x << number) | (x >> (32 - number));
}


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


void test3(void) {
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
		initConstants();
		msg = preProcessing(res, 32);
		res = process(msg->message, msg->messageLength);
		printf("结果值：") ;
		for(int i = 0; i < 32; i++) {
			printf("%02X", res[i]);
		}
		printf("\n");
		if((res[0]&0xff) == 0) {
			printf("已找到！最终结果值为：");
			for(int i = 0; i < 32; i++) {
				printf("%02X", res[i]);
			}
			break;
		} 
	} 
}


int main(void) {
	char flag = 'Y'; 
	while(flag == 'Y') {
		printf("请输入测试编号：\n");
		printf("1. 算法正确性验证测试\n");
		printf("2. Merkel树构建过程(区块数据锁定)测试\n");
		printf("3. 工作量证明过程测试\n");
		scanf("%d", &MODE);
		getchar();
		if(MODE == 1) {
			test1();
		}
		else if(MODE == 2) {
			test2();
		}
		else if(MODE == 3) {
			test3();
		}
		else {
			printf("编号错误！\n");
		}
		printf("\n继续？(Y/N)");
		flag = getchar();
		getchar(); 
	}
	
	return 0;
}
