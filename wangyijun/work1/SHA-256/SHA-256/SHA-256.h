#pragma once

#include<iostream>

//最大长度
#define Max 1000

using namespace std;
typedef unsigned int UInt_32;
typedef unsigned __int64 UInt_64;
typedef unsigned char UChar;

//部分逻辑函数的宏定义
#define Conditional(x,y,z) ((x&y)^((~x)&z))
#define Majority(x,y,z) ((x&y)^(x&z)^(y&z))
#define LSigma_0(x) (ROT_left(x,30)^ROT_left(x,19)^ROT_left(x,10))
#define LSigma_1(x) (ROT_left(x,26)^ROT_left(x,21)^ROT_left(x,7))
#define SSigma_0(x) (ROT_left(x,25)^ROT_left(x,14)^SHIFT_right(x,3))
#define SSigma_1(x) (ROT_left(x,15)^ROT_left(x,13)^SHIFT_right(x,10))
//摘要
struct Message_Digest 
{
	UInt_32 Digest[8];
};

//SHA_256类声明
class SHA_256
{
	Message_Digest MD;
public:
	SHA_256(){INIT();};
	Message_Digest deal(UInt_32 W[16]);
private:
	void INIT();                //初始哈希
	
	UInt_32 ROT_left(UInt_32 W, int n);//左旋转
	UInt_32 SHIFT_right(UInt_32 W, int n); //右移位
};
