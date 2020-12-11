#include<string.h>
#include<math.h> 
#include<iostream>

using namespace std;
typedef unsigned int 		int32;
typedef unsigned __int64 	int64;
#define Max 520000
const int32 K[64] = {
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
};

int32 ROTL(int32 W,int n){return ((W << n) & 0xFFFFFFFF) | (W) >> (32-(n));}
int32 SHR(int32 W,int n){return ((W >> n) & 0xFFFFFFFF);}
#define Conditional(x,y,z) ((x&y)^((~x)&z))
#define Majority(x,y,z) ((x&y)^(x&z)^(y&z))
#define LSigma_0(x) (ROTL(x,30)^ROTL(x,19)^ROTL(x,10))
#define LSigma_1(x) (ROTL(x,26)^ROTL(x,21)^ROTL(x,7))
#define SSigma_0(x) (ROTL(x,25)^ROTL(x,14)^SHR(x,3))
#define SSigma_1(x) (ROTL(x,15)^ROTL(x,13)^SHR(x,10))

struct content{int32 H[8];};

int32 W[Max/4];
int32 M[16];

int main(){
	while(1){ 
	content hash;
	hash.H[0] = 0x6a09e667;
    hash.H[1] = 0xbb67ae85;
    hash.H[2] = 0x3c6ef372;
    hash.H[3] = 0xa54ff53a;
    hash.H[4] = 0x510e527f;
    hash.H[5] = 0x9b05688c;
    hash.H[6] = 0x1f83d9ab;
    hash.H[7] = 0x5be0cd19;
    
    char Y[Max];
    cout<<"请输入要加密的内容：";
    cin>>Y;
    int32 i,j;
    int32 T1=0,T2=0,T3=0,T4=0;
    char temp[Max]={0};
    int64 x = strlen((char *)Y);
    int32 d = abs(55-x) % 64;
    int32 n = (x+8)/64+1;
    for(i=0;i<x;i++){temp[i] = Y[i];}
	temp[x] = 0x80;
    for(i=x+1;i<x+d+1;i++){temp[i] = 0x00;}
    for(i=1;i<=8;i++){temp[(n*64)-i] = (char)(8*x>>(i-1)*8);}
    for(i=0;i<Max/4;i++){
        T1 = temp[4*i];
        T2 = temp[4*i+1];
        T3 = temp[4*i+2];
        T4 = temp[4*i+3];
        W[i] = (T1<<24) + (T2<<16) + (T3<<8) +T4;
    }
    for(i=0;i<n;i++){
        for(j=0;j<16;j++){M[j] = W[(i*16)+j];}
        int i;
    	int32 T1=0,T2=0;
    	int32 W[64]={0};
    	int32 A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0;
    	for(i=0;i<16;i++){W[i] = M[i];}
    	for(i=16;i<64;i++){W[i] = SSigma_1(W[i-2])+W[i-7]+SSigma_0(W[i-15])+W[i-16];}
    	A = hash.H[0];
    	B = hash.H[1];
    	C = hash.H[2];
    	D = hash.H[3];
    	E = hash.H[4];
    	F = hash.H[5];
    	G = hash.H[6];
    	H = hash.H[7];
    	for(i=0;i<64;i++){
        	T1 = H + LSigma_1(E) + Conditional(E, F, G) + K[i] + W[i];
        	T2 = LSigma_0(A) + Majority(A, B, C);
        	H = G;
        	G = F;
        	F = E;
        	E = D + T1;
        	D = C;
        	C = B;
        	B = A;
        	A = T1 + T2;
    	}
    	hash.H[0]=(hash.H[0]+A) & 0xFFFFFFFF;
    	hash.H[1]=(hash.H[1]+B) & 0xFFFFFFFF;
    	hash.H[2]=(hash.H[2]+C) & 0xFFFFFFFF;
    	hash.H[3]=(hash.H[3]+D) & 0xFFFFFFFF;
    	hash.H[4]=(hash.H[4]+E) & 0xFFFFFFFF;
    	hash.H[5]=(hash.H[5]+F) & 0xFFFFFFFF;
    	hash.H[6]=(hash.H[6]+G) & 0xFFFFFFFF;
    	hash.H[7]=(hash.H[7]+H) & 0xFFFFFFFF;
    }
    cout<<"哈希值： ";
   	for(i=0;i<8;i++){cout<<hex<<hash.H[i]<<" ";}
    cout<<"\n"<<endl;
	}
    return 0;
}
