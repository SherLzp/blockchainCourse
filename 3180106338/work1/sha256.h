#pragma once
#include <string>
using namespace std;


class SHA256
{
public:
	void Initial();
	void Generate(unsigned char *res);
	void Iteration(const unsigned char *input, unsigned int len);

protected:
	unsigned char input_block[128];		   //存放处理成的块
	unsigned int total_length, init_length;//输入字符串补好的长度和初始长度
	const static unsigned int zhishu64[64];//前8(64)个质数的平方根(立方根)的小数部分的前64位
	unsigned int zhishu8[8];
//	unsigned int zhishu8[8] = { 0x6a09e667 ,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19 };
	void Padding(const unsigned char *input, unsigned int block_nb);
};

#define SHA2_SHFR(a, b)    (a >> b)
#define SHA2_ROTR(a, b)   ((a >> b) | (a << ((sizeof(a) << 3) - b)))
#define SHA2_ROTL(a, b)   ((a << b) | (a >> ((sizeof(a) << 3) - b)))
#define SHA2_CH(a, b, c)  ((a & b) ^ (~a & c))
#define SHA2_MAJ(a, b, c) ((a & b) ^ (a & c) ^ (b & c))
#define SHA256_F1(a) (SHA2_ROTR(a,  2) ^ SHA2_ROTR(a, 13) ^ SHA2_ROTR(a, 22))
#define SHA256_F2(a) (SHA2_ROTR(a,  6) ^ SHA2_ROTR(a, 11) ^ SHA2_ROTR(a, 25))
#define SHA256_F3(a) (SHA2_ROTR(a,  7) ^ SHA2_ROTR(a, 18) ^ SHA2_SHFR(a,  3))
#define SHA256_F4(a) (SHA2_ROTR(a, 17) ^ SHA2_ROTR(a, 19) ^ SHA2_SHFR(a, 10))
#define SHA2_UNPACK32(a, s)                 \
{                                             \
    *((s) + 3) = (unsigned char) ((a)      );       \
    *((s) + 2) = (unsigned char) ((a) >>  8);       \
    *((s) + 1) = (unsigned char) ((a) >> 16);       \
    *((s) + 0) = (unsigned char) ((a) >> 24);       \
}
#define SHA2_PACK32(s, a)                   \
{                                             \
    *(a) =   ((unsigned int) *((s) + 3)      )    \
           | ((unsigned int) *((s) + 2) <<  8)    \
           | ((unsigned int) *((s) + 1) << 16)    \
           | ((unsigned int) *((s) + 0) << 24);   \
}

