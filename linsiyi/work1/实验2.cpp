#include<bits/stdc++.h>

#if __BYTE_ORDER__ == __ORDER_LITTLE_ENDIAN__
#define copy_unsigned_int(p, val) *((unsigned int *)p) = __builtin_bswap32((val))
#elif __BYTE_ORDER__ == __ORDER_BIG_ENDIAN__
#define copy_unsigned_int(p, val) *((unsigned int *)p) = (val)
#else
#error "error!"
#endif

const int M=1000005; 

unsigned char msg[M],hash_val[305];


static const unsigned int k[64] = {
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
};

unsigned int rightrotate(unsigned int w,unsigned int n){
	return ((w >> n) | (w) << (32-(n)));
}
void sha256(unsigned char *msg, int len, unsigned char *out) {
    unsigned int h0 = 0x6a09e667;
    unsigned int h1 = 0xbb67ae85;
    unsigned int h2 = 0x3c6ef372;
    unsigned int h3 = 0xa54ff53a;
    unsigned int h4 = 0x510e527f;
    unsigned int h5 = 0x9b05688c;
    unsigned int h6 = 0x1f83d9ab;
    unsigned int h7 = 0x5be0cd19;
    
    int r = (int)(len * 8 % 512);
    int append = ((r < 448) ? (448 - r) : (448 + 512 - r)) / 8;
    
	size_t new_len = len + append + 8;
    unsigned char buf[new_len];
    memset(buf + len, 0,append);
    if (len > 0) {
        memcpy(buf, msg, len);
    }
    buf[len] = (unsigned char)0x80;
    unsigned long long bits_len = len * 8;
    
	for (int i = 0; i < 8; i++) {
        buf[len + append + i] = (bits_len >> ((7 - i) * 8)) & 0xff;
    }
    unsigned int w[64];
   
    memset(w,0, 64);
    
	size_t chunk_len = new_len / 64;
    for (int idx = 0; idx < chunk_len; idx++) {
        unsigned int val = 0;
        for (int i = 0; i < 64; i++) {
            val =  val | (*(buf + idx * 64 + i) << (8 * (3 - i)));
            if (i % 4 == 3) {
                w[i / 4] = val;
                val = 0;
            }
        }
        for (int i = 16; i < 64; i++) {
            unsigned int s0 = rightrotate(w[i - 15], 7) ^ rightrotate(w[i - 15], 18) ^ (w[i - 15] >> 3);
            unsigned int s1 = rightrotate(w[i - 2], 17) ^ rightrotate(w[i - 2], 19) ^ (w[i - 2] >> 10);
            w[i] = w[i - 16] + s0 + w[i - 7] + s1;
        }
        
        unsigned int a = h0;
        unsigned int b = h1;
        unsigned int c = h2;
        unsigned int d = h3;
        unsigned int e = h4;
        unsigned int f = h5;
        unsigned int g = h6;
        unsigned int h = h7;
        
        for (int i = 0; i < 64; i++) {
            unsigned int s_1 = rightrotate(e, 6) ^ rightrotate(e, 11) ^ rightrotate(e, 25);
            unsigned int ch = (e & f) ^ (~e & g);
            unsigned int temp1 = h + s_1 + ch + k[i] + w[i];
            unsigned int s_0 = rightrotate(a, 2) ^ rightrotate(a, 13) ^ rightrotate(a, 22);
            unsigned int maj = (a & b) ^ (a & c) ^ (b & c);
            unsigned int temp2 = s_0 + maj;
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
    copy_unsigned_int(out, h0);
    copy_unsigned_int(out + 4, h1);
    copy_unsigned_int(out + 8, h2);
    copy_unsigned_int(out + 12, h3);
    copy_unsigned_int(out + 16, h4);
    copy_unsigned_int(out + 20, h5);
    copy_unsigned_int(out + 24, h6);
    copy_unsigned_int(out + 28, h7);
}
int check(int v,int len){
	sprintf((char*)msg+len,"%d",v);
	sha256(msg,strlen((char*)msg),hash_val);
	printf("%s=> ",msg);
	for(int i=0,j,k=0;i<8;i++,k+=16){
		for(j=0;j<4;j++){
			printf("%02X",hash_val[k+j]);
		}
	}
	puts("");
	msg[len]='\0';
	if(hash_val[0]==0&&hash_val[1]==0)return 1;
	return 0;
}
int main(){
	freopen("experiment3.txt","w",stdout);
	printf("Input message= ");
	scanf("%s",msg);
	puts("");
	size_t len=strlen((char*)msg);
	for(int i=1;i<M;i++){
		if(check(i,len)){
			break; 
		}
	}
	//sha256(msg,len,hash_val);
	//printf("Hash value= ");
	/*
	for(int i=0,j,k=0;i<8;i++,k+=16){
		for(j=0;j<4;j++){
			printf("%02X",hash_val[k+j]);
		}
	}*/
	puts("");
}
