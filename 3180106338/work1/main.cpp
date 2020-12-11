#include <iostream>
#include "sha256.h"
using namespace std;

int main()
{
	string str;				   //输入字符串
	unsigned char res[64] = {};//产生的64位哈希值
	char finalRes[65] = {};	   //格式化输出

	cout << "Input your string: " << endl;//输入随机字符串
	cin >> str;

	SHA256 sha256 = SHA256();
	sha256.Initial();
	//迭代过程和生成过程
	sha256.Iteration((unsigned char*)str.c_str(), str.length());
	sha256.Generate(res);
	for (int i = 0; i < 32; i++) sprintf(finalRes + i * 2, "%02x", res[i]);

	cout << endl;//输出结果
	cout << "SHA256-Value: "<< string(finalRes) << endl;
	return 0;
}