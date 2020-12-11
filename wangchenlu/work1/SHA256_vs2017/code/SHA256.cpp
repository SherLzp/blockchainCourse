#include "SHA256.h"
#include <fstream>
#include <time.h>

//64个32比特字的常数
const WORD hashConstValue[64] = {
	0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
	0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
	0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
	0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
	0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
	0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
	0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
	0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
};

void SHA256::initValue() {
	messageDigest[0] = 0x6a09e667;
	messageDigest[1] = 0xbb67ae85;
	messageDigest[2] = 0x3c6ef372;
	messageDigest[3] = 0xa54ff53a;
	messageDigest[4] = 0x510e527f;
	messageDigest[5] = 0x9b05688c;
	messageDigest[6] = 0x1f83d9ab;
	messageDigest[7] = 0x5be0cd19;
}

// SHA256加密
WORD* SHA256::encryption(char* string, bool isPoW) {
	if (!isPoW) {
		copyString(string);
		initValue();
	}

	// 信息预处理
	padding(tempString);
	// 分组处理
	int i, j;
	WORD M[16];      // 保存分组信息
	WORD* MD = NULL; // 保存消息摘要
	for (i = 0; i < NGroup; i++) {
		for (j = 0; j < 16; j++) {
			M[j] = originalMessage[(i * 16) + j];
		}
		MD = dealMessageDigest(M);;//sha-256压缩
	}

	return MD;
}

// 工作量证明
WORD* SHA256::PoW(char* string) {
	WORD* MD = NULL;
	UInt64 length = strlen(string);    //原始数据长度
	clock_t start, end;   // 计时
	double duration;
	copyString(string);   // 复制原始消息
	nonce = 0;
	start = clock();
	do {
		initValue();
		addNonce(length);
		MD = encryption(string, true);
		nonce++;
	} while (validationPoW(MD) != true);
	end = clock();
	duration = (double)(end - start) / CLOCKS_PER_SEC;

	// 输出结果
	ofstream outfile("output.txt", ios::app);
	for (int i = 0; i < 8; i++) {
		cout << hex << MD[i] << " ";
		outfile << hex << MD[i] << " ";
	}
	cout << "\tNumber of compute:" << dec << nonce;
	cout << "\tTime: " << duration << endl;
	outfile << "\tNumber of compute:" << dec << nonce;
	outfile << "\tTime:" << duration << endl;
	outfile.close();

	return MD;
}

WORD* SHA256::PoW(char* string, int diffuculty) {
	setDifficulty(diffuculty);
	return PoW(string);
}


// 附加填充比特
void SHA256::padding(Uchar* Y) {
	WORD i;
	WORD T[4] = { 0 };

	Uchar temp[Max] = { 0 };
	UInt64 length = strlen((char *)Y);    //原始数据长度
	int needToFill = (55 - length) % 64;  //需填充的长度
	needToFill = abs(needToFill);
	NGroup = (length + 8) / 64 + 1;       //分组数,补位必须进行，因此+1

	// 复制原始数据部分
	for (i = 0; i < length; i++) {
		temp[i] = Y[i];
	}
	// 填充1次1000 0000
	temp[length] = 0x80;
	// 填充0直到余数满足要求
	for (i = length + 1; i < length + needToFill + 1; i++) {
		temp[i] = 0x00;
	}

	// 在末尾附加长度值
	for (i = 1; i <= 8; i++) {
		temp[(NGroup * 64) - i] = (Uchar)((8 * length) >> ((i - 1) * 8));
	}

	//无符号字符转换为无符号整型,8bit -> 32bit
	for (i = 0; i < Max/4; i++) {
		originalMessage[i] = (temp[4 * i] << 24) + (temp[4 * i + 1] << 16) + (temp[4 * i + 2] << 8) + temp[4 * i + 3];
	}
}

