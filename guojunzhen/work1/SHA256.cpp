#include <iostream>
using namespace std;
#define MAXSIZE 1024
#define CH(length, y, z) ((length & y) ^ ((~length) & z))
#define MAJ(length, y, z) ((length & y) ^ (length & z) ^ (y & z))
#define BSIG0(length) (ROTR(length, 2) ^ ROTR(length, 13) ^ ROTR(length, 22))
#define BSIG1(length) (ROTR(length, 6) ^ ROTR(length, 11) ^ ROTR(length, 25))
#define SSIG0(length) (ROTR(length, 7) ^ ROTR(length, 18) ^ SHR(length, 3))
#define SSIG1(length) (ROTR(length, 17) ^ ROTR(length, 19) ^ SHR(length, 10))

typedef unsigned int WORD;
struct MD
{
	WORD h[8];
};

class SHA256
{
public:
	SHA256() {};
	~SHA256() {};
	MD encryption(WORD MS[16]);
private:
	WORD ROTR(WORD MS, int n);
	WORD SHR(WORD MS, int n);
private:
	MD MD;
};

const WORD K[64] = {
	0x428a2f98,
	0x71374491,
	0xb5c0fbcf,
	0xe9b5dba5,
	0x3956c25b,
	0x59f111f1,
	0x923f82a4,
	0xab1c5ed5,
	0xd807aa98,
	0x12835b01,
	0x243185be,
	0x550c7dc3,
	0x72be5d74,
	0x80deb1fe,
	0x9bdc06a7,
	0xc19bf174,
	0xe49b69c1,
	0xefbe4786,
	0x0fc19dc6,
	0x240ca1cc,
	0x2de92c6f,
	0x4a7484aa,
	0x5cb0a9dc,
	0x76f988da,
	0x983e5152,
	0xa831c66d,
	0xb00327c8,
	0xbf597fc7,
	0xc6e00bf3,
	0xd5a79147,
	0x06ca6351,
	0x14292967,
	0x27b70a85,
	0x2e1b2138,
	0x4d2c6dfc,
	0x53380d13,
	0x650a7354,
	0x766a0abb,
	0x81c2c92e,
	0x92722c85,
	0xa2bfe8a1,
	0xa81a664b,
	0xc24b8b70,
	0xc76c51a3,
	0xd192e819,
	0xd6990624,
	0xf40e3585,
	0x106aa070,
	0x19a4c116,
	0x1e376c08,
	0x2748774c,
	0x34b0bcb5,
	0x391c0cb3,
	0x4ed8aa4a,
	0x5b9cca4f,
	0x682e6ff3,
	0x748f82ee,
	0x78a5636f,
	0x84c87814,
	0x8cc70208,
	0x90befffa,
	0xa4506ceb,
	0xbef9a3f7,
	0xc67178f2,
};

SHA256 s = SHA256();
MD md;
WORD MS[MAXSIZE];
WORD Message[16];

MD SHA256::encryption(WORD Message[16])
{
	MD.h[0] = 0x6a09e667;
	MD.h[1] = 0xbb67ae85;
	MD.h[2] = 0x3c6ef372;
	MD.h[3] = 0xa54ff53a;
	MD.h[4] = 0x510e527f;
	MD.h[5] = 0x9b05688c;
	MD.h[6] = 0x1f83d9ab;
	MD.h[7] = 0x5be0cd19;
	WORD a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, g = 0, h = 0;
	a = MD.h[0];
	b = MD.h[1];
	c = MD.h[2];
	d = MD.h[3];
	e = MD.h[4];
	f = MD.h[5];
	g = MD.h[6];
	h = MD.h[7];
	WORD MS[64];
	int i;
	for (i = 0; i < 16; i++)
		MS[i] = Message[i];
	for (i = 16; i < 64; i++)
		MS[i] = SSIG1(MS[i - 2]) + MS[i - 7] + SSIG0(MS[i - 15]) + MS[i - 16];
	WORD temp1 = 0, temp2 = 0;
	for (i = 0; i < 64; i++)
	{
		temp1 = h + BSIG1(e) + CH(e, f, g) + K[i] + MS[i];
		temp2 = BSIG0(a) + MAJ(a, b, c);
		h = g;
		g = f;
		f = e;
		e = d + temp1;
		d = c;
		c = b;
		b = a;
		a = temp1 + temp2;
	}
	MD.h[0] = (MD.h[0] + a) % 0xFFFFFFFF;
	MD.h[1] = (MD.h[1] + b) % 0xFFFFFFFF;
	MD.h[2] = (MD.h[2] + c) % 0xFFFFFFFF;
	MD.h[3] = (MD.h[3] + d) % 0xFFFFFFFF;
	MD.h[4] = (MD.h[4] + e) % 0xFFFFFFFF;
	MD.h[5] = (MD.h[5] + f) % 0xFFFFFFFF;
	MD.h[6] = (MD.h[6] + g) % 0xFFFFFFFF;
	MD.h[7] = (MD.h[7] + h) % 0xFFFFFFFF;

	return MD;
}

WORD SHA256::ROTR(WORD MS, int n)
{
	return ((MS >> n) & 0xFFFFFFFF) | (MS) << (32 - (n));
}

WORD SHA256::SHR(WORD MS, int n)
{
	return ((MS >> n) & 0xFFFFFFFF);
}

void padbit(unsigned char data[MAXSIZE])
{
	unsigned char temp[MAXSIZE];
	int temp1 = 0, temp2 = 0, temp3 = 0, temp4 = 0;
	unsigned __int64 length = strlen((char *)data);
	int i, j;
	for (i = 0; i < length; i++)
		temp[i] = data[i];
	temp[length] = 128;
	for (i = length + 1; i < length + (55 - length) % 64 + 1; i++)
		temp[i] = 0;
	for (i = 1; i <= 8; i++)
		temp[(((length + 8) / 64 + 1) * 64) - i] = (8 * length >> 8 * (i - 1));
	for (i = 0; i < 64; i++)
	{
		temp1 = temp[4 * i + 0];
		temp2 = temp[4 * i + 1];
		temp3 = temp[4 * i + 2];
		temp4 = temp[4 * i + 3];
		MS[i] = (temp1 << 24) + (temp2 << 16) + (temp3 << 8) + temp4;
	}
	for (i = 0; i <= (length + 8) / 64; i++)
		for (j = 0; j < 16; j++)
			Message[j] = MS[(16 * i) + j];
}

int main()
{
	unsigned char input[MAXSIZE];

	cout << "please input:" << endl;
	while (1)
	{
		cin >> input;
		padbit(input);
		md = s.encryption(Message);
		for (int i = 0; i < 8; i++)
			cout << hex << md.h[i];
		cout << endl;
	}

	system("pause");
	return 0;
}