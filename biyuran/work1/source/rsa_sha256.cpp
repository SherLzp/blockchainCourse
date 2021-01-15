#include <stdint.h>
#include <string.h>
#include <strings.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define ACCURACY 5
#define SINGLE_MAX 10000
#define EXPONENT_MAX 1000
#define BUF_SIZE 66

#define RR(w, n) ((w >> n) | (w) << (32-(n)))
#define MAX_IN 100

FILE *f = fopen("out_rsa_sha256.txt", "w+");
//������ʼ�� 
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
uint32_t h0 = 0x6a09e667;
uint32_t h1 = 0xbb67ae85;
uint32_t h2 = 0x3c6ef372;
uint32_t h3 = 0xa54ff53a;
uint32_t h4 = 0x510e527f;
uint32_t h5 = 0x9b05688c;
uint32_t h6 = 0x1f83d9ab;
uint32_t h7 = 0x5be0cd19;

void sha256(char *data, unsigned char *out) {
    
    //��ϢԤ����1-���������� 
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
    
    //��ϢԤ����2-���ӳ���ֵ
    uint64_t bits_len = len * 8;
    for (int i = 0; i < 8; i++) {
        buf[len + append + i] = (bits_len >> ((7 - i) * 8)) & 0xff;
    }
    
	//������ϢժҪ1-����64���� 
	uint32_t w[64];
    memset(w,0,64);
    size_t chunk_len = new_len / 64;//�ֳ�512-bit chunks 
    for (int idx = 0; idx < chunk_len; idx++) {
        uint32_t val = 0;
        for (int i = 0; i < 64; i++) {//ǰ16����ֱ������Ϣ�ĵ�i����ֽ�õ�
            val =  val | (*(buf + idx * 64 + i) << (8 * (3 - i)));
            if (i % 4 == 3) {
                w[i / 4] = val;
                val = 0;
            }
        }
        for (int i = 16; i < 64; i++) {//��������ɵ�����ʽ�õ�
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
        
        //������ϢժҪ2-����64��ѭ������ 
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
  
    //Сͷ�洢 
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


//rsa�����㷨���ڲ��Ǳ�����ҵ�ĺ������񣬴���ʵ�ֲο�https://www.cnblogs.com/67-Min/p/13247074.html 
int modpow(long long a, long long b, int c) {
    int res = 1;
    while(b > 0) {
        /* Need long multiplication else this will overflow...
         ����ʹ�ó��˷��������⽫���*/
        if(b & 1) {
            res = (res * a) % c;
        }
        b = b >> 1;
        a = (a * a) % c; /* Same deal here */
    }
    return res;
}
int jacobi(int a, int n) {
    int twos, temp;
    int mult = 1;
    while(a > 1 && a != n) {
        a = a % n;
        if(a <= 1 || a == n) break;
        twos = 0;
        while(a % 2 == 0 && ++twos) a /= 2; /* Factor out multiples of 2 ,��ȥ2�ı���*/
        if(twos > 0 && twos % 2 == 1) mult *= (n % 8 == 1 || n % 8 == 7) * 2 - 1;
        if(a <= 1 || a == n) break;
        if(n % 4 != 1 && a % 4 != 1) mult *= -1; /* Coefficient for flipping����תϵ�� */
        temp = a;
        a = n;
        n = temp;
    }
    if(a == 0) return 0;
    else if(a == 1) return mult;
    else return 0; /* a == n => gcd(a, n) != 1 */
}
int solovayPrime(int a, int n) {
    int x = jacobi(a, n);
    if(x == -1) x = n - 1;
    return x != 0 && modpow(a, (n - 1)/2, n) == x;
}
int probablePrime(int n, int k) {
    if(n == 2) return 1;
    else if(n % 2 == 0 || n == 1) return 0;
    while(k-- > 0) {
        if(!solovayPrime(rand() % (n - 2) + 2, n)) return 0;
    }
    return 1;
}
int randPrime(int n) {
    int prime = rand() % n;
    n += n % 2; /* n needs to be even so modulo wrapping preserves oddness */
    prime += 1 - prime % 2;
    while(1) {
        if(probablePrime(prime, ACCURACY)) return prime;
        prime = (prime + 2) % n;
    }
}
int gcd(int a, int b) {
    int temp;
    while(b != 0) {
        temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}
int randExponent(int phi, int n) {
    int e = rand() % n;
    while(1) {
        if(gcd(e, phi) == 1) return e;
        e = (e + 1) % n;
        if(e <= 2) e = 3;
    }
}
int inverse(int n, int modulus) {
    int a = n, b = modulus;
    int x = 0, y = 1, x0 = 1, y0 = 0, q, temp;
    while(b != 0) {
        q = a / b;
        temp = a % b;
        a = b;
        b = temp;
        temp = x; x = x0 - q * x; x0 = temp;
        temp = y; y = y0 - q * y; y0 = temp;
    }
    if(x0 < 0) x0 += modulus;
    return x0;
}
int readFile(FILE* fd, char** buffer, int bytes) {
    int len = 64;
    *buffer = (char *)malloc(BUF_SIZE * sizeof(char));
    fseek(fd,0,SEEK_SET); 
	fgets(*buffer,64,fd);
    fseek(fd,0,SEEK_END); 
    do {
        (*buffer)[len] = '\0';
        len++;
    }
    while(len % bytes != 0);
    return len;
}
int encode(int m, int e, int n) {
    return modpow(m, e, n);
}
int decode(int c, int d, int n) {
    return modpow(c, d, n);
}
int* encodeMessage(int len, int bytes, char* message, int exponent, int modulus) {
    int *encoded = (int *)malloc((len/bytes) * sizeof(int));
    int x, i, j;
    fprintf(f,"\n����:\n");
    for(i = 0; i < len; i += bytes) {
        x = 0;
        for(j = 0; j < bytes; j++) x += message[i + j] * (1 << (7 * j));
        encoded[i/bytes] = encode(x, exponent, modulus);
#ifndef MEASURE
        printf("%d ", encoded[i/bytes]);
        fprintf(f,"%d ", encoded[i/bytes]);
#endif
    }
    return encoded;
}
int* decodeMessage(int len, int bytes, int* cryptogram, int exponent, int modulus) {
    int *decoded = (int *)malloc(len * bytes * sizeof(int));
    int x, i, j;
    fprintf(f,"\n����:\n");
    for(i = 0; i < len; i++) {
        x = decode(cryptogram[i], exponent, modulus);
        for(j = 0; j < bytes; j++) {
            decoded[i*bytes + j] = (x >> (7 * j)) % 128;
#ifndef MEASURE
            if(decoded[i*bytes + j] != '\0') {
            	printf("%c", decoded[i*bytes + j]);
            	fprintf(f,"%c", decoded[i*bytes + j]);
			}
#endif
        }
    }
    return decoded;
}

int main(){
	//SHA256��������ǩ�� 
	unsigned char out[64];
    char data[MAX_IN]; 
	
	if(f == NULL) {
        printf("Failed to open file \"text.txt\". Does it exist?\n");
        return EXIT_FAILURE;
    }
	printf("����ԭ�ģ�"); 
	gets(data);

	sha256(data, out);
	printf("\nSHA256��������ǩ����ʼ--------------------------\n����ǩ����");
	
	for(int i=0;i<32;i++){
		printf("%02x",out[i]);
		//if((i+1)%4==0) printf(" ");
		fprintf(f,"%02x",out[i]);
	}
	printf("\n");

    
    getchar();
    
    //RSA׼������ 
	int p, q, n, phi, e, d, bytes, len;
    int *encoded, *decoded;
    char *buffer;
   
    srand(time(NULL));
    while(1) {
        p = randPrime(SINGLE_MAX);
        //printf("���ɵ�һ���������, p = %d ... ", p);

        q = randPrime(SINGLE_MAX);
        //printf("���ɵڶ����������, q = %d ... ", q);

        n = p * q;
        //printf("����p��q�ĳ˻�n, n = pq = %d ... ", n);
        if(n < 128) {
            //printf("Modulus is less than 128, cannot encode single bytes. Trying again ... ");
        }
        else break;
    }
    if(n >> 21) bytes = 3;
    else if(n >> 14) bytes = 2;
    else bytes = 1;
    printf("RSA���ܿ�ʼ-------------------------------------\n");

    phi = (p - 1) * (q - 1);
    //printf("����ŷ��������ֵphi, phi = %d ... ", phi);

    e = randExponent(phi, EXPONENT_MAX);
    //printf("ѡȡһ���������e, e = %d...\n��ù�Կ (%d, %d) ... ", e, e, n);

    d = inverse(e, phi);
    //printf("����ģ��Ԫ��d, d = %d...\n�����Կ (%d, %d) ... ", d, d, n);
    printf("RSA������Կ��%d��%d��\n",d,n); 

    //printf("���ļ� \"text.txt\" ���ڶ�ȡ��Ϣ\n");    
    len = readFile(f, &buffer, bytes); 
    
    //printf("�ļ� \"text.txt\" ��ȡ�ɹ�, ��ȡ��%d�ֽ�. ��%d�ֽڵ��ֽ������� ... ", len, bytes);
    getchar();
    printf("���ܵ�����Ϊ��");
    
    encoded = encodeMessage(len, bytes, buffer, e, n);
    //printf("\n����ɹ���� ... ");
    //getchar();


    //printf("���ڽ���������Ϣ ... ");
    getchar();
    printf("\n���������Ϊ��");
    
    decoded = decodeMessage(len/bytes, bytes, encoded, d, n);


    getchar();
	printf("\nRSA_SHA256����ǩ�����---------------------------\n");
    fclose(f);
    free(encoded);
    free(decoded);
    free(buffer);
    system("pause");
	return 0;
} 
