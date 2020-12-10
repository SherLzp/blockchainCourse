#pragma once
#include<iostream>
#include<string>
#include<cstring>
#include <stdlib.h>
using namespace std;

typedef unsigned int UINT32;
typedef unsigned __int64 UINT64;
typedef unsigned char UChar;
#define MAX 10000

const UINT32 K[64] = {
		0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
		0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
		0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
		0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
		0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
		0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
		0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
		0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
};

UINT32 W[MAX/4];
UINT32 M[16];
void PAD(UChar[MAX]);
struct RES {
	UINT32 H[8] = { 0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19
	};
}Init;

//循环右移n个bits
UINT32 ROTR(UINT32 W, int n) {
	return ((W >> n) & 0xFFFFFFFF) | (W) << (32 - (n));
}
	//右移n个bits
UINT32 RS(UINT32 W, int n) {
	return ((W >> n) & 0xFFFFFFFF);
}
UINT32  LSigma0(UINT32 w) {
	return ROTR(w, 2) ^ ROTR(w, 13) ^ ROTR(w, 22);
}
UINT32  LSigma1(UINT32 w) {
	return ROTR(w, 6) ^ ROTR(w, 11) ^ ROTR(w, 25);
}
UINT32  SSigma0(UINT32 w) {
	return ROTR(w, 7) ^ ROTR(w, 18) ^ RS(w, 3);
}
UINT32  SSigma1(UINT32 w) {
	return ROTR(w, 17) ^ ROTR(w, 19) ^ RS(w, 10);
}
UINT32 Ch(UINT32 x, UINT32 y,UINT32 z) {
	return (x&y) ^ ((~x)&z);
}
UINT32 Maj(UINT32 x, UINT32 y, UINT32 z) {
	return (x&y) ^ (x&z) ^ (y&z);
}


RES CODE(UINT32 w[16]) {
	UINT32 a, b, c, d, e, f, g, h;
	UINT32 W[64] = { 0 };//存储生成的64个字

	//前16个字直接由消息分解得到
	for (int i = 0; i < 16; i++) {
		W[i] = w[i];
	}
	//剩余的字循环得出
	for (int i = 16; i < 64; i++) {
		W[i] = SSigma1(W[i - 2]) + W[i - 7] + SSigma0(W[i - 15]) + W[i - 16];
	}
	a = Init.H[0];
	b = Init.H[1];
	c = Init.H[2];
	d = Init.H[3];
	e = Init.H[4];
	f = Init.H[5];
	g = Init.H[6];
	h = Init.H[7];
	for (int i = 0; i < 64; i++) {
		UINT32 T1 = h + LSigma1(e) + Ch(e, f, g) + K[i] + W[i];
		UINT32 T2 = LSigma0(a) + Maj(a, b, c);
		h = g;
		g = f;
		f = e;
		e = d + T1;
		d = c;
		c = b;
		b = a;
		a = T1 + T2;
	}
	Init.H[0] += a; 
	Init.H[1] += b;
	Init.H[2] += c;
	Init.H[3] += d;
	Init.H[4] += e;
	Init.H[5] += f;
	Init.H[6] += g;
	Init.H[7] += h;

	return Init;
}

void Main_Process(UChar X[MAX]) {
	UINT64 length = strlen((char *)X);//数据长度
	UINT32 fill_length = abs(55 - (int)length) % 64;//需要填充的长度 
	UINT32 n = (length + 8) / 64 + 1;
	UChar temp[MAX] = { 0 };
	for (int i = 0; i < length; i++) {
		temp[i] = X[i];
	}
	temp[length] = 0x80;//填充一个1
	//填充0
	for (int i = length + 1; i <= length + fill_length; i++) {
		temp[i] = 0x00;
	}
	//填充长度
	for (int i = 1; i <= 8; i++) {
		temp[(n * 64) - i] = (UChar)(8 * length >> (i - 1) * 8);
	}
	
	UINT32 T1, T2, T3, T4;

	//无符号字符转换为无符号整型
	for (int i = 0; i < MAX / 4; i++) {
		for (int j = 0; j < 4; j++) {
			if (j == 0)
				T1 = temp[4 * i + j];
			if (j == 1)
				T2 = temp[4 * i + j];
			if (j == 2)
				T3 = temp[4 * i + j];
			if (j == 3)
				T4 = temp[4 * i + j];
		}
		W[i] = (T1 << 24) + (T2 << 16) + (T3 << 8) + T4;
	}
	RES res;
	//将块分组处理
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < 16; j++) {
			M[j] = W[(i * 16) + j];
		}
		res = CODE(M);
	}
	cout << "the result is: "<<endl;
	for (int k = 0; k < 8; k++) {
	cout << hex << res.H[k] << " ";
	}
}

int main() {
	UChar X[MAX];
	cout << "Please enter the string to be encrypted:" << endl;
	cin >> X;
	Main_Process(X);
	system("pause");
	return 0;
}
