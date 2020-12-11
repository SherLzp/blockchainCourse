#include <iostream>
#include <string>
#include <vector>
#include <iomanip>
#include <cstdlib>
#include <csdtio>
using namespace std;

const unsigned int K[64] = {
	0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
	0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
	0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
	0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
	0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
	0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
	0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
	0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
};//64个常量
unsigned int H[8] = {
	0x6a09e667, 0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19
};//8个哈希初值

unsigned int A = H[0], B = H[1], C = H[2], D = H[3], E = H[4], F = H[5], G = H[6], h = H[7];

class word {
public:
	unsigned int w[64];
};//用于存储每一个512Bit的信息块所生成的64个word

vector<word>M;//用于存储整个信息块

//以下是需要用的6种逻辑操作
unsigned int ch(unsigned int x, unsigned int y, unsigned int z) {
	return (x&y) ^ ((~x) & z);
}

unsigned int ma(unsigned int x, unsigned int y, unsigned int z) {
	return (x&y) ^ (x&z) ^ (y&z);
}

unsigned int s0(unsigned int x) {
	return ((x >> 2) | (x << 30)) ^ ((x >> 13)  | (x << 19)) ^ ((x >> 22)  | (x << 10));
}

unsigned int s1(unsigned int x) {
	return ((x >> 6) | (x << 26)) ^ ((x >> 11)  | (x << 21)) ^ ((x >> 25)| (x << 7));
}

unsigned int th0(unsigned int x) {
	return ((x >> 7)  | (x << 25)) ^ ((x >> 18)  | (x << 14)) ^ (x >> 3);
}

unsigned int th1(unsigned int x) {
	return ((x >> 17) | (x << 15)) ^ ((x >> 19)  | (x << 13)) ^ (x >> 10);
}

void Preproc(string m) {//数据预处理，实现补位以及长度值的附加
	unsigned long long int length = m.length() * 8;//计算数据长度
	int indexm = 0;
	int blocknum = length / 512;//计算数据所占块数
	int modnum = length % 512;//计算数据对512取余数据，用于计算补位0的数量
	if (modnum >= 448) {//如果取余数据大于等于448，说明当前块已不足以放下64位的长度数据，只能放在下一块中，所以要在原值基础上+2
		modnum += 512;
		blocknum += 2;
	}
	else
		blocknum++;
	M.resize(blocknum);
	int appendlen = 0;
	if (modnum >= 448)//需补0的个数
		appendlen = modnum - 449;
	else
		appendlen = 447 - modnum;
	if (appendlen <= 447) {//说明64位长度信息可以直接放在最后一块末尾
		for (int i = 0; i < M.size() - 1; i++) {
			for (int j = 0; j < 16; j++) {
				for (int k = 0; k < 4; k++) {
					if (m[indexm] < 0)//中文
						M[i].w[j] = (M[i].w[j] << 8) + (unsigned int)(m[indexm++] + 256);
					else//非中文
						M[i].w[j] = (M[i].w[j] << 8) + (unsigned int)(m[indexm++]);//将输入数据按序存储进每一个word中
				}
			}
		}
		int count = 0;
		int indexv = 0;
		while (indexm < m.length()) {//将不能填满最后一块的数据存入最后一块中
			if (count % 4 == 0&&count!=0) {//一个word可以存放4个字符，满了4个就换下一个word存储
				indexv++;
			}
			if (m[indexm] < 0)//中文
				M[M.size() - 1].w[indexv] = (M[M.size() - 1].w[indexv] << 8) + (unsigned int)(m[indexm++] + 256);
			else//非中文
				M[M.size() - 1].w[indexv] = (M[M.size() - 1].w[indexv] << 8) + (unsigned int)(m[indexm++]);
			count++;
		}
		if (count % 4 == 0 && count != 0)
			indexv++;
		M[M.size() - 1].w[indexv] = (M[M.size() - 1].w[indexv] << 1) + 1;//补1
		M[M.size() - 1].w[indexv] = (M[M.size() - 1].w[indexv] << (appendlen%32));//补0
		M[M.size() - 1].w[14] = (unsigned int)((0xffffffff00000000 & length) >> 32);//将数据长度存入word中
		M[M.size() - 1].w[15] = (unsigned int)(0x00000000ffffffff & length);
	}
	else {//64位长度信息无法直接放在最后一块末尾，额外通过补位生成一块后在其末尾放长度信息
		for (int i = 0; i < M.size() - 2; i++) {
			for (int j = 0; j < 16; j++) {
				for (int k = 0; k < 4; k++)
					if (m[indexm] < 0)//中文
						M[i].w[j] = (M[i].w[j] << 8) + (unsigned int)(m[indexm++] + 256);
					else//非中文
						M[i].w[j] = (M[i].w[j] << 8) + (unsigned int)(m[indexm++]);//将输入数据按序存储进每一个word中
			}
		}
		int count = 0;
		int indexv = 0;
		while (indexm < m.length()) {//将不能填满最后一块的数据存入倒数第二块中
			if (count % 4 == 0 && count != 0) {//一个word可以存放4个字符，满了4个就换下一个word存储
				indexv++;
			}
			if (m[indexm] < 0)//中文
				M[M.size() - 2].w[indexv] = (M[M.size() - 2].w[indexv] << 8) + (unsigned int)(m[indexm++] + 256);
			else//非中文
				M[M.size() - 2].w[indexv] = (M[M.size() - 2].w[indexv] << 8) + (unsigned int)(m[indexm++]);
			count++;
		}
		if (count % 4 == 0 && count != 0)
			indexv++;
		M[M.size() - 2].w[indexv] = (M[M.size() - 2].w[indexv] << 1) + 1;//补1
		M[M.size() - 2].w[indexv] = (M[M.size() - 2].w[indexv] << ((appendlen -448)%32));//补0
		M[M.size() - 1].w[14] = (unsigned int)((0xffffffff00000000 & length) >> 32);//将数据长度存入最后一块末尾
		M[M.size() - 1].w[15] = (unsigned int)(0x00000000ffffffff & length);
	}
}

