#ifndef _SHA_256_H
#define _SHA_256_H
#include<iostream>
using namespace std;
typedef unsigned int UInt32;
//六个逻辑函数
#define Conditional(x,y,z) ((x&y)^((~x)&z))
#define Majority(x,y,z) ((x&y)^(x&z)^(y&z))
#define LSigma_0(x) (S(x,2)^S(x,13)^S(x,22))
#define LSigma_1(x) (S(x,6)^S(x,11)^S(x,25))
#define SSigma_0(x) (S(x,7)^S(x,18)^R(x,3))
#define SSigma_1(x) (S(x,17)^S(x,19)^R(x,10))
//信息摘要结构
struct Message_Digest {
    UInt32 H[8];
};

class SHA256
{
public:
    SHA256() { INIT(); };
    ~SHA256() {};
    Message_Digest DEAL(UInt32 W[16]);//处理512比特数据，返回信息摘要
private:
    void INIT();               
    UInt32 S(UInt32 W, int n);//循环右移n个bit

    UInt32 R(UInt32 W, int n); //右移n个bit
private:
    //信息摘要
    Message_Digest MD;
};

#endif
