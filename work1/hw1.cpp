#include <cstdio>
#include <cstdlib>
#include <iostream>
#include <ostream>
#include <string.h>
#include <string>
#include <cstring>
#include <cmath>
#include <wchar.h>
#include <sstream>
using namespace std;
typedef unsigned word;
typedef word block[16]; //一个block放512bit，即64个char，16个word

word h[8] = {0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
             0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19};

word k[64] = {
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
    0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
    0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2};

string input;
char output[65];
int blockNum;

word Ch(word x, word y, word z)
{
    return (x & y) ^ ((~x) & z);
}

word Ma(word x, word y, word z)
{
    return (x & y) ^ (y & z) ^ (x & z);
}

void outputBin(word x)
{
    for (int i = 31; i >= 0; --i)
    {
        cout << ((x >> i) & 1);
        if (i % 4 == 0)
            cout << ' ';
    }
    cout << endl;
}

word S(word x, int n)
{
    n %= 32;
    word mask = ~0;
    mask >>= (32 - n);
    word l = x & mask;
    //word h = x & (~mask);
    x >>= n;
    l <<= (32 - n);
    x |= l;
    return x;
}

word R(word x, int n)
{
    return x >> n;
}

word Sigma0(word x)
{
    return S(x, 2) ^ S(x, 13) ^ S(x, 22);
}

word Sigma1(word x)
{
    return S(x, 6) ^ S(x, 11) ^ S(x, 25);
}

word sigma0(word x)
{
    return S(x, 7) ^ S(x, 18) ^ R(x, 3);
}

word sigma1(word x)
{
    return S(x, 17) ^ S(x, 19) ^ R(x, 10);
}

block *preprocess(string s)
{
    //分成512bit大小的块，也就是512/8=64个char为1块
    blockNum = ceil(s.size() * 1.0 / (512 / 8));
    //最后一个块的长度是(8 * s.size()) % 512，这个块不能超过448，否则要加一个新的块
    //特别的，如果模512余0，也要加一块
    //因此，判断变成了(8 * s.size() - 1) % 512 > 448 - 1
    //如果刚好是512的倍数，-1以后余511
    //如果是448，-1以后余447，判断不成立，不用加新的块
    if ((8 * s.size() - 1) % 512 > 448 - 1)
        blockNum++;

    block *blocks = (block *)malloc(blockNum * sizeof(block));
    memset(blocks, 0, blockNum * 16 * sizeof(word));

    for (int i = 0; i < s.size(); ++i)
    {
        //以下的一切数字均从0开始
        //举例：如果是第80个char，他应当在第1块
        //在第1块内，他是第16个char，因为第1块是从64号char开始的
        //所以，他应当在第1块的第4个word内，偏移量为0
        int blocksOffset = floor(i * 1.0 / (512 / 8)); //在第几块
        int blockOffset = (i % 64) / 4;                //在块内的第几个word
        int wordOffset = i % 4;                        //在word内的哪个偏移
        word w = (word)s[i];
        w <<= (3 - wordOffset) * 8;
        blocks[blocksOffset][blockOffset] |= w;
    }

    int lastBlockOffset = ((s.size() - 1) % 64) / 4;
    int lastWordOffset = (s.size() - 1) % 4;
    word fill = 0b10000000;
    int fillOffset = (lastWordOffset + 1) % 4;
    if (fillOffset == 0)
        lastBlockOffset++;
    fill <<= (3 - fillOffset) * 8;
    for (int i = lastBlockOffset; i < 14; ++i)
    {
        blocks[blockNum - 1][i] |= fill;
        fill = 0;
    }
    blocks[blockNum - 1][14] = 0;
    blocks[blockNum - 1][15] = (word)(s.size() * 8);
    return blocks;
}

void processBlock(block b)
{
    word w[64];
    for (int i = 0; i < 16; ++i)
    {
        w[i] = b[i];
    }
    for (int i = 16; i < 64; ++i)
    {
        w[i] = sigma1(w[i - 2]) + w[i - 7] + sigma0(w[i - 15]) + w[i - 16];
    }

    word a[8];
    for (int i = 0; i < 8; ++i)
    {
        a[i] = h[i];
    }
    for (int i = 0; i < 64; ++i)
    {
        word t2 = Sigma0(a[0]) + Ma(a[0], a[1], a[2]);
        word t1 = a[7] + Sigma1(a[4]) + Ch(a[4], a[5], a[6]) + k[i] + w[i];
        a[7] = a[6];
        a[6] = a[5];
        a[5] = a[4];
        a[4] = a[3] + t1;
        a[3] = a[2];
        a[2] = a[1];
        a[1] = a[0];
        a[0] = t1 + t2;
    }

    for (int i = 0; i < 8; ++i)
        h[i] += a[i];
}

void generateOutput()
{
    int cnt = 0;
    for (int i = 0; i < 8; ++i)
    {
        char c[8];
        sprintf(c, "%08x", h[i]);
        memcpy(output + cnt * 8, c, 8);
        cnt++;
    }
    output[64] = '\0';
}

int checkOutputWithNBits(int nBits)
{
    int result = 0;
    for (int i = 0; i < 64; ++i)
    {
        char c = output[i];
        if (c == '0')
            result += 4;
        else
        {
            if (c == '1')
                result += 3;
            else if (c <= '3')
                result += 2;
            else if (c <= '7')
                result += 1;
            else
                result += 0;
            break;
        }
    }
    return result >= nBits;
}
int main()
{
    int choice;
    int nBits;
    int nNonce;
    while (1)
    {
        cout << "select your choice" << endl
             << "1: input a string and get its hash code" << endl
             << "2: input a number as nBits and start PoW" << endl
             << "3: end this program" << endl;
        cin >> choice;
        if (choice == 3)
            break;
        blockNum = 0;
        memset(output, 0, 65 * sizeof(char));
        h[0] = 0x6a09e667;
        h[1] = 0xbb67ae85;
        h[2] = 0x3c6ef372;
        h[3] = 0xa54ff53a;
        h[4] = 0x510e527f;
        h[5] = 0x9b05688c;
        h[6] = 0x1f83d9ab;
        h[7] = 0x5be0cd19;

        if (choice == 1)
        {
            scanf("\n");
            getline(cin, input);
            block *plain = preprocess(input);
            for (int i = 0; i < blockNum; ++i)
            {
                processBlock(plain[i]);
            }
            generateOutput();
            cout << output << endl;
        }
        else
        {
            cin >> nBits;
            nNonce = -1;
            int check;
            do
            {
                nNonce++;
                input = "I am Satoshi Nakamoto";
                input.append(to_string(nNonce));

                blockNum = 0;
                memset(output, 0, 65 * sizeof(char));
                h[0] = 0x6a09e667;
                h[1] = 0xbb67ae85;
                h[2] = 0x3c6ef372;
                h[3] = 0xa54ff53a;
                h[4] = 0x510e527f;
                h[5] = 0x9b05688c;
                h[6] = 0x1f83d9ab;
                h[7] = 0x5be0cd19;

                block *plain = preprocess(input);
                for (int i = 0; i < blockNum; ++i)
                {
                    processBlock(plain[i]);
                }
                generateOutput();
                cout << "I am Satoshi Nakamoto" << nNonce << ": " << output << endl;

                check = checkOutputWithNBits(nBits);
            } while (!check);
            cout << "I am Satoshi Nakamoto" << nNonce << ": " << output << endl;
        }
    }
}
