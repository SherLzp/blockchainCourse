#include<iostream>
#include<math.h>
#include"SHA-256.h"
using namespace std;

SHA_256 tool;
Message_Digest mess_dige;
UInt_32 RWT[Max/4];
UInt_32 MG[16];   

//压缩输出
void comp();

//填充
void fill(UChar target[Max]);

int main() 
{
	UChar target[Max];
	cout << "最大加密长度" << Max << "\n 输入需要加密的内容:" << endl;
	cin >> target;
	fill(target);
	return 0;
}

void comp() {
	int i;
	mess_dige = tool.deal(MG);
	cout << "hash output:";
	for (i = 0; i < 8; i++)
		cout << hex << mess_dige.Digest[i] << " ";
	cout << endl;
}

void fill(UChar target[Max]) {
	//len+1+len_fil+l=|len|
	
	UInt_32 T[4] = {0};
	UChar temp[Max] = { 0 };
	UInt_64 len = strlen((char *)target);     //数据长度
	UInt_32 len_fil = abs(55 - (long long)len) % 64;   //填充长度
	UInt_32 gnum = (len + 8) / 64 + 1;    //组数
	//不填充
	for (UInt_32 i = 0; i < len; i++) 
		temp[i] = target[i];
	
	//填充1次1000 0000
	temp[len] = 0x80;

	//填充0
	for (UInt_32 i = len + 1; i < len + len_fil + 1; i++) 
		temp[i] = 0x00;
	
	//填充
	for (UInt_32 i = 1; i <= 8; i++) 
		temp[(gnum * 64) - i] = (UChar)(8 * len >> (i - 1) * 8);
	

	for (UInt_32 i = 0; i < Max / 4; i++)
	{
		for (UInt_32 j = 0; j < 4; j++)
			T[j] = temp[4 * i + j];
		RWT[i] = (T[0] << 24) + (T[1] << 16) + (T[2] << 8) + T[3];
	}

	for (UInt_32 i = 0; i < gnum; i++)
	{
		for (UInt_32 j = 0; j < 16; j++)
			MG[j] = RWT[(i * 16) + j];
		//SHA_256 
		comp();
	}
}