// 处理512bit数据，返回信息摘要
WORD* SHA256::dealMessageDigest(WORD M[16]) {
	int i;
	WORD T1, T2, A, B, C, D, E, F, G, H;
	WORD W[64] = { 0 };
	// 构造64个字
	for (i = 0; i < 16; i++) {
		W[i] = M[i];
	}
	for (i = 16; i < 64; i++) {
		W[i] = LSigma_1(W[i - 2]) + W[i - 7] + LSigma_0(W[i - 15]) + W[i - 16];
	}
	A = messageDigest[0];
	B = messageDigest[1];
	C = messageDigest[2];
	D = messageDigest[3];
	E = messageDigest[4];
	F = messageDigest[5];
	G = messageDigest[6];
	H = messageDigest[7];
	// 进行64次循环
	for (i = 0; i < 64; i++) {
		T1 = H + CSigma_1(E) + Conditional(E, F, G) + hashConstValue[i] + W[i];
		T2 = CSigma_0(A) + Majority(A, B, C);
		H = G;
		G = F;
		F = E;
		E = D + T1;
		D = C;
		C = B;
		B = A;
		A = T1 + T2;
	}
	messageDigest[0] = (messageDigest[0] + A) & 0xFFFFFFFF;
	messageDigest[1] = (messageDigest[1] + B) & 0xFFFFFFFF;
	messageDigest[2] = (messageDigest[2] + C) & 0xFFFFFFFF;
	messageDigest[3] = (messageDigest[3] + D) & 0xFFFFFFFF;
	messageDigest[4] = (messageDigest[4] + E) & 0xFFFFFFFF;
	messageDigest[5] = (messageDigest[5] + F) & 0xFFFFFFFF;
	messageDigest[6] = (messageDigest[6] + G) & 0xFFFFFFFF;
	messageDigest[7] = (messageDigest[7] + H) & 0xFFFFFFFF;

	return messageDigest;
}

void SHA256::copyString(char* string) {
	int i;
	for (i = 0; i < strlen(string); i++) {
		tempString[i] = (Uchar) string[i];
	}
	tempString[i] = '\0';
}

// 在需处理的字符串后添加nonce
void SHA256::addNonce(int length) {
	int t = nonce, n=0, digit[100];
	do {
		digit[n] = t % 10 + 48;
		t /= 10;
		n++;
	} while (t != 0);

	for (int i = n-1; i >= 0; i--) {
		tempString[length + i] = (Uchar)digit[n-1-i];
	}
	tempString[length + n] = '\0';
}

void SHA256::setDifficulty(int n) {
	difficulty = n;
}

bool SHA256::validationPoW(WORD* MD) {
	int i;
	WORD target0 = 0x00000000;
	WORD m = difficulty / 8;
	WORD n = difficulty % 8;
	for (i = 0; i < m; i++) {
		if ((MD[i] | target0) != target0) return false;
	}
	WORD result = MD[i] | target0;
	result = result >> ((8 - n) * 4);
	if (result != target0) return false;

	return true;
}

//右旋转
WORD SHA256::ROTR(WORD W, int n) {
	return ((W >> n) & 0xFFFFFFFF) | (W) << (32 - (n));
}

//右移位
WORD SHA256::SHR(WORD W, int n) {
	return ((W >> n) & 0xFFFFFFFF);
}

//六个逻辑函数
WORD SHA256::Conditional(WORD x, WORD y, WORD z) {
	return ((x&y) ^ ((~x)&z));
}
WORD SHA256::Majority(WORD x, WORD y, WORD z) {
	return ((x&y) ^ (x&z) ^ (y&z));
}
WORD SHA256::CSigma_0(WORD x) {
	return (ROTR(x, 2) ^ ROTR(x, 13) ^ ROTR(x, 22));
}
WORD SHA256::CSigma_1(WORD x) {
	return (ROTR(x, 6) ^ ROTR(x, 11) ^ ROTR(x, 25));
}
WORD SHA256::LSigma_0(WORD x) {
	return (ROTR(x, 7) ^ ROTR(x, 18) ^ SHR(x, 3));
}
WORD SHA256::LSigma_1(WORD x) {
	return (ROTR(x, 17) ^ ROTR(x, 19) ^ SHR(x, 10));
}