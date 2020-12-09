#pragma once
#ifndef MY_SHA256_H
#define MY_SHA256_H
#include<cstring>
#include<iostream>
#include<cmath>
using namespace std;
#define SRA(x,n) (((x >> n) & 0xFFFFFFFF)|(x << (32 - n)))
#define SRL(x,n) ((x >> n)&0xFFFFFFFF)
class SHA256 {
public:
	SHA256();
	unsigned int* sha256(unsigned char* s, int len=32);
private:
	void deal(unsigned int* chunk);
	unsigned int get_chunknumber(unsigned char* s, int len);
	unsigned char* appendLength(unsigned char* s, int len);
	unsigned int** divide(unsigned char* s, unsigned int chunk_number);
	unsigned int Ch(unsigned int x, unsigned int y, unsigned int z);
	unsigned int Ma(unsigned int x, unsigned int y, unsigned int z);
	unsigned int LSigma_0(unsigned int x);
	unsigned int LSigma_1(unsigned int x);
	unsigned int SSigma_0(unsigned int x);
	unsigned int SSigma_1(unsigned int x);
	void fresh();
private:
	//ĞÅÏ¢ÕªÒª Message Digestion
	unsigned int MD[8];
};
#endif