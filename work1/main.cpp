#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<bool> Data;
//默认参数
unsigned int k[] = { 0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,    
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,    
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,    
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,    
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,    
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2 };
unsigned int w[256];
unsigned int ShiftRight(unsigned int x, int p);
unsigned int RightRotate(unsigned int x, int p);
unsigned int z1(unsigned int x);
unsigned int z0(unsigned int x);
unsigned int ma(unsigned int x, unsigned int y, unsigned int z);
unsigned int ch(unsigned int x, unsigned int y, unsigned int z);
unsigned int s1(unsigned int x);
unsigned int s0(unsigned int x);
void printHex(unsigned int ans);
void Hash_sha256(unsigned int h[]);
int DataProcess(string DataString,int type);
void ProofOfWork(string DataString, int numberOfZero);

int main() {
    string data_String;
    char c;
    int numberOfZero=0;
    cout <<" Enter 1 to execute SHA256 algorithm for single string, and enter P to execute ProofOfWork.\n Enter Q to quit." << endl;
    c = cin.get();
    cin.get();
    while(c!='Q'){
        if(c=='1'){
            cout << "Please enter a single string, with 'Enter' in the end." << endl;
            getline(cin,data_String);
            DataProcess(data_String,0);
        }
        else if(c=='P'){
            cout << "Please enter a string, and then give a number of 0. The process will give out the additionnal number(which is sequential from 1 to 2^64)." << endl;
            cout << "Please enter a single string, with 'Enter' in the end." << endl;
            getline(cin,data_String);
            cout << "Please enter the number of 0:" ;
            cin >> numberOfZero;
            cin.get();
            ProofOfWork(data_String,numberOfZero);

        }
        else {
            cout << "Wrong input! Please try again." << endl;
        }
        cout <<" Enter 1 to execute SHA256 algorithm for single string, and enter P to execute ProofOfWork.\n Enter Q to quit." << endl;
        cin >> c;
        cin.get();
    }

    return 0;
}

unsigned int ShiftRight(unsigned int x, int p) {
    return (x >> p);
}
unsigned int RightRotate(unsigned int x, int p) {
    return (x >> p | x << 32 - p);
}
unsigned int z1(unsigned int x) {
    return RightRotate(x, 6) ^ RightRotate(x, 11) ^ RightRotate(x, 25);
}
unsigned int z0(unsigned int x) {
    return RightRotate(x, 2) ^ RightRotate(x, 13) ^ RightRotate(x, 22);
}
unsigned int ma(unsigned int x, unsigned int y, unsigned int z) {
    return (x & y) ^ (x & z) ^ (y & z);
}
unsigned int ch(unsigned int x, unsigned int y, unsigned int z) {
    return (x & y) ^ (~x & z);
}
unsigned int s1(unsigned int x) {
    return RightRotate(x, 17) ^ RightRotate(x, 19) ^ ShiftRight(x, 10);
}
unsigned int s0(unsigned int x) {
    return RightRotate(x, 7) ^ RightRotate(x, 18) ^ ShiftRight(x, 3);
}
void printHex(unsigned int ans) {
    vector<char>res;
	//转十六进制
    while(ans) {
        int now = ans % 16;
        char x;
        if(now < 10) x = now + '0';
        else x = now - 10 + 'a';
        ans /= 16;
        res.push_back(x);
    }
    while(res.size() < 8) res.push_back('0');
    reverse(res.begin(), res.end());
    for(auto x : res) cout << x;
}

//数据处理后实现sha256
void Hash_sha256(unsigned int h[]) {
    unsigned int x = 0;
    int p = 0;
    for(int i = 0; i < 512; ++i) { 
        x <<= 1;
        x += Data[i];
        if((i + 1) % 32 == 0) {
            w[p++] = x;
            x = 0;
        }
    }
	//扩展位
    for(int i = 16; i < 64; ++i) 
        w[i] = s1(w[i - 2]) + w[i - 7] + s0(w[i - 15]) + w[i - 16];
    unsigned int a[8];
	//初始化
    for(int i = 0; i < 8; ++i) a[i] = h[i]; 
	//进行函数运算
    for(int i = 0; i < 64; ++i) {
        unsigned int sum1 = k[i] + w[i] + ch(a[4], a[5], a[6]) + z1(a[4]) + a[7];
        unsigned int sum2 = z0(a[0]) + ma(a[0], a[1], a[2]);
        for(int j = 7; j >= 0; --j) {
            if(j == 4) a[j] = a[j - 1] + sum1;
            else if(j == 0) a[j] = sum1 + sum2;
            else a[j] = a[j - 1];
        }
    }
    for(int i = 0; i < 8; ++i) {
        h[i] += a[i];
    }
}
//将数据分割为512bits的块，逐块处理
int DataProcess(string DataString,int type) {
    char c;
    int sz = 0;
    unsigned int h[] = { 0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19 };
    for(int i = 0 ; i < DataString.length() ; i++){
		//每一个字符为八位
        sz += 8;
        vector<bool> now;
        int x = DataString[i];
        while(x) {
            if(x & 1) now.push_back(1);
            else now.push_back(0);
            x >>= 1;
        }   
		//使每个字符满足8位的要求
        while(now.size() < 8) now.push_back(0);
        reverse(now.begin(), now.end());
        for(auto x : now) Data.push_back(x);
		//位数达到要求，则直接传入Hash_sha256函数
        if(Data.size() == 512) {
            Hash_sha256(h);
            Data.clear();
        }
    }
	//cnt为需要补的位数，至少补1位，至多512位
    int cnt = Data.size();
    if(cnt >= 448) cnt = 448 + 512 - cnt;
    else cnt = 448 - cnt;
	//末尾补1
    Data.push_back(1);
    cnt--;
	//达到512bits要求，对于字符无意义
    if(Data.size() == 512) {
        Hash_sha256(h);
        Data.clear();
    }
	//未达到则继续补0
    while(cnt) {
        Data.push_back(0);
		cnt--;
        if(Data.size() == 512) {
            Hash_sha256(h);
            Data.clear();
        }
    }
    // 加上最后的64位
    vector<bool> now;
	// 最后64位为字符串的长度
    while(sz) {
        if(sz & 1) now.push_back(1);
        else now.push_back(0);
        sz >>= 1;
    }  
	//若小于64，则补齐0
    while(now.size() < 64) now.push_back(0);
    //翻转得到长度,低位字节优先
    reverse(now.begin(), now.end());
    for(auto x : now) Data.push_back(x);
	//传入Hash_sha256
    Hash_sha256(h);
    Data.clear();
    //打印16进制hash值
    if(type==0){
        for(int i = 0; i < 8; ++i) {
            printHex(h[i]);
        }
        cout <<	endl;
        return true;
    }else{
        int num = 0 ;
        while(h[0]) {
            h[0] /= 2;
            num++;
        }
        //(32-num)为前置0的数量
        return type>32-num;
    }
}

void ProofOfWork(string DataString, int numberOfZero){
    bool flag=true;
    unsigned long long Add = 0;
    while(flag){
        flag=DataProcess((DataString + to_string(++Add)),numberOfZero);
    }
    cout << "The Result is: " << DataString << Add << endl;
    cout << "SHA256:" ;DataProcess((DataString + to_string(Add)),0);
    cout << "Addition number is: " << Add << endl;
}
