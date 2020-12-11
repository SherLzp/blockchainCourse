#include <cstring>
#include <fstream>
#include "SHA256.h"
using namespace std;

//前64个质数的立方根的小数部分的前64位
const unsigned int SHA256::zhishu64[64] = 
{0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2 };

void SHA256::Initial()
{
	zhishu8[0] = 0x6a09e667;
	zhishu8[1] = 0xbb67ae85;
	zhishu8[2] = 0x3c6ef372;
	zhishu8[3] = 0xa54ff53a;
	zhishu8[4] = 0x510e527f;
	zhishu8[5] = 0x9b05688c;
	zhishu8[6] = 0x1f83d9ab;
	zhishu8[7] = 0x5be0cd19;
}

void SHA256::Padding(const unsigned char *input, unsigned int block_number)
{//填充字符串
	unsigned int word[64],v[8];
	const unsigned char *temp;
	for (int i = 0; i < (int)block_number; i++) {
		temp = input + (i << 6);
		for (int j = 0; j < 16; j++) SHA2_PACK32(&temp[j << 2], &word[j]);
		for (int j = 16; j < 64; j++) word[j] = SHA256_F4(word[j - 2]) + word[j - 7] + SHA256_F3(word[j - 15]) + word[j - 16];//构造64个word
		for (int j = 0; j < 8; j++)	v[j] = zhishu8[j];
		for (int j = 0; j < 64; j++) {
			unsigned int m = v[7] + SHA256_F2(v[4]) + SHA2_CH(v[4], v[5], v[6])+ zhishu64[j] + word[j];
			unsigned int n = SHA256_F1(v[0]) + SHA2_MAJ(v[0], v[1], v[2]);
			v[7] = v[6];
			v[6] = v[5];
			v[5] = v[4];
			v[4] = v[3] + m;
			v[3] = v[2];
			v[2] = v[1];
			v[1] = v[0];
			v[0] = m+n;
		}
		for (int j = 0; j < 8; j++)	zhishu8[j] += v[j];
	}
}


void SHA256::Iteration(const unsigned char *input, unsigned int len)
{//加密循环
	unsigned int block_number, tmp;
	const unsigned char *new_input;
	if (init_length + len < 64) tmp = len;
	else tmp = 64 - init_length;
	memcpy(&input_block[init_length], input, tmp);
	if (init_length + len < 64)	init_length += len;
	else {
		block_number = (len - tmp) / 64;
		new_input = input + tmp;
		Padding(input_block, 1);
		Padding(new_input, block_number);
		tmp = (len - tmp) % 64;
		memcpy(input_block, &new_input[block_number << 6], tmp);
		init_length = tmp;
		total_length += (block_number + 1) << 6;
	}
}

void SHA256::Generate(unsigned char *res)
{//生成哈希值
	unsigned int block_number = (1 + (55 < (init_length % 64)));
	unsigned int len1 = block_number << 6, len2 = (total_length + init_length) << 3;
	memset(input_block + init_length, 0, len1 - init_length);
	input_block[init_length] = 0x80;
	SHA2_UNPACK32(len2, input_block + len1 - 4);
	Padding(input_block, block_number);
	for (int i = 0; i < 8; i++) SHA2_UNPACK32(zhishu8[i], &res[i << 2]);
}
