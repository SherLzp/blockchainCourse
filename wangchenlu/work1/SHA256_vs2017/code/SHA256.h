#ifndef _SHA_256_
#define _SHA_256_
#include <iostream>
using namespace std;
#define MaxChar  1000
#define Max MaxChar+64

typedef unsigned int WORD;
typedef unsigned __int64 UInt64;
typedef unsigned char Uchar;

// SHA256类
class SHA256{
	private:
		WORD NGroup;                  // 可分成的512bit的块数
		Uchar tempString[Max];        // 将进行加密的字符串
		WORD originalMessage[Max/4];  // 将字符数组转换成整型数组
		WORD messageDigest[8];        // 信息摘要
		int difficulty = 4;           // 难度系数，即消息摘要前导零的最少个数
		int nonce = 0;
	public:
		SHA256() { initValue(); }
		~SHA256() {};
		WORD* encryption(char* string, bool isPoW = false);  // 进行SHA256加密
		WORD* PoW(char* string);                 // 进行工作量证明算法
		WORD* PoW(char* string, int diffuculty); // 进行工作量证明算法，给定难度系数
	private:
		void padding(Uchar* Y);              // 附加填充比特
		WORD* dealMessageDigest(WORD W[16]); // 处理512bit数据，返回信息摘要
		void initValue();                    // 将消息摘要设为初始值 
		void copyString(char* string);       // 将输入的char* 字符串，保存为Uchar*
		void addNonce(int length);           // 在原始字符串后添加nonce
		void setDifficulty(int n);           // 设置工作量难度
		bool validationPoW(WORD* MD);        // 验证是否达到工作量目标

		// 运算函数
		WORD ROTR(WORD W, int n); // 右旋转
		WORD SHR(WORD W, int n);  // 右移位
		// 六个逻辑函数
		WORD Conditional(WORD x, WORD y, WORD z);
		WORD Majority(WORD x, WORD y, WORD z);
		WORD CSigma_0(WORD x);
		WORD CSigma_1(WORD x);
		WORD LSigma_0(WORD x);
		WORD LSigma_1(WORD x);
};

#endif