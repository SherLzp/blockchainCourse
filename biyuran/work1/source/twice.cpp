#include <stdint.h>
#include <string.h>
#include <strings.h>
#include <stdio.h>
#include <stdlib.h>
#define RR(w, n) ((w >> n) | (w) << (32-(n)))
#define MAX_IN 1000
//常量初始化 
static const uint32_t k[64] = {
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
};


void sha256(char *data, unsigned char *out) {
    uint32_t h0 = 0x6a09e667;
    uint32_t h1 = 0xbb67ae85;
    uint32_t h2 = 0x3c6ef372;
    uint32_t h3 = 0xa54ff53a;
    uint32_t h4 = 0x510e527f;
    uint32_t h5 = 0x9b05688c;
    uint32_t h6 = 0x1f83d9ab;
    uint32_t h7 = 0x5be0cd19;
    //信息预处理1-附加填充比特 
	size_t len=strlen(data);
    int r = (int)(len * 8 % 512);
    int append = ((r < 448) ? (448 - r) : (448 + 512 - r)) / 8;
    size_t new_len = len + append + 8;
    unsigned char buf[new_len];
    memset(buf+len,0,append);
    if (len > 0) {
        memcpy(buf, data, len);
    }
    buf[len] = (unsigned char)0x80;
    //信息预处理2-附加长度值
    uint64_t bits_len = len * 8;
    for (int i = 0; i < 8; i++) {
        buf[len + append + i] = (bits_len >> ((7 - i) * 8)) & 0xff;
    }
    
	//计算消息摘要1-构造64个字 
	uint32_t w[64];
    memset(w,0,64);
    size_t chunk_len = new_len / 64;//分成512-bit chunks 
    for (int idx = 0; idx < chunk_len; idx++) {
        uint32_t val = 0;
        for (int i = 0; i < 64; i++) {//前16个字直接由消息的第i个块分解得到
            val =  val | (*(buf + idx * 64 + i) << (8 * (3 - i)));
            if (i % 4 == 3) {
                w[i / 4] = val;
                val = 0;
            }
        }
        for (int i = 16; i < 64; i++) {//其余的字由迭代公式得到
            uint32_t s0 = RR(w[i - 15], 7) ^ RR(w[i - 15], 18) ^ (w[i - 15] >> 3);
            uint32_t s1 = RR(w[i - 2], 17) ^ RR(w[i - 2], 19) ^ (w[i - 2] >> 10);
            w[i] = w[i - 16] + s0 + w[i - 7] + s1;
        }
        
        uint32_t a = h0;
        uint32_t b = h1;
        uint32_t c = h2;
        uint32_t d = h3;
        uint32_t e = h4;
        uint32_t f = h5;
        uint32_t g = h6;
        uint32_t h = h7;
        
        //计算消息摘要2-进行64次循环迭代 
        for (int i = 0; i < 64; i++) {
            uint32_t s_1 = RR(e, 6) ^ RR(e, 11) ^ RR(e, 25);
            uint32_t ch = (e & f) ^ (~e & g);
            uint32_t temp1 = h + s_1 + ch + k[i] + w[i];
            uint32_t s_0 = RR(a, 2) ^ RR(a, 13) ^ RR(a, 22);
            uint32_t maj = (a & b) ^ (a & c) ^ (b & c);
            uint32_t temp2 = s_0 + maj;
            h = g;
            g = f;
            f = e;
            e = d + temp1;
            d = c;
            c = b;
            b = a;
            a = temp1 + temp2;
        }
        h0 += a;
        h1 += b;
        h2 += c;
        h3 += d;
        h4 += e;
        h5 += f;
        h6 += g;
        h7 += h;
    }
  
    //小头存储 
    *((uint32_t *)out) = __builtin_bswap32(h0);
    *((uint32_t *)(out+4)) = __builtin_bswap32(h1);
    *((uint32_t *)(out+8)) = __builtin_bswap32(h2);
    *((uint32_t *)(out+12)) = __builtin_bswap32(h3);
    *((uint32_t *)(out+16))= __builtin_bswap32(h4);
    *((uint32_t *)(out+20)) = __builtin_bswap32(h5);
    *((uint32_t *)(out+24))= __builtin_bswap32(h6);
    *((uint32_t *)(out+28)) = __builtin_bswap32(h7);

    //printf("%x%x%x%x%x%x%x%x\n",h0,h1,h2,h3,h4,h5,h6,h7);
    
	
}

int main(){
	FILE *f=fopen("out_twice.txt","w+");
	unsigned char out[64];
    char data[MAX_IN];
	gets(data);
	
    //1st 
	sha256(data, out);
	printf("1st:\n"); 
	fprintf(f,"1st:\n");
	for(int i=0;i<32;i++){
		printf("%02x",out[i]);
		fprintf(f,"%02x",out[i]);
	}
		
	memset(out,0,64);
	fseek(f,0,SEEK_SET); 
	fgets(data,65,f);
   
	getchar();
	//2nd 
	sha256(data, out);
	printf("\n2nd:\n"); 
	fseek(f,0,SEEK_END); 
	fprintf(f,"\n2nd:\n");
	for(int i=0;i<32;i++){
		printf("%02x",out[i]);
		fprintf(f,"%02x",out[i]);
	}
	fclose(f);
	printf("\n");
	system("pause");

	return 0;
} 
