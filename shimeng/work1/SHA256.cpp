#include <cstdio>
#include <cstdint>
#include <cstdlib>
#include <cstring>

const int MAX_BLOCKS = 100000;
const int BLOCK_SIZE = 512 / 8;

const uint32_t K[64] = {
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
};

uint32_t h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a,
    h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;

uint8_t str[MAX_BLOCKS * BLOCK_SIZE];
uint64_t len_of_str, n_blocks;

inline uint32_t conditional(uint32_t x, uint32_t y, uint32_t z) { return (x&y)^((~x)&z); }
inline uint32_t majority(uint32_t x, uint32_t y, uint32_t z) { return (x&y)^(x&z)^(y&z); }
inline uint32_t sigma0(uint32_t x) { return _rotr(x, 2)^_rotr(x, 13)^_rotr(x, 22); }
inline uint32_t sigma1(uint32_t x) { return _rotr(x, 6)^_rotr(x, 11)^_rotr(x, 25); }
inline uint32_t s_sigma0(uint32_t x) { return _rotr(x, 7)^_rotr(x, 18)^(x>>3); }
inline uint32_t s_sigma1(uint32_t x) { return _rotr(x, 17)^_rotr(x, 19)^(x>>10); }

void readFile(char *filename) {
    FILE *fp = fopen(filename, "rb");
    if(fp == nullptr) {
        printf("open file %s failed.", filename);
        exit(0);
    } else {
        len_of_str = fread(str, sizeof(uint8_t), sizeof(str), fp);
        fclose(fp);
    }
}

void preInit() {
    str[len_of_str] = 0x80;
    n_blocks = (len_of_str+1) / BLOCK_SIZE + ((len_of_str+1) % BLOCK_SIZE <= 56 ? 1 : 2);
    uint64_t big_len_of_str = _byteswap_uint64(len_of_str * 8);
    memset(str + len_of_str + 1, 0x00, n_blocks * BLOCK_SIZE - 8 - len_of_str);
    memcpy(str + n_blocks * BLOCK_SIZE - 8, (uint8_t*)&big_len_of_str, sizeof(uint64_t));
}


void calc() {
    uint32_t w[64], a, b, c, d, e, f, g, h;
    for(uint64_t i=0; i<n_blocks; i++) {
        for(int j=0; j<16; j++)
            w[j] = _byteswap_ulong((*(uint32_t*)&str[i * BLOCK_SIZE + j * 4]));
        for(int j=16; j<64; j++)
            w[j] = s_sigma1(w[j-2])+w[j-7]+s_sigma0(w[j-15])+w[j-16];
        a = h0; b = h1; c = h2; d = h3;
        e = h4; f = h5; g = h6; h = h7;
        for(int j=0; j<64; j++) {
            uint32_t t1 = h + sigma1(e) + conditional(e, f, g) + K[j] + w[j];
            uint32_t t2 = sigma0(a) + majority(a, b, c);
            h = g;
            g = f;
            f = e;
            e = d + t1;
            d = c;
            c = b;
            b = a;
            a = t1 + t2;
        }
        h0 += a; h1 += b; h2 += c; h3 += d;
        h4 += e; h5 += f; h6 += g; h7 += h;
    }
}

int main(int argc, char *argv[]) {
    readFile(argv[1]);
    preInit();
    calc();
    printf("%08x%08x%08x%08x%08x%08x%08x%08x\n", h0, h1, h2, h3, h4, h5, h6, h7);
    return 0;
}