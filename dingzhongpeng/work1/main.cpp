#include <iostream>
#include <string>
#include "head.h"
using namespace std;
#define MAX_LENGTH 2048

void add_on(unsigned char s[], unsigned int r[]) {
	unsigned __int64 x = strlen((char*)s);
	unsigned int l = abs(55 - (int)x) % 64;

	unsigned char temp[MAX_LENGTH];
	int i;
	for (i = 0; i < x; i++) {
		temp[i] = s[i];
	}
	temp[i] = 0x80;
	i = i + 1;
	for (int j = i; j < i + l; j++) {
		temp[j] = 0x00;
	}
	unsigned int n = (x + 8) / 64 + 1;
	for (i = 1; i <= 8; i++) {
		temp[(n * 64) - i] = (unsigned char)(8 * x >> (i - 1) * 8);
	}
	//无符号字符转换为无符号整型
	for (i = 0; i < MAX_LENGTH / 4; i++) {
		unsigned int T[4];
		for (int j = 0; j < 4; j++) {
			T[j] = temp[4 * i + j];
		}
		r[i] = (T[0] << 24) + (T[1] << 16) + (T[2] << 8) + T[3];
	}
	cout << endl;
}
void deal(unsigned int w[]) {
	unsigned int T1 = 0, T2 = 0;
	unsigned int a[64] = { 0 };
	unsigned int A = h[0], B = h[1], C = h[2], D = h[3], E = h[4], F = h[5], G = h[6], H = h[7];
	//cout << "Initial value:";
	//cout << hex << A << " " << B << " " << C << " " << D << " " << E << " " << F << " " << G << " " << H << endl;
	for (int i = 0; i < 16; i++) {
		a[i] = w[i];
	}
	for (int i = 16; i < 64; i++) {
		a[i] = SIG1(a[i - 2]) + a[i - 7] + SIG0(a[i - 15]) + a[i - 16];
	}
	for (int i = 0; i < 64; i++) {
		T1 = H + EP1(E) + CH(E, F, G) + k[i] + a[i];
		T2 = EP0(A) + MAJ(A, B, C);
		H = G;
		G = F;
		F = E;
		E = D + T1;
		D = C;
		C = B;
		B = A;
		A = T1 + T2;
		//cout << dec << i << ":";
		//cout << hex << A << " " << B << " " << C << " " << D << " " << E << " " << F << " " << G << " " << H << endl;
	}
	h[0] = (h[0] + A) & 0xFFFFFFFF;
	h[1] = (h[1] + B) & 0xFFFFFFFF;
	h[2] = (h[2] + C) & 0xFFFFFFFF;
	h[3] = (h[3] + D) & 0xFFFFFFFF;
	h[4] = (h[4] + E) & 0xFFFFFFFF;
	h[5] = (h[5] + F) & 0xFFFFFFFF;
	h[6] = (h[6] + G) & 0xFFFFFFFF;
	h[7] = (h[7] + H) & 0xFFFFFFFF;
}

int main() {
	unsigned char s[MAX_LENGTH];
	cout << "Input:";
	cin >> s;
	unsigned int w[MAX_LENGTH / 4];
	unsigned int n = (strlen((char*)s) + 8) / 64 + 1;	//分组数
	add_on(s, w);
	unsigned int m[16];
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < 16; j++) {
			m[j] = w[i * 16 + j];
		}
		deal(m);
	}
	cout << "Result: ";
	for (int i = 0; i < 8; i++) {
		cout << hex << h[i] << " ";
	}
	cout << endl;
	system("pause");
}