#include<iostream>
#include<vector>
#include<string>
#include"SHA256.h"
using namespace std;

unsigned int h[8] = { 0x6a09e667
, 0xbb67ae85
, 0x3c6ef372
, 0xa54ff53a
, 0x510e527f
, 0x9b05688c
, 0x1f83d9ab
, 0x5be0cd19 };

unsigned int k[64]{
   0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
   0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
   0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
   0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
   0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
   0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
   0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
   0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
};
char append0 = 0x80;
char append1 = 0x0;
unsigned long len = 0;
vector<unsigned char> sha256;
vector<chunk> chunks;
sha res;
int main() {
	string msg;
	while (1) {
		res = sha();
		sha256.clear();
		chunks.clear();
		getline(cin, msg);
		len = msg.size() * 8;
		for (auto ch : msg) {
			sha256.push_back(ch);
		}
		//append
		sha256.push_back(append0);
		while (sha256.size() * 8 % 512 != 448) {
			sha256.push_back(append1);
		}
		vector<unsigned char> lens;
		for (int i = 0; i < 8; i++) {
			lens.push_back((unsigned char)len & 0x00000000000000ff);
			len >>= 8;
		}
		while (!lens.empty()) {
			sha256.push_back(lens.back());
			lens.pop_back();
		}
		for (int i = 0; i < sha256.size() / 64; i++) {
			chunks.push_back(chunk(i, sha256));
			chunks[i].process_chunck();
		}
		for (int i = 0; i < 8; i++) {
			printf("%08x", res.h[i]);
		}
		cout << endl;
		system("pause");
	}
}

unsigned int rotate_right(unsigned int num, int n) {
	
	return num>>n|num<<(32-n);
}

void sha::update(unsigned int val[8]) {
	for (int i = 0; i < 8;i++) {
		h[i] += val[i];
	}
}

unsigned int* chunk::process_chunck() {
	unsigned int w[64],hc[8];
	for (int i = 0; i < 64; i+=4) {
		w[i/4] = ((unsigned int)value[i] << 24) + ((unsigned int)value[i + 1] << 16) + ((unsigned int)value[i + 2] << 8) + (unsigned int)value[i + 3];
	}
	for (int i = 16; i < 64; i++) {
		unsigned int s0, s1;
		s0 =(w[i - 15]>>7| w[i - 15] <<(32- 7)) ^ (w[i - 15] >> 18 | w[i - 15] << (32 - 18)) ^ (w[i - 15] >> 3);
		s1= (w[i - 2] >> 17 | w[i - 2] << (32 - 17)) ^ (w[i - 2] >> 19 | w[i - 2] << (32 - 19)) ^ (w[i - 2] >> 10);
		w[i] = w[i - 16] + s0 + w[i - 7] + s1;
	}
	for (int i = 0; i < 8; i++)
		hc[i] = res.h[i];
	for (int i = 0; i < 64; i++) {
		unsigned int s0, s1,maj,t2,t1,ch;
		s0 = rotate_right(hc[0], 2) ^ rotate_right(hc[0], 13) ^ rotate_right(hc[0], 22);
		maj = (hc[0] & hc[1]) ^ (hc[0] & hc[2]) ^ (hc[1] & hc[2]);
		t2 = s0 + maj;
		s1 = (hc[4]>> 6|hc[4]<<(32-6)) ^(hc[4]>> 11|hc[4]<<(32-11)) ^ rotate_right(hc[4], 25);
		ch = (hc[4] & hc[5]) ^ ((~hc[4])&hc[6]);
		t1 = hc[7] + s1 + ch + k[i] + w[i];
		hc[7] = hc[6];
		hc[6] = hc[5];
		hc[5] = hc[4];
		hc[4] = hc[3] + t1;
		hc[3] = hc[2];
		hc[2] = hc[1];
		hc[1] = hc[0];
		hc[0] = t1 + t2;
	}
	res.update(hc);
	return hc;
}