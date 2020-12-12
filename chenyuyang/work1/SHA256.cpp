#define _CRT_SECURE_NO_WARNINGS
#include<bits/stdc++.h>
using namespace std;
const unsigned int Hs[8] = {
    0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,
    0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19
};
const unsigned int Hc[64] = {
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,
    0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,
    0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,
    0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,
    0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,
    0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,
    0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,
    0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,
    0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
};

unsigned int rs(unsigned int x,unsigned int n) {
    return x >> n;
}
unsigned int rr(unsigned int x,unsigned int n) {
    return (x >> n) | (x << (32 - n));
}

string ltob(long long num) {
    string s2,ss;
    while (num) {
        s2.push_back((num % 2) + '0');
        num >>= 1;
    }
    reverse(s2.begin(), s2.end());
    unsigned int len = s2.length();
    for (unsigned int i = 64; i > len; i--) {
        ss.push_back('0');
    }
    return ss+s2;
}
void tailfill(string& s) {
    long long l0 = s.length();
    string sl0;
    sl0 = ltob(l0);
    s.push_back('1');
    unsigned int l = (448-s.length()) % 512;
    for (unsigned int i = 0; i < l;i++) {
        s.push_back('0');
    }
    s.append(sl0);
}
string ctob8(char c) {
    string s = "";
    while (c) {
        s.push_back(c % 2 + '0');
        c >>= 1;
    }
    reverse(s.begin(),s.end());
    while (s.length() < 8)
        s = "0" + s;
    return s;
}
string stob(const string &s0) {
    string s="";
    for (unsigned int i = 0; i < s0.length(); i++) {
        s.append(ctob8(s0[i]));
    }
    return s;
}
string init512x(string &s0) {
    string s;
    s = stob(s0);
    tailfill(s);
    return s;
}

unsigned int btoi(string b) {
    unsigned int num = 0;
    for (unsigned int i = 0; i < b.length(); i++) {
        num <<= 1;
        num += b[i] - '0';
    }
    return num;
}
vector<unsigned int> brake(string s) {//512
    vector<string> ws;
    vector<unsigned int>wi16;
    for (unsigned int i = 0; i < 16; i++) {
        ws.push_back(s.substr(i * 32, 32));
        wi16.push_back(btoi(ws[i]));
    }
    return wi16;
}
unsigned int main() {
    string s;
    string s5;
    getline(cin, s);
    s5 = init512x(s);
    vector<string> sh;
    for (unsigned int i = 0; i < s5.length(); i+=512) {
        sh.push_back(s5.substr(i, 512));
    }
    unsigned int hres[8];
    for (unsigned int o = 0; o < 8; o++)
        hres[o] = Hs[o];
    for (auto k = sh.begin(); k != sh.end(); k++) {
        vector<unsigned int> w;
        w = brake(*k);

        unsigned int s0, s1;
        unsigned int a = hres[0], b = hres[1], c = hres[2], d = hres[3],
            e = hres[4], f = hres[5], g = hres[6], h = hres[7];
        unsigned int t1, t2, maj, ch;
        for (unsigned int j = 16; j < 64; j++) {
            s0 = rr(w[j - 15], 7) ^ rr(w[j - 15], 18) ^ rs(w[j - 15], 3);
            s1 = rr(w[j - 2], 17) ^ rr(w[j - 2], 19) ^ rs(w[j - 2], 10);
            w.push_back(w[j - 16] + w[j - 7] + s0 + s1);
        }
        for (unsigned int i = 0; i < 64; i++) {
            s0 = rr(a, 2) ^ rr(a, 13) ^ rr(a, 22);
            maj = (a & b) ^ (a & c) ^ (b & c);
            t2 = s0 + maj;
            s1 = rr(e, 6) ^ rr(e, 11) ^ rr(e, 25);
            ch = (e & f) ^ ((~e) & g);
            t1 = h + s1 + ch + w[i] + Hc[i];
            h = g;
            g = f;
            f = e;
            e = d + t1;
            d = c;
            c = b;
            b = a;
            a = t1 + t2;
        }       
        hres[0] += a;
        hres[1] += b;
        hres[2] += c;
        hres[3] += d;
        hres[4] += e;
        hres[5] += f;
        hres[6] += g;
        hres[7] += h;
    }
    for (unsigned int i = 0; i < 8; i++)
        printf("%08X", hres[i]);
}