#include<stdio.h>
#include<iostream>
#include<string.h>
#include<stdlib.h>
using namespace std;
#define ch(x,y,z) (((x) & (y)) ^ (~(x) & (z)))
#define maj(x,y,z) (((x) & (y)) ^ ((x) & (z)) ^ ((y) & (z)))
#define ep0(x) (rr(x,2) ^ rr(x,13) ^ rr(x,22))
#define ep1(x) (rr(x,6) ^ rr(x,11) ^ rr(x,25))
#define sig0(x) (rr(x,7) ^ rr(x,18) ^ sr(x,3))
#define sig1(x) (rr(x,17) ^ rr(x,19) ^ sr(x,10))

const unsigned long k[64] = {
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
};
unsigned long h[8];//encrypted text
void init(){
	h[0] = 0x6a09e667;
    h[1] = 0xbb67ae85;
    h[2] = 0x3c6ef372;
    h[3] = 0xa54ff53a;
    h[4] = 0x510e527f;
    h[5] = 0x9b05688c;
    h[6] = 0x1f83d9ab;
    h[7] = 0x5be0cd19;
}
unsigned long rr(unsigned long a,int n){
	return ((a>>n)&0xFFFFFFFF)|(a<<(32-n));
}
unsigned long rl(unsigned long a,int n){
	return ((a<<n)&0xFFFFFFFF)|(a>>(32-n));
}
unsigned long sr(unsigned long a,int n){
	return ((a>>n)&0xFFFFFFFF);
}
void encrypt(unsigned long block[16]){//sha256 encrypted algorithm 
	int i;
    unsigned long t1=0,t2=0;
    unsigned long txt[64]={0};
    unsigned long aa,bb,cc,dd,ee,ff,gg,hh;
    for(i=0;i<16;i++){//copy 16 * 32 bits
        txt[i]=block[i];
    }
    for(i=16;i<64;i++){//extend rest 48 * 32 bits
    	txt[i]=sig1(txt[i-2])+txt[i-7]+sig0(txt[i-15])+txt[i-16];
    }
    aa=h[0];
    bb=h[1];
    cc=h[2];
    dd=h[3];
    ee=h[4];
    ff=h[5];
    gg=h[6];
    hh=h[7];
    for (i=0;i<64;i++) {
    	t1=hh+ep1(ee)+ch(ee,ff,gg)+k[i]+txt[i];
    	t2=ep0(aa)+maj(aa,bb,cc);
		hh=gg;
		gg=ff;
		ff=ee;
		ee=dd+t1;
		dd=cc;
		cc=bb;
		bb=aa;
		aa=t1+t2; 
	}
	h[0]=(h[0]+aa)&0xFFFFFFFF;
	h[1]=(h[1]+bb)&0xFFFFFFFF;
	h[2]=(h[2]+cc)&0xFFFFFFFF;
	h[3]=(h[3]+dd)&0xFFFFFFFF;
	h[4]=(h[4]+ee)&0xFFFFFFFF;
	h[5]=(h[5]+ff)&0xFFFFFFFF;
	h[6]=(h[6]+gg)&0xFFFFFFFF;
    h[7]=(h[7]+hh)&0xFFFFFFFF;
}
int main(void){
	unsigned char plain[10000];
	init();//give initial value
	cout<<"please input the plain text:";
	cin>>plain;	
	int num=strlen((char *)plain);
	int part,pad;
	part=(num+8)/64+1;
	pad=56-num%64;
	if(pad<=0)pad+=64;
	plain[num]=0x80;
	//cout<<num<<" "<<part<<" "<<pad<<" "<<endl; 
	int i,j=0;
	for(i=1;i<pad;i++){
		plain[num+i]=0x0;
	}
	for(i=1;i<=8;i++){
		if(i<=4){
			plain[num+pad-1+i]=0;
		}
		else{
			plain[num+pad-1+i]=(unsigned char)((8*num)>>(8-i)*8);	
		}
    }
    unsigned long block[16]={0};
	for(i=0;i<part;i++){
		for(j=0;j<16;j++){
			block[j]=0;//empty block
			block[j]=(plain[i*64+j*4]<<24)+(plain[i*64+j*4+1]<<16)+(plain[i*64+j*4+2]<<8)+plain[i*64+j*4+3];
		}
		encrypt(block);
	}
	for(i=0;i<8;i++){
		printf("%lx\n",h[i]);
	}
}
