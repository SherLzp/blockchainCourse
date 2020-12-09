#define _CRT_SECURE_NO_WARNINGS
#include"SHA256.h"




const uint32 SHA256::sha256_64[64] =
{
	0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
	0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
	0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
	0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
	0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
	0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
	0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
	0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
};

const uint32 SHA256::sha256_8[8] =
{
	0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
};

void SHA256::init()
{
	for (uint32 i = 0;i < 8;i++)
		this->MD[i] = sha256_8[i];
	this->len_of_data = 0;
	this->len_of_bit = 0;
}

void SHA256::update(const uint8 input[], uint32 len)
{
	for (uint32 i = 0; i < len; ++i)
	{
		this->data[this->len_of_data] = input[i];
		this->len_of_data++;
		if (this->len_of_data == 64)
		{
			this->reform();
			this->len_of_bit += 512;
			this->len_of_data = 0;
		}
	}
}
void SHA256::padding()
{
	uint32 i = this->len_of_data;

	if (this->len_of_data < 56)
	{
		this->data[i] = 0x80;
		i++;
		while (i < 56)
		{
			this->data[i] = 0x00;
			i++;
		}
	}
	else
	{
		this->data[i] = 0x80;
		i++;
		while (i < 64)
		{
			this->data[i] = 0x00;
			i++;
		}
		this->reform();
		memset(this->data, 0, 56);
	}
	this->len_of_bit += this->len_of_data * 8;
	for (uint32 j = 0;j < 8;j++)
		this->data[63 - j] = this->len_of_bit >> (j * 8);
	this->reform();
}

void SHA256::convert(uint8 result[])
{
	this->padding();
	for (uint32 i = 0;i < 4;i++)
		for (uint32 j = 0;j < 8;j++)
			result[i + j * 4] = (this->MD[j] >> (24 - i * 8)) & 0x000000ff;
}

void SHA256::reform() 
{
	uint32 a, b, c, d, e, f, g, h;
	uint32 i, j;
	uint32 tmp[64];

	for (i = 0, j = 0; i < 16; ++i, j += 4)
		tmp[i] = (this->data[j] << 24) | (this->data[j + 1] << 16) | (this->data[j + 2] << 8) | (this->data[j + 3]);
	for (; i < 64; ++i)
		tmp[i] = SHA256_F4(tmp[i - 2]) + tmp[i - 7] + SHA256_F3(tmp[i - 15]) + tmp[i - 16];

	a = this->MD[0];
	b = this->MD[1];
	c = this->MD[2];
	d = this->MD[3];
	e = this->MD[4];
	f = this->MD[5];
	g = this->MD[6];
	h = this->MD[7];


	uint32 t1, t2;
	for (i = 0; i < 64; i++)
	{
		t1 = h + SHA256_F2(e) + SHA256_CH(e, f, g) + sha256_64[i] + tmp[i];
		t2 = SHA256_F1(a) + SHA256_MAJ(a, b, c);
		h = g;
		g = f;
		f = e;
		e = d + t1;
		d = c;
		c = b;
		b = a;
		a = t1 + t2;
	}

	this->MD[0] += a;
	this->MD[1] += b;
	this->MD[2] += c;
	this->MD[3] += d;
	this->MD[4] += e;
	this->MD[5] += f;
	this->MD[6] += g;
	this->MD[7] += h;
}

std::string Convert(std::string input)
{
	SHA256 sha;

	char * str = (char *)malloc(sizeof(char)*(input.length() + 1));
	int i = 0;

	while (i < input.length())
	{
		str[i] = input[i];
		i++;
	}
	str[i] = '\0';

	uint8 data[32];
	char result[2 * 32 + 1];
	uint8 * text = (uint8 *)str;
	sha.update(text, strlen((const char*)text));
	sha.convert(data);

	for (int i = 0; i < 32; ++i)
		sprintf(result + 2 * i, "%02X", data[i]);

	return (string)result;
}
