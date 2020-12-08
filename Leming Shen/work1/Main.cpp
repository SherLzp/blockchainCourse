#include <iostream>
#include <algorithm>
#include <string>
#include <vector>

using namespace std;

unsigned int init_hash[8] = {0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19};
unsigned int key[64] = {0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b,
						0x59f111f1, 0x923f82a4, 0xab1c5ed5,
						0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74,
						0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
						0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f,
						0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
						0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3,
						0xd5a79147, 0x06ca6351, 0x14292967,
						0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354,
						0x766a0abb, 0x81c2c92e, 0x92722c85,
						0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
						0xd6990624, 0xf40e3585, 0x106aa070,
						0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3,
						0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
						0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa,
						0xa4506ceb, 0xbef9a3f7, 0xc67178f2};

string Input()
{
	cout << "\n\nThis program is developed by Leming Shen, majoring in Software Engineering," << endl;
	cout << "Copyright (c) 2020 College of Computer Science and Technology, Zhejiang University." << endl;
	cout << "Email to ZJU.SLM@gmail.com for more information. All rights reserved." << endl
		 << endl;

	cout << "Now please input a string that you want to encrypt." << endl;

	string result;
	getline(cin, result);

	return result;
}

unsigned int loop_right(unsigned int value, int bits)
{
	return ((value >> bits) | (value << (32 - bits)));
}

vector<unsigned char> to_hex(long long x)
{
	vector<unsigned char> result;

	while (x > 0)
	{
		result.push_back(static_cast<unsigned char>(x));
		x >>= 8;
	}

	int left = 8 - result.size();
	for (int i = 0; i < left; i++)
	{
		result.push_back(0x00);
	}

	reverse(result.begin(), result.end());

	return result;
}

vector<unsigned char> preprocess(string source)
{
	vector<unsigned char> result;
	int length = source.length() * 8;

	for (int i = 0; i < source.size(); i++)
	{
		result.push_back(static_cast<unsigned char>(source[i]));
	}

	result.push_back(0x80);

	int left = (((length + 8) % 512 > 448) ? (960 - (length + 8) % 512) : (448 - (length + 8) % 512)) / 8;
	for (int i = 0; i < left; i++)
	{
		result.push_back(0x00);
	}

	vector<unsigned char> right = to_hex(length);

	for (unsigned char element : right)
	{
		result.push_back(element);
	}

	return result;
}

unsigned int ch(unsigned int x, unsigned int y, unsigned int z)
{
	return (x & y) ^ (~x & z);
}

unsigned int ma(unsigned int x, unsigned int y, unsigned int z)
{
	return ((x & y) ^ (x & z) ^ (y & z));
}

unsigned int sigma0_upper(unsigned int x)
{
	return (loop_right(x, 2) ^ loop_right(x, 13) ^ loop_right(x, 22));
}

unsigned int sigma1_upper(unsigned int x)
{
	return (loop_right(x, 6) ^ loop_right(x, 11) ^ loop_right(x, 25));
}

unsigned int sigma0_lower(unsigned int x)
{
	return (loop_right(x, 7) ^ loop_right(x, 18) ^ (x >> 3));
}

unsigned int sigma1_lower(unsigned int x)
{
	return (loop_right(x, 17) ^ loop_right(x, 19) ^ (x >> 10));
}

vector<unsigned char> iterate(vector<unsigned char> source)
{
	int iterate_time = source.size() / 64;
	vector<unsigned int> h;
	vector<unsigned char> result;

	for (int j = 0; j < 8; j++)
	{
		h.push_back(init_hash[j]);
	}

	for (int i = 0; i < iterate_time; i++)
	{
		vector<unsigned char> chunk;
		vector<unsigned int> map(h);

		for (int j = 0; j < 64; j++)
		{
			chunk.push_back(source[i * 64 + j]);
		}

		/* the first 16 words */
		vector<unsigned int> w;
		for (int j = 0; j < chunk.size() / 4; j++)
		{
			unsigned int temp = chunk[j * 4];

			temp <<= 8;
			temp += chunk[j * 4 + 1];
			temp <<= 8;
			temp += chunk[j * 4 + 2];
			temp <<= 8;
			temp += chunk[j * 4 + 3];

			w.push_back(temp);
		}

		/* the remaining 48 words */
		for (int j = 16; j < 64; j++)
		{
			unsigned int temp = sigma1_lower(w[j - 2]) + w[j - 7] + sigma0_lower(w[j - 15]) + w[j - 16];
			w.push_back(temp);
		}

		for (int j = 0; j < 64; j++)
		{
			vector<unsigned int> original(map);
			unsigned int wk = w[j] + key[j];
			unsigned int wkchh = ch(original[4], original[5], original[6]) + original[7] + wk;
			unsigned int wkchhsigma = sigma1_upper(original[4]) + wkchh;
			unsigned int wkchhsigmama = wkchhsigma + ma(original[0], original[1], original[2]);

			map[0] = sigma0_upper(original[0]) + wkchhsigmama;
			map[1] = original[0];
			map[2] = original[1];
			map[3] = original[2];
			map[4] = original[3] + wkchhsigma;
			map[5] = original[4];
			map[6] = original[5];
			map[7] = original[6];
		}

		for (int j = 0; j < 8; j++)
		{
			h[j] += map[j];
		}
	}

	for (int i = 0; i < h.size(); i++)
	{
		unsigned int temp = h[i];

		result.push_back((temp & 0xff000000) >> 24);
		result.push_back((temp & 0x00ff0000) >> 16);
		result.push_back((temp & 0x0000ff00) >> 8);
		result.push_back(temp);
	}

	return result;
}

int main()
{
	string input;
	vector<unsigned char> output;

	while (true)
	{
		input = Input();
		vector<unsigned char> source = preprocess(input);

		output = iterate(source);

		cout << "The encrpted result is: ";
		for (int i = 0; i < output.size(); i++)
		{
			cout << hex << (int)output[i];
		}
		cout << endl;
	}

	system("pause");
	return 0;
}
