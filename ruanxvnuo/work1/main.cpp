#include <iostream>
#include "sha256.h"
using namespace std;

int main()
{
	string str;				   //�����ַ���
	unsigned char res[64] = {};//������64λ��ϣֵ
	char finalRes[65] = {};	   //��ʽ�����

	cout << "Input your string: " << endl;//��������ַ���
	cin >> str;

	SHA256 sha256 = SHA256();
	sha256.Initial();
	//�������̺����ɹ���
	sha256.Iteration((unsigned char*)str.c_str(), str.length());
	sha256.Generate(res);
	for (int i = 0; i < 32; i++) sprintf(finalRes + i * 2, "%02x", res[i]);

	cout << endl;//������
	cout << "SHA256-Value: "<< string(finalRes) << endl;
	return 0;
}