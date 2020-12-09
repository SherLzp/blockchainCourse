#include <cstdio>
#include <ctime>
#include <fstream>
#include <iostream>
#include <iomanip>
#include <string>

using namespace std;

#define rightrotate(w, n) ((w >> n) | (w) << (32-(n)))

void SHA256(uint32_t* hash, const string& plaintext)
{
	static uint32_t oriHash[8] = {
		0x6a09e667, 0xbb67ae85,
		0x3c6ef372 ,0xa54ff53a,
		0x510e527f ,0x9b05688c,
		0x1f83d9ab ,0x5be0cd19
	};
	static uint32_t constant[64] = {
		0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
		0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
		0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
		0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
		0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
		0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
		0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
		0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
	};

	// 预处理 {
	size_t len = plaintext.length();
	unsigned char* str = new unsigned char[plaintext.length() + 128];
	memcpy_s(str, sizeof(unsigned char) * plaintext.length(),
		plaintext.c_str(), sizeof(unsigned char) * plaintext.length());

	memcpy_s(hash, sizeof(uint32_t) * 8, oriHash, sizeof(uint32_t) * 8);

	// 补1位1
	str[len++] = (unsigned char)0x80;

	// 根据(1+PlaintextBitLen+SuffixBitLen) % 512 == 448
	// 计算最小非负SuffixBitLen
	int suffixBitLen = (plaintext.length() * 8 + 1) % 512 - 448;
	if (suffixBitLen < 0)
		suffixBitLen *= -1;
	else
		suffixBitLen = 512 - suffixBitLen;
	// 补suffixBitLen个0
	suffixBitLen /= 8;
	while (suffixBitLen--)
		str[len++] = 0x0;

	// 补64位的长度
	uint64_t len64 = (uint64_t)plaintext.length() << 3;
	unsigned char* cp = (unsigned char*)&len64;
	for (size_t i = 0; i < 8; i++, cp++)
		str[len + 7 - i] = *cp; // 小端机器专用，大端机器需要更改
	len += 8;
	// } 预处理结束

	// 计算 {
	size_t chunkLen = len / 64;
	uint32_t w[64];
	for (size_t i = 0; i < chunkLen; i++)
	{
		size_t j, k;
		for (j = i * 64, k = 0; k < 16; j += 4, k++)
			w[k] = ((uint32_t)str[j] << 24) |
			((uint32_t)str[j + 1] << 16) |
			((uint32_t)str[j + 2] << 8) |
			((uint32_t)str[j + 3]);
		for (k = 16; k < 64; k++)
		{
			uint32_t s0 = rightrotate(w[k - 15], 7) ^ rightrotate(w[k - 15], 18) ^ (w[k - 15] >> 3);
			uint32_t s1 = rightrotate(w[k - 2], 17) ^ rightrotate(w[k - 2], 19) ^ (w[k - 2] >> 10);
			w[k] = w[k - 16] + s0 + w[k - 7] + s1;
		}

		uint32_t a = hash[0]; uint32_t b = hash[1]; uint32_t c = hash[2]; uint32_t d = hash[3];
		uint32_t e = hash[4]; uint32_t f = hash[5]; uint32_t g = hash[6]; uint32_t h = hash[7];
		for (k = 0; k < 64; k++) {
			uint32_t s_1 = rightrotate(e, 6) ^ rightrotate(e, 11) ^ rightrotate(e, 25);
			uint32_t ch = (e & f) ^ ((~e) & g);
			uint32_t temp1 = h + s_1 + ch + constant[k] + w[k];
			uint32_t s_0 = rightrotate(a, 2) ^ rightrotate(a, 13) ^ rightrotate(a, 22);
			uint32_t maj = (a & b) ^ (a & c) ^ (b & c);
			uint32_t temp2 = s_0 + maj;
			h = g;
			g = f;
			f = e;
			e = d + temp1;
			d = c;
			c = b;
			b = a;
			a = temp1 + temp2;
		}
		hash[0] += a; hash[1] += b; hash[2] += c; hash[3] += d;
		hash[4] += e; hash[5] += f; hash[6] += g; hash[7] += h;
	}
	// } 计算结束

	delete[] str;
}

int main()
{
	uint32_t* cyphertext = new uint32_t[8];
	string plaintext, filename;
	clock_t start, end;

	cin >> filename;
	ifstream in(filename.append(".txt"), ios::in);
	if (!in.is_open())
		return 1;
	while (!in.eof())
	{
		getline(in, plaintext);
		if (plaintext.empty())break;
		cout << "明文：" << plaintext << endl;

		start = clock();
		SHA256(cyphertext, plaintext);
		end = clock();

		for (size_t i = 0; i < 8; i++)
			cout << hex << setw(8) << setfill('0') << cyphertext[i] << ' ';
		cout << "用时：" << dec << (end - start) << "ms" << endl;
		
		// 模拟挖矿 {
		//if ((cyphertext[0] & 0xfc000000) == 0)
			//break;
		// }
	}
	in.close();
	
	delete[] cyphertext;

	return 0;
}
