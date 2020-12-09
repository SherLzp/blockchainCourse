#pragma once
#ifndef _SHA256_H
#define _SHA256_H

#include<iostream>
using namespace std;

typedef unsigned int u_int32;
//logical functions
#define Ch(x,y,z) ((x&y)^((~x)&z))
#define Ma(x,y,z) ((x&y)^(x&z)^(y&z))
#define Sigma0(x) (S(x,2)^S(x,13)^S(x,22))
#define Sigma1(x) (S(x,6)^S(x,11)^S(x,25))
#define sigma_0(x) (S(x,7)^S(x,18)^R(x,3))
#define sigma_1(x) (S(x,17)^S(x,19)^R(x,10))
//logical oprations
u_int32 S(u_int32 W, int n);
u_int32 R(u_int32 W, int n); 
//64 constants
const u_int32 K[64] = {
		0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
		0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
		0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
		0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
		0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
		0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
		0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
		0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
};

//Message Digest
struct M_Dige {
	u_int32 H[8];
};

//SHA256
class SHA256
{
public:
	SHA256() {init_hash();};
	~SHA256() {};
	M_Dige DEAL(u_int32 W[16]);//deal process
private:
	void init_hash(); 
	M_Dige MD;
};

#endif