void Construct64w(int index){//生成第17-64个word
	for (int i = 16; i < 64; i++) {
		M[index].w[i] = (th1(M[index].w[i - 2]) + M[index].w[i - 7] + th0(M[index].w[i - 15]) + M[index].w[i - 16])&0xffffffff;
	}
}

void dotheloop(int i,int wordnum) {//进行循环
	unsigned int t1 = ((h + s1(E) + ch(E, F, G) + K[i] + M[wordnum].w[i])) & 0xffffffff;//执行对应逻辑操作
	unsigned int t2 = (s0(A) + ma(A,B,C)) & 0xffffffff;//执行对应逻辑操作
	h = G;
	G = F;
	F = E;
	E = (D + t1) & 0xffffffff;
	D = C;
	C = B;
	B = A;
	A = (t1 + t2) & 0xffffffff;
}

int main() {
	string message="";
	char op = 'y';
	cout << "请输入信息：" << endl;
	getline(cin, message);//输入信息
	if (message == "") {
		cout << "请问是否确定输入空字符串？y-确定 n-我输入了回车,还想继续输入" << endl;
	}
	else {
		cout << "请问是否结束输入？y-确定 n-我只是输入回车，还想继续输入" << endl;
	}
	cin >> op;
	getchar();
	if (op != 'n'&&op != 'y') {
		cout << "无效选项 程序结束" << endl;
		return 0;
	}
	if (op == 'n') {
		string str = "";
		while (op != 'y') {
			if (op != 'n') {
				cout << "无效选项 程序结束" << endl;
				return 0;
			}
			message.append(str);
			message += '\n';//加一个回车到string中
			cout << "请继续输入" << endl;
			getline(cin, str);
			cout << "请问是否结束输入？y-确定 n-我只是输入回车，还想继续输入" << endl;
			cin >> op;
			getchar();
		}
		message.append(str);
	}
	Preproc(message);//预处理信息
	for (int i = 0; i < M.size(); i++) {//根据数据块数，进行对应加密循环
		Construct64w(i);//对每一个信息块，生成对应64个word
		for (int j = 0; j < 64; j++) {//进行64次加密循环
			dotheloop(j, i);
		}
		//更新8个哈希值
		H[0] = (H[0] + A) & 0xffffffff;
		H[1] = (H[1] + B) & 0xffffffff;
		H[2] = (H[2] + C) & 0xffffffff;
		H[3] = (H[3] + D) & 0xffffffff;
		H[4] = (H[4] + E) & 0xffffffff;
		H[5] = (H[5] + F) & 0xffffffff;
		H[6] = (H[6] + G) & 0xffffffff;
		H[7] = (H[7] + h) & 0xffffffff;
		A = H[0], B = H[1], C = H[2], D = H[3], E = H[4], F = H[5], G = H[6], h = H[7];
	}
	for (int i = 0; i < 8; i++) {//输出结果
		cout << setiosflags(ios::uppercase) << hex <<setw(8)<<setfill('0')<< H[i];
	}
	cout << endl;
	system("pause");
	return 0;
}