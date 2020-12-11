#pragma once
#include<vector>

using namespace std;
unsigned int rotate_right(unsigned int num, int n);

class sha {
public:
	unsigned int h[8];
	sha() {
		h[0] = 0x6a09e667;
		h[1] = 0xbb67ae85;
		h[2] = 0x3c6ef372;
		h[3] = 0xa54ff53a;
		h[4] = 0x510e527f;
		h[5] = 0x9b05688c;
		h[6] = 0x1f83d9ab;
		h[7] = 0x5be0cd19;
	}
	void update(unsigned int val[8]);
	unsigned int* get_val() {
		return h;
	}
};
class chunk {
public:
	unsigned char value[64];
	chunk(int index, vector<unsigned char>&origin) {
		int j = 0;
		for (int i = 64 * index; i < 64 * index + 64; i++) {
			value[j] = origin[i];
			j++;
		}
	}
	unsigned int* process_chunck();
};
