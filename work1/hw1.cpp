#include<iostream>
#include<string>
#include<cstring>
#include<cstdio>
#include<set>
#include<ctime>
#include<cstring>
#include<iomanip>
using namespace std;
class SHA256{
    const unsigned int table[64]={
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
        0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
        0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
        0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
        0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
        0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
        0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
        0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
        0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    };
    unsigned int h[8]={0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19};
    void init(){//初始化 
        h[0] = 0x6a09e667;
        h[1] = 0xbb67ae85;
        h[2] = 0x3c6ef372;
        h[3] = 0xa54ff53a;
        h[4] = 0x510e527f;
        h[5] = 0x9b05688c;
        h[6] = 0x1f83d9ab;
        h[7] = 0x5be0cd19;
        return;
    }
    unsigned int Ror(unsigned int src,int x){//循环右移位 
    	return (src>>x) | (src<<(32-x));
	}	
    void calc(unsigned int a[]){//以指针形式传入512个bit进行计算 
    	char *s = (char*)a;
    	
		for(int i=0;i<64;i+=4){//为了适应小端存储规则，进行换位 
			swap(s[i],s[i+3]);
			swap(s[i+1],s[i+2]);
		}
		
		unsigned int w[64];
		for(int i=0;i<16;i++){//复制前16个word 
			w[i]=a[i];
		}
		for(int i=16;i<64;i++){//生成后48个word 
			w[i] = ((Ror(w[i-2],17) ^ Ror(w[i-2],19) ^ (w[i-2]>>10))) +
				w[i-7] +
				(Ror(w[i-15],7) ^ Ror(w[i-15],18) ^ (w[i-15]>>3)) +
				w[i-16];
		}
		unsigned int A,B,C,D,E,F,G,H;
		A = h[0];
		B = h[1];
		C = h[2];
		D = h[3];
		E = h[4];
		F = h[5];
		G = h[6];
		H = h[7];
		for(int i=0;i<64;i++){//64次循环计算
			//根据规则计算8组32位值
			unsigned int Ch = (E&F)^((~E)&G);
			unsigned int Ma = (A&B)^(A&C)^(B&C);
			unsigned int sigma0 = Ror(A,2)^Ror(A,13)^Ror(A,22);
			unsigned int sigma1 = Ror(E,6)^Ror(E,11)^Ror(E,25);
			unsigned int tmpH = H;
			H = G;
			G = F;
			F = E;
			E = D + Ch + w[i] + table[i] +sigma1 + tmpH;
			D = C;
			C = B;
			B = A;
			A = tmpH + w[i] + table[i] + Ch + sigma1 + Ma + sigma0;//自然溢出取模 
		}
		h[0] += A;
		h[1] += B;
		h[2] += C;
		h[3] += D;
		h[4] += E;
		h[5] += F;
		h[6] += G;
		h[7] += H;
		return;
    }
    public:
    void Encode(string str){
    	init();
        unsigned long long len = str.length();
        //padding
		//填充到 (448/8==56)个byte
        int padlen = ((56 - str.length()%64)+64)%64;
        if(padlen==0) padlen = 64;
        str.append(1,128);
        for(int i=1;i<padlen;i++){
            str.append(1,0);
        }
        //additive
		//将表示字符串原长度的64位字填充到待加密串的末尾
        for(int i=1;i<=8;i++){
            unsigned char tmp = (unsigned char)((len*8) >> (64-i*8));
            str.append(1,tmp);
        }
        //calc
        len = str.length();
        for(int i=0;i<len;i+=64){//每512bit为一段，进行计算
            calc((unsigned int*)(str.c_str()+i));
        }
        return;
    }
    void Output(){//输出
    	for(int i=0;i<8;i++){
    		cout<<setfill('0')<<setw(8)<<hex<<h[i];
		}
		cout<<endl;
    	return;
	}
	string GetRes(){//输出为字符串 
		string res="";
		char s[10];
		for(int i=0;i<8;i++){
			sprintf(s,"%08x",h[i]);
			res+=s;
		}
		return res;
	}
};
int main(){
	string input;
	cin>>input;//输入待加密字符串(不含空格)
	SHA256 res;
	res.Encode(input);//加密
	res.Output();//输出
	/*
	srand(time(0));
	set<unsigned int>num;
	set<string>st;
	st.clear();
	for(int i=0;i<100000;i++){
		unsigned int x = rand()*10000 + rand()*100 + rand();
//		unsigned int x = 1000000000 + i;
		if(num.count(x)>0)continue;//使用不重复的数字进行加密 
		num.insert(x);
		char ch[50];
		sprintf(ch,"%d",x);//生成的随机数转为字符串 
		string ss(ch);
		ss += "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
		SHA256 res;
		res.Encode(ss);
		ss = res.GetRes();
		if(st.count(ss)>0){//若检测到碰撞，终止 
			cout<<"Collision"<<endl;
			break;
		} 
		st.insert(ss);
		cout<<ss<<endl;
	}
	*/
    return 0;
}
