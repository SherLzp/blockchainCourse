#include <iostream>
#include <cstring>
#include <vector>
#include <string>
#include <random>
#include <iomanip>
#include <ctime>
using namespace std;

default_random_engine e;
uniform_int_distribution<long long > u(0);

void preprocess(const string&, vector<unsigned char*>&);

inline unsigned int Ch(unsigned int x, unsigned int y, unsigned int z)
{
	return (x & y) ^ ((~x) & z);
}

inline unsigned int Ma(unsigned int x, unsigned int y, unsigned int z)
{
	return (x & y) ^ (x & z) ^ (y & z);
}

inline unsigned int S(int n, unsigned x)
{
	return (x >> n) | (x << (sizeof(x) * 8 - n));
}

inline unsigned int R(int n, unsigned x)
{
	return x >> n;
}

inline unsigned int Sigma0(unsigned int x)
{
	return (S(2, x)) ^ (S(13, x)) ^ (S(22, x));
}

inline unsigned int Sigma1(unsigned int x)
{
	return (S(6, x)) ^ (S(11, x)) ^ (S(25, x));
}

inline unsigned int sigma0(unsigned int x)
{
	return (S(7, x)) ^ (S(18, x)) ^ (R(3, x));
}

inline unsigned int sigma1(unsigned int x)
{
	return (S(17, x)) ^ (S(19, x)) ^ (R(10, x));
}

inline unsigned int tian(unsigned int x, unsigned y)
{
	unsigned long long xx = x;
	unsigned long long yy = y;
	xx = xx + yy;
	if (xx > (unsigned long long)0x100000000)
		return xx % (unsigned long long)0x100000000;
	else
		return xx;
}

inline unsigned int tian(unsigned int x, unsigned y, unsigned z)
{
	unsigned long long xx = x;
	unsigned long long yy = y;
	unsigned long long zz = z;
	xx = xx + yy + zz;
	if (xx > (unsigned long long)0x100000000)
		return xx % (unsigned long long)0x100000000;
	else
		return xx;
}

inline unsigned int toBigEnd(unsigned int x)
{
	unsigned int x0 = x & 0xff;
	unsigned int x1 = x & 0xff00;
	unsigned int x2 = x & 0xff0000;
	unsigned int x3 = x & 0xff000000;
	return (x0 << 24) | (x1 << 8) | (x2 >> 8) | (x3 >> 24);
}

void preprocess(const string& target, vector<unsigned char*>& re)
{
	int length = target.length() * 8 % 512 > 447 ? target.length() * 8 / 512 + 2 : target.length() * 8 / 512 + 1;
	bool flag = target.length() * 8 % 512 > 447;
	unsigned char** result = new unsigned char*[length];
	const unsigned char* temp = (unsigned char*)(target.c_str());
	for (auto i = 0; i < length; i++)
	{
		result[i] = new unsigned char[512 / 8 + 1];
		if (i != length - 1)
		{
			for (size_t j = 0; j < 512 / 8; j++)
			{
				result[i][j] = (unsigned char)(temp + 512 / 8 * i)[j];
			}
			result[i][512 / 8] = '\0';
		}
		else
		{
			for (size_t j = 0; j <= strlen((char*)(temp + 512 / 8 * i)); j++)
			{
				result[i][j] = (unsigned char)(temp + 512 / 8 * i)[j];
			}
		}
	}
	unsigned char padd1[] = {0x80, 0};
	if (flag)
	{
		strcat((char*)result[length - 2], (char*)padd1);
		char padd = 0;
		for (size_t i = strlen((char*)result[length - 2]); i <= 512 / 8; i++)
		{
			result[length - 2][i] = padd;
		}
		for (size_t i = 0; i <= 448 / 8; i++)
		{
			result[length - 1][i] = padd;
		}
	}
	else
	{
		strcat((char*)result[length - 1], (char*)padd1);
		char padd = 0;
		for (int i = strlen((char*)result[length - 1]); i != 448 / 8 + 1; i++)
		{
			result[length - 1][i] = padd;
		}
	}

	//append a length information
	long long leng = target.length();
	leng *= 8;
	unsigned long long mask = 0xff00000000000000;
	for (size_t i = 0; i < 8; i++)
	{
		char cat = ((mask & leng) >> (56 - 8 * i));
		result[length - 1][448 / 8 + i] = cat;
		mask >>= 8;
	}

	for (size_t i = 0; i < length; i++)
	{
		re.push_back(result[i]);
	}
	return;
}

