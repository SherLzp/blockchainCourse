#include "SHA256.h"

unsigned int shr(unsigned int x, int n)
{
	return (x << (32-n)) + (x >> n);
}

unsigned int sigma0(unsigned int x)
{
	return shr(x, 7) ^ shr(x, 18) ^ (x >> 3);
}

unsigned int sigma1(unsigned int x)
{
	return shr(x, 17) ^ shr(x, 19) ^ (x >> 10);
}

unsigned int Ch(unsigned int x, unsigned int y, unsigned int z)
{
	return (x & y) ^ ( (~x) & z);
}

unsigned int Ma(unsigned int x, unsigned int y, unsigned int z)
{
	return (x & y) ^ (y & z) ^ (z & x);
}

unsigned int Sigma0(unsigned int x)
{
	return shr(x, 2) ^ shr(x, 13) ^ shr(x, 22);
}

unsigned int Sigma1(unsigned int x)
{
	return shr(x, 6) ^ shr(x, 11) ^ shr(x, 25);
}

unsigned int getBlockNum(unsigned int length)
{
	return (length + 8) / 64 + 1;
}

unsigned int * preProcessing(unsigned char * data, unsigned int length)
{
	unsigned int prelength = length << 3;
	unsigned int blockNum = getBlockNum(length);
	unsigned int* blocks = new unsigned int[16 * blockNum];
	unsigned char* ptr = (unsigned char*)blocks;
	for (unsigned int i = 0; i <= length - 1; i++) ptr[i] = data[i];
	blocks[16 * blockNum - 1] = length; // ?
	ptr[length++] = 0x80;
	while (length % 64 != 56) ptr[length++] = 0x00;
	for (unsigned int i = 0; i <= 3; i++) ptr[length + i] = 0x00;
	ptr[length + 4] = (unsigned char)(prelength >> 24);
	ptr[length + 5] = (unsigned char)((prelength << 8) >> 24);
	ptr[length + 6] = (unsigned char)((prelength << 16) >> 24);
	ptr[length + 7] = (unsigned char)((prelength << 24) >> 24);
	return blocks;
}

void getNewVector(unsigned int * vector, unsigned int * block)
{
	unsigned int* words = new unsigned int[64];
	produceWord(words, block);
	unsigned int a = vector[0];
	unsigned int b = vector[1];
	unsigned int c = vector[2];
	unsigned int d = vector[3];
	unsigned int e = vector[4];
	unsigned int f = vector[5];
	unsigned int g = vector[6];
	unsigned int h = vector[7];
	for (int i = 0; i <= 63; i++) {
		unsigned int ch = Ch(e, f, g);
		unsigned int temp = words[i] + SHA256_K[i] + h + ch + Sigma1(e);
		unsigned int ma = Ma(a, b, c) + Sigma0(a);
		h = g;
		g = f;
		f = e;
		e = d + temp;
		d = c;
		c = b;
		b = a;
		a = ma + temp;
		//printf("%2d:%X %X %X %X %X %X %X %X\n", i, a, b, c, d, e, f, g, h);
	}
	vector[0] += a;
	vector[1] += b;
	vector[2] += c;
	vector[3] += d;
	vector[4] += e;
	vector[5] += f;
	vector[6] += g;
	vector[7] += h;
	return;
}

void produceWord(unsigned int * word, unsigned int * block)
{
	for (int i = 0; i <= 15; i++)
	{
		word[i] = reverse(block[i]);
		//printf("%X\n", word[i]);
	}
	for (int i = 16; i <= 63; i++)
	{
		word[i] = sigma1(word[i - 2]) + word[i - 7] + sigma0(word[i - 15]) + word[i - 16];
		//printf("%X\n", word[i]);
	}
	return;
}

void SHA256(unsigned char * data, unsigned int length, unsigned int * vector)
{
	unsigned int* block = preProcessing(data, length);
	unsigned int blockNum = getBlockNum(length);
	for (int i = 0; i <= 7; i++) vector[i] = SHA256_V[i];
	// printf("0/%u : ", blockNum);
	// for (int i = 0; i <= 7; i++) printf("%X ", vector[i]);
	// printf("\n");
	for (unsigned int i = 0; i <= blockNum - 1; i++)
	{
		getNewVector(vector, block + i * 8);
		// printf("%u/%u : ", i+1, blockNum);
		//for (int i = 0; i <= 7; i++) printf("%X ", vector[i]);
		// printf("\n");
	}
	return;
}


void testOutput(unsigned char * data, unsigned int length)
{
	for (unsigned int i = 0; i <= length - 1; i++)
	{
		printf("%X ", data[i]);
	}
	printf("\n");
	return;
}

unsigned int reverse(unsigned int x)
{

	unsigned char a = x >> 24;
	unsigned char b = x << 8 >> 24;
	unsigned char c = x << 16 >> 24;
	unsigned char d = x << 24 >> 24;
	return (d << 24) + (c << 16) + (b << 8) + a;
}
