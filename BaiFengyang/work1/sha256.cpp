#include <iostream>
#include <string>
#include <algorithm>
#include <iomanip>
using namespace std;

const int h0[10] = {0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19};
const int key[70] = {0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2};

string str_to_binary(string s)
{
    string res;
    for (int i = 0; i < s.length(); i++)
    {
        int x = s[i];
        string tmp;
        for (int j = 0; j < 8; j++)
        {
            if (x % 2)
                tmp += '1';
            else
                tmp += '0';
            x /= 2;
        }
        reverse(tmp.begin(), tmp.end());
        res += tmp;
    }
    return res;
}

string int_to_binary(long long x)
{
    string tmp;
    for (int i = 0; i < 64; i++)
    {
        if (x % 2)
            tmp += '1';
        else
            tmp += '0';
        x /= 2;
    }
    reverse(tmp.begin(), tmp.end());
    return tmp;
}

inline int sigma1(unsigned int x)
{
    int a, b, c;
    a = (x >> 17) | (x << (32 - 17));
    b = (x >> 19) | (x << (32 - 19));
    c = x >> 10;
    return a ^ b ^ c;
}

inline int sigma0(unsigned int x)
{
    int a, b, c;
    a = (x >> 7) | (x << (32 - 7));
    b = (x >> 18) | (x << (32 - 18));
    c = x >> 3;
    return a ^ b ^ c;
}

inline int SIGMA0(unsigned int x)
{
    int a, b, c;
    a = (x >> 2) | (x << (32 - 2));
    b = (x >> 13) | (x << (32 - 13));
    c = (x >> 22) | (x << (32 - 22));
    return a ^ b ^ c;
}

inline int SIGMA1(unsigned int x)
{
    int a, b, c;
    a = (x >> 6) | (x << (32 - 6));
    b = (x >> 11) | (x << (32 - 11));
    c = (x >> 25) | (x << (32 - 25));
    return a ^ b ^ c;
}

inline int Ma(unsigned int x, unsigned int y, unsigned int z)
{
    return (x & y) ^ (x & z) ^ (y & z);
}

inline int Ch(unsigned int x, unsigned int y, unsigned int z)
{
    return (x & y) ^ ((~x + 1) & z);
}

int main()
{
    int res[20] = {0};
    for (int i = 0; i < 8; i++)
        res[i] = h0[i];
    string content;
    string binary_val = "";
    getline(cin, content);

    //转二进制
    binary_val += str_to_binary(content);

    //补位
    binary_val += '1';
    int tmp = binary_val.length() % 512;
    tmp = 448 - tmp;
    tmp = tmp < 0 ? tmp + 512 : tmp;
    for (int i = 0; i < tmp; i++)
        binary_val += '0';

    binary_val += int_to_binary(content.length() * 8);
    cout << binary_val << endl;

    int block_num = binary_val.length() / 512;

    //迭代
    for (int i = 0; i < block_num; i++)
    {
        unsigned int words[80] = {0};
        //每一块的前16个word
        for (int j = 0; j < 16; j++)
        {
            for (int k = 0; j < 32; k++)
            {
                words[j] <<= 1;
                if (binary_val[512 * i + 16 * j + k] == '1')
                    words[j] += 1;
            }
        }
        //建立64个word
        for (int j = 16; j < 64; j++)
            words[j] = sigma1(words[j - 2]) + words[j - 7] + sigma0(words[j - 15]) + words[j - 16];

        unsigned int tmp_val[10] = {0};
        for (int j = 0; j < 8; j++)
            tmp_val[j] = h0[j];

        //64次循环
        for (int j = 0; j < 64; j++)
        {
            int s0 = SIGMA0(tmp_val[0]);
            int maj = Ma(tmp_val[0], tmp_val[1], tmp_val[2]);
            int t2 = s0 + maj;
            int s1 = SIGMA1(tmp_val[4]);
            int ch = Ch(tmp_val[4], tmp_val[5], tmp_val[6]);
            int t1 = tmp_val[7] + s1 + ch + key[j] + words[j];

            tmp_val[7] = tmp_val[6];
            tmp_val[6] = tmp_val[5];
            tmp_val[5] = tmp_val[4];
            tmp_val[4] = tmp_val[3] + t1;
            tmp_val[3] = tmp_val[2];
            tmp_val[2] = tmp_val[1];
            tmp_val[1] = tmp_val[0];
            tmp_val[0] = t1 + t2;
        }

        for (int j = 0; j < 8; j++)
            res[j] += tmp_val[j];
    }

    for (int i = 0; i < 8; i++)
        cout << hex << res[i]; //输出十六进制数
    cout << endl;
    return 0;
}