void sha256(const string& target, vector<unsigned int>& ret)
{
	unsigned int hashInitial[8] = {
		0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
	};
	const unsigned int key[64] = {
		0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
		0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
		0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
		0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
		0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
		0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
		0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
		0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
	};

	vector<unsigned char*> blocks;
	preprocess(target, blocks);
	vector<unsigned int> results;
	for (size_t i = 0; i < blocks.size(); i++)
	{
		/*
		blocks[i] ---> unsigned char [512]
		*/
		vector<unsigned int> temp;
		for (size_t j = 0; j < 64; j++)
		{
			if (j < 16)
			{
				temp.push_back(toBigEnd(*((unsigned int*)blocks[i] + j)));
			}
			else
			{
				temp.push_back(sigma1(temp[j - 2]) + temp[j - 7] + sigma0(temp[j - 15]) + temp[j - 16]);
			}
		}
		results.clear();
		for (size_t i = 0; i < 8; i++)
		{
			results.push_back(hashInitial[i]);
		}

		for (size_t j = 0; j < 64; j++)
		{
			unsigned int ch = Ch(results[4], results[5], results[6]);
			unsigned int S1 = Sigma1(results[4]);
			unsigned int ma = Ma(results[0], results[1], results[2]);
			unsigned int S0 = Sigma0(results[0]);
			unsigned int tian1 = results[7] + S1 + ch + key[j] + temp[j];
			unsigned int tian2 = S0 + ma;
			results[7] = results[6];
			results[6] = results[5];
			results[5] = results[4];
			results[4] = results[3] + tian1;
			results[3] = results[2];
			results[2] = results[1];
			results[1] = results[0];
			results[0] = tian1 + tian2;
		}

		hashInitial[0] += results[0];
		hashInitial[1] += results[1];
		hashInitial[2] += results[2];
		hashInitial[3] += results[3];
		hashInitial[4] += results[4];
		hashInitial[5] += results[5];
		hashInitial[6] += results[6];
		hashInitial[7] += results[7];
	}

	for (auto each : hashInitial)
	{
		// cout << hex << each << ends;
		ret.push_back(each);
	}
	// cout << endl;
	delete[](unsigned char**)blocks.at(0);
	return;
}

/*
 * Alerting: function Pow_test() takes tremendous computing resources and time!
 */
void PoW_test()
{
	cout << "Testing Pow, Give any information you want to encode" << endl;
	string origin;
	getline(cin, origin);
	for (int i = 0; i < 8; i++)
	{
		cout << "Proof of work: " << i + 1 << " * 0 at the beginning:" << endl;
		clock_t start = clock();
		string target = string(origin);
		vector<unsigned int> probe;
		bool flag = true;
		while (1)
		{
			long long random = u(e);
			target = origin + to_string(random);
			probe.clear();
			sha256(target, probe);
			int mask = 0xf0000000;
			for (size_t j = 0; j < i ; j++)
			{
				
				//mask is int, so right shift will be signed shifting.
				mask >>= 4;
			}
			flag = !(mask & probe.at(0)) ;
			if (flag)
			{
				clock_t end = clock();
				cout << "Random number found: " << random << endl;
				cout << "The combined string is: " << target << endl;
				cout << "Time cost: " <<(double)(end - start) / CLOCKS_PER_SEC<<" seconds" << endl;
				cout << "Hash result: " << endl<<endl;
				for (auto each : probe)
				{
					cout <<setw(8)<< hex << each << " " ;
				}
				cout << endl << endl;
				break;
			}
		}
	}
}

void dataLock_test()
{
	cout << "Testing dataLock, Give any information you want to encode" << endl;
	string target;
	getline(cin, target);
	char* tempstr = new char[target.length() + 1];
	vector<unsigned int> probe;
	cout << "Result of sha256 of the original version:" << endl;
	sha256(target, probe);
	for (auto each : probe)
		cout << hex << each << " ";
	cout << endl << "After only one byte of the string is incremented:" << endl;
	strcpy(tempstr, target.c_str());
	for (int i = 0; i < target.length(); i++)
	{
		tempstr[i] += 1;
		probe.clear();
		sha256(string(tempstr), probe);
		cout << "Shifted string: " << tempstr << endl<<endl;
		for (auto each : probe)
			cout << hex << each << " ";
		cout << endl<<endl;
		tempstr[i] -= 1;
	}
	cout << "Extend original string by one byte:" << endl << endl;;
	tempstr[target.length()] = 0;
	tempstr[target.length() - 1] = u(e) % 128;
	probe.clear();
	sha256(string(tempstr), probe);
	for (auto each : probe)
		cout << hex << each << " ";
	cout << endl<<endl;
	cout << "Cut original string by one byte:" << endl << endl;
	tempstr[target.length() - 2] = 0;
	probe.clear();
	sha256(string(tempstr), probe);
	for (auto each : probe)
		cout << hex << each << " ";
	cout << endl;
	cout << "Test done." << endl;
	delete[] tempstr;
}

int main()
{
	while (true)
	{
		cout <<
			"Welcome:\n\t[1] Input A for testing datalock in block chain \t[2] Input B for testing PoW\n\t[3] Input others to quit."
			<< endl;
		char get;
		cin >> get;
		getchar();
		switch (get)
		{
		case 'A':
		case'a': dataLock_test();
			break;
		case 'B':
		case 'b': PoW_test();
			break;
		default: cout << "Good bye." << endl;
			return 0;
		}
	}
}
