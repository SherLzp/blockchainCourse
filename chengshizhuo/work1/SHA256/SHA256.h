#pragma once
#include <string>
#include <iostream>

#define Ch(x,y,z) ((x&y)^((~x)&z))
#define Ma(x,y,z) ((x&y)^(x&z)^(y&z))
#define ROTR(x,n) ((x<<(32-n))|(x>>n))
#define SHR(x,n) ((x)>>(n))
#define Sigma_0(x) (ROTR(x,2)^ROTR(x,13)^ROTR(x,22))
#define Sigma_1(x) (ROTR(x,6)^ROTR(x,11)^ROTR(x,25))
#define _sigma_0(x) (ROTR(x,7)^ROTR(x,18)^SHR(x,3))
#define _sigma_1(x) (ROTR(x,17)^ROTR(x,19)^SHR(x,10))


#define CHUNK_LENGTH 512


class SHA256
{
public:
	SHA256() { init(); }
	~SHA256() {}
	void encryptMessage(void* src, __int64 c_num);
	//std::string message_digest;
	std::string message_digest;
	
	uint32_t H[8];
private:
	unsigned int L2B(unsigned int num);
	void init();
	void processChunk(unsigned int chunk[]); //    break chunk into sixteen 32-bit big-endian words w[0..15]
	
};

