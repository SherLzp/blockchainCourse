#define _CRT_SECURE_NO_WARNINGS
#include<iostream>
#include <cstddef>
#include<memory>
#include<cstdlib>
#include<string>
#include <random>
#include<ctime>
using namespace std;

typedef unsigned char byte;
typedef unsigned int uint32;

typedef struct {
	byte data[64];  
	uint32 datalen;   
	unsigned long long bitlen;  
	uint32 state[8];  
} SHA256_UTR;

#define ROTLEFT(a,b) (((a) << (b)) | ((a) >> (32-(b))))
#define ROTRIGHT(a,b) (((a) >> (b)) | ((a) << (32-(b))))

#define CH(x,y,z) (((x) & (y)) ^ (~(x) & (z)))
#define MAJ(x,y,z) (((x) & (y)) ^ ((x) & (z)) ^ ((y) & (z)))
#define EP0(x) (ROTRIGHT(x,2) ^ ROTRIGHT(x,13) ^ ROTRIGHT(x,22))
#define EP1(x) (ROTRIGHT(x,6) ^ ROTRIGHT(x,11) ^ ROTRIGHT(x,25))
#define SIG0(x) (ROTRIGHT(x,7) ^ ROTRIGHT(x,18) ^ ((x) >> 3))
#define SIG1(x) (ROTRIGHT(x,17) ^ ROTRIGHT(x,19) ^ ((x) >> 10))

typedef struct {
    uint32 h0 = 0x6a09e667;
	uint32 h1 = 0xbb67ae85;
	uint32 h2 = 0x3c6ef372;
	uint32 h3 = 0xa54ff53a;
	uint32 h4 = 0x510e527f;
	uint32 h5 = 0x9b05688c;
	uint32 h6 = 0x1f83d9ab;
	uint32 h7 = 0x5be0cd19;
	const uint32  k[64] = {
		0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
		0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
		0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
		0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
		0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
		0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
		0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
		0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
	};
}sha_ctx;
sha_ctx model;

void transform(SHA256_UTR *ctx, const byte data[])
{
	uint32 a, b, c, d, e, f, g, h, i, j, t1, t2, m[64];
	// initialization 
	for (i = 0, j = 0; i < 16; ++i, j += 4)
		m[i] = (data[j] << 24) | (data[j + 1] << 16) | (data[j + 2] << 8) | (data[j + 3]);
	for ( ; i < 64; ++i)
		m[i] = SIG1(m[i - 2]) + m[i - 7] + SIG0(m[i - 15]) + m[i - 16];

	a = ctx->state[0];
	b = ctx->state[1];
	c = ctx->state[2];
	d = ctx->state[3];
	e = ctx->state[4];
	f = ctx->state[5];
	g = ctx->state[6];
	h = ctx->state[7];

	for (i = 0; i < 64; ++i) {
		t1 = h + EP1(e) + CH(e,f,g) + model.k[i] + m[i];
		t2 = EP0(a) + MAJ(a,b,c);
		h = g;
		g = f;
		f = e;
		e = d + t1;
		d = c;
		c = b;
		b = a;
		a = t1 + t2;
	}

	ctx->state[0] += a;
	ctx->state[1] += b;
	ctx->state[2] += c;
	ctx->state[3] += d;
	ctx->state[4] += e;
	ctx->state[5] += f;
	ctx->state[6] += g;
	ctx->state[7] += h;
}

void sha256_init(SHA256_UTR *ctx)
{
	ctx->datalen = 0;
	ctx->bitlen = 0;
	ctx->state[0] = model.h0;
	ctx->state[1] = model.h1;
	ctx->state[2] = model.h2;
	ctx->state[3] = model.h3;
	ctx->state[4] = model.h4;
	ctx->state[5] = model.h5;
	ctx->state[6] = model.h6;
	ctx->state[7] = model.h7;
}

void update(SHA256_UTR *ctx, const byte data[], size_t len)
{
	uint32 i;

	for (i = 0; i < len; ++i) {
		ctx->data[ctx->datalen] = data[i];
		ctx->datalen++;
		if (ctx->datalen == 64) {
			transform(ctx, ctx->data);
			ctx->bitlen += 512;
			ctx->datalen = 0;
		}
	}
}

