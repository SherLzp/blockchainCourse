#pragma once
#include<iostream>
#include<string>
#include<string.h>
#include<vector>

#define _CRT_SECURE_NO_WARNINGS

#define RL(a,b) (((a) << (b)) | ((a) >> (32-(b))))
#define RR(a,b) (((a) >> (b)) | ((a) << (32-(b))))

#define SHA256_CH(x,y,z) (((x) & (y)) ^ (~(x) & (z)))
#define SHA256_MAJ(x,y,z) (((x) & (y)) ^ ((x) & (z)) ^ ((y) & (z)))
#define SHA256_F1(x) (RR(x,2) ^ RR(x,13) ^ RR(x,22))
#define SHA256_F2(x) (RR(x,6) ^ RR(x,11) ^ RR(x,25))
#define SHA256_F3(x) (RR(x,7) ^ RR(x,18) ^ ((x) >> 3))
#define SHA256_F4(x) (RR(x,17) ^ RR(x,19) ^ ((x) >> 10))

typedef unsigned char uint8;
typedef unsigned int uint32;
typedef unsigned long long uint64;

using namespace std;

std::string Convert(std::string input);

class SHA256 
{
protected:
	const static uint32 sha256_64[64];
	const static uint32 sha256_8[8];
public:
	SHA256() {
		init();
	}
	~SHA256()
	{

	}
	void update(const uint8 input[], uint32 len);
	void convert(uint8 result[]);
private:
	void init();
	void padding();
	void reform();
	uint8 data[64];
	uint32 len_of_data;
	uint64 len_of_bit;
	uint32 MD[8];
};