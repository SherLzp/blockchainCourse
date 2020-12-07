#include <iostream>
#include <fstream>
#include <time.h>
#include"SHA256.h"
using namespace std;

void testPoW();    // 测试PoW算法
void testSHA256(); // 测试ASH256算法

int main() {
	cout << "请输入数字1或2\n输入1：进行SHA256加密测试\n输入2：进行PoW算法测试\n";
	int choice = 0;
	cin >> choice;
	getchar();
	switch (choice)
	{
	case 1:
		testSHA256();
		break;
	case 2:
		testPoW();
		break;
	default:
		break;
	}
	
	system("pause");
	return 0;
}

void testSHA256() {
	char string[Max];
	SHA256 sha256 = SHA256();
	//clock_t start, end;   // 计时
	//double duration;
	
	cout << "请输入要加密的字符串（不超过" << MaxChar << "个字符）：" << endl;
	cin.getline(string, Max);
	WORD* MD2 = NULL;

	while (1) {
		/*start = clock();
		for(int i =0;i<10000;i++) MD2 = sha256.encryption(string);
		end = clock();
		duration = (double)(end - start) / CLOCKS_PER_SEC;*/

		MD2 = sha256.encryption(string);
		for (int i = 0; i < 8; i++) {
			cout << hex << MD2[i] << " ";
		}
		cout << endl;
		//cout << "\t" << duration << endl;
		cin.getline(string, Max);
	}
}

void testPoW() {
	char string[Max];
	cout << "请输入要加密的字符串（不超过" << Max << "个字符）：" << endl;
	cin.getline(string, Max);

	SHA256 sha256 = SHA256();
	int l = strlen(string);

	for (int i = 0; i < 1000; i++) {
		// 生成不同的字符串
		int t = i, n = 0, digit[100];
		do {
			digit[n] = t % 10 + 48;
			t /= 10;
			n++;
		} while (t != 0);

		for (int i = n - 1; i >= 0; i--) {
			string[l + i] = (Uchar)digit[n - 1 - i];
		}
		string[l + n] = '\0';

		ofstream outfile("output.txt", ios::app);
		outfile << string << "\t";
		outfile.close();
		WORD* MD = sha256.PoW(string);
	}
}