void _final(SHA256_UTR *ctx, byte hash[])
{
	uint32 i;
	i = ctx->datalen;
	if (ctx->datalen < 56) {
		ctx->data[i++] = 0x80;
		while (i < 56)
			ctx->data[i++] = 0x00;
	}
	else if(ctx->datalen > 56){
		ctx->data[i++] = 0x80;
		while (i < 64)
			ctx->data[i++] = 0x00;
		transform(ctx, ctx->data);
		memset(ctx->data, 0, 56);
	}
	else {
		ctx->data[i++] = 0x80;
		while (i < 64)
			ctx->data[i++] = 0x00;
		transform(ctx, ctx->data);
		memset(ctx->data, 0, 56);
	}

	ctx->bitlen += ctx->datalen * 8;
	ctx->data[63] = ctx->bitlen;
	ctx->data[62] = ctx->bitlen >> 8;
	ctx->data[61] = ctx->bitlen >> 16;
	ctx->data[60] = ctx->bitlen >> 24;
	ctx->data[59] = ctx->bitlen >> 32;
	ctx->data[58] = ctx->bitlen >> 40;
	ctx->data[57] = ctx->bitlen >> 48;
	ctx->data[56] = ctx->bitlen >> 56;
	transform(ctx, ctx->data);
	i = 0;
	while (i < 4) {
		hash[i]      = (ctx->state[0] >> (24 - i * 8)) & 0x000000ff;
		hash[i + 4]  = (ctx->state[1] >> (24 - i * 8)) & 0x000000ff;
		hash[i + 8]  = (ctx->state[2] >> (24 - i * 8)) & 0x000000ff;
		hash[i + 12] = (ctx->state[3] >> (24 - i * 8)) & 0x000000ff;
		hash[i + 16] = (ctx->state[4] >> (24 - i * 8)) & 0x000000ff;
		hash[i + 20] = (ctx->state[5] >> (24 - i * 8)) & 0x000000ff;
		hash[i + 24] = (ctx->state[6] >> (24 - i * 8)) & 0x000000ff;
		hash[i + 28] = (ctx->state[7] >> (24 - i * 8)) & 0x000000ff;
		i++;
	}
}

string sha(string message) {
	byte buf[32];
	SHA256_UTR ctx;
	sha256_init(&ctx);
	update(&ctx, (byte*)message.c_str(), message.size());
	_final(&ctx, buf);
	char tmp[3];
	string newStr = "";
	for (int i = 0; i < 32; i++) {
		_itoa(buf[i], tmp, 16);
		if (buf[i] < 0x10) {
			newStr += "0";
			newStr += tmp;
		}
		else newStr += tmp;
	}
	return newStr;
}


int main() {
	//计算结点区块哈希值
	
	//区块头6个字段
	string s0= "01000000";
	string s1="00002ab7e569e8bc9317e2fe99f2de44d49ab2b8851ba4a308000000000eeab3";
	string s2 = "b9f4dbaf319cce3e93437b727c7c70ded76857f5e093d04f93436d242db9ac";
	string s3 ="00000008";
	string s4="00001000";
	string s5="242db9ac";
	string block = s0 + s1 + s2 + s3 + s4 + s5;
	cout << "区块哈希值为: "<<sha(sha(block))<<endl;

	//计算markle hash树根节点的hash值
	string bus1 = "交易1";
	string bus2 = "交易2";
	string res1 = sha(sha(bus1));//结点1的哈希
	string res2 = sha(sha(bus2));//结点2的哈希
	cout << "\n根结点哈希值为: " << sha(sha(res1 + res2)) << endl;

	//模拟PoW中使用SHA256的过程
	default_random_engine e(time(NULL));
	uniform_int_distribution<unsigned> u(0, 0xffffffff);	
	int cnt = 1;
	while (1) {
		char nonce[9];//4个字节==8位16进制数
		_itoa(u(e), nonce, 16);//随机
		string headStr = s0 + s1 + s2 + s3 + s4 + nonce;
		string res = sha(sha(headStr));
		bool isLess = true;
		for (int i = 0; i < 4; i++) {
			if (res.c_str()[i] != '0') {
				isLess = false;
			}
		}
		if (isLess) {
			//前4位为0则计算成功
			cout << "第" << cnt << "次，成功"<<endl;
			cout << "新的区块哈希值：" << res << endl;
			break;
		}
		else if(cnt%20000==0){
			cout << "第" << cnt << "次，失败"<<endl;
		}
		else if (res.size() != 64) {
			cout << res << endl;
		}
		cnt++;
	}
}