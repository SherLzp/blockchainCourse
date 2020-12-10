#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define st 0x7fffffff
#define A(x) x + 3 - 2 * (x % 4)
#define ROTL(a, b) ((( (a) >> (32-(b)) ) & (st>>(31-(b)))) | ((a)<<(b)))
#define SR(a, b) (( (a) >> (b) ) & ( st >> ((b)-1) ) )

#define CHX(x, y, z) (((x) &  (y)) ^ (~(x) & (z)))
#define MAJ(x, y, z) (((x) &  (y)) ^ ( (x) & (z)) ^ ((y) & (z)))

#define ROT(x, y, z) (ROTL(x,  y) ^ ROTL(x, z))

#define E0(x) (ROT(x, 30, 19)^ROTL(x,10))
#define E1(x) (ROT(x, 26, 21)^ROTL(x,7))
#define G0(x) (ROT(x, 25, 14)^SR(x,3))
#define G1(x) (ROT(x, 15, 13)^SR(x,10))

long K[64] = {
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
	0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
	0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
	0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
	0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
	0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
	0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
	0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
};

char* DealSha256(char* str,long long length, char* result){
	char *m, *n;
	long H[8],G[8],W[64],P,Q;
	long len;
	int i,j;
	G[0] = H[0] = 0x6a09e667;
    G[1] = H[1] = 0xbb67ae85;
    G[2] = H[2] = 0x3c6ef372;
    G[3] = H[3] = 0xa54ff53a;
    G[4] = H[4] = 0x510e527f;
    G[5] = H[5] = 0x9b05688c;
    G[6] = H[6] = 0x1f83d9ab;
    G[7] = H[7] = 0x5be0cd19;
    if (length % 64 < 56) len = 64;
    else len = 128;
    len = length + len - length % 64;
    
    m = (char*)malloc((unsigned long)len);
    if(!m) return 0;
    for(i=0;i<length;m[A(i)]= str[i],i++);
    for(m[A(i)] = 128,i++;i<len;m[A(i)] = 0,i++);
 
    *((long*)(m + len - 4)) = length << 3; 
    *((long*)(m + len - 8)) = length >> 29;

    for(n=m+1;m<n;m+=64){
    	for (i = 0; i < 16; W[i] = ((long*)m)[i], i++);
    	for (i = 16; i < 64; W[i] = (G1(W[i-2]) + W[i-7] + G0(W[i-15]) + W[i-16]), i++) ;
    	for(j=0;j<8;j++) G[j]=H[j];
    	for(i=0;i<64;i++){
    		P = G[7] + E1(G[4]) + CHX(G[4], G[5], G[6]) + K[i] + W[i];
            Q = E0(G[0]) + MAJ(G[0], G[1], G[2]);

            for(j=6;j>3;j--) G[j+1]=G[j];
            G[4]=G[3]+P;
            for(j=2;j>=0;j--) G[j+1]=G[j];
	    	G[0]=P+Q;

	    	for(j=0;j<8;j++) ;
		}
		for(j=0;j<8;j++) H[j]+=G[j];
	}
    free(m-len); 
    sprintf(result, "%08X%08X%08X%08X%08X%08X%08X%08X", H[0], H[1], H[2], H[3], H[4], H[5], H[6], H[7]);
    return result;    
    
}
int main(void){

	while(1){
		char ttt[1000];
    	printf("ÊäÈë£º") ;
		scanf("%s",ttt);
		int k=strlen(ttt)+1,i=0;
		char kkk[k];
		while(ttt[i]!='\0') kkk[i]=ttt[i],i++;
    	char kk2[65];
		DealSha256(kkk,sizeof(kkk)-1,kk2);   
  
    	printf("½á¹û£º%s\n",kk2);
		
	} 
    
    return 0;
}
