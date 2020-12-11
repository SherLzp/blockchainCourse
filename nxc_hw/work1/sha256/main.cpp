#include"SHA256.h"

typedef unsigned int u_int32;
typedef unsigned __int64 u_int64;
typedef unsigned char u_c;

#define MAX_C 2000



int main() {
	SHA256 sha = SHA256();
	M_Dige M_D;

	u_c inn[MAX_C];
	cout << "enter the text you want to convert to a SHA256 hash£º" << endl;
	cin >> inn;

	//initialize: append bits & append length
	u_c temp[MAX_C] = { 0 };
	
	u_int64 i;

	/*   append message    */
	u_int64 old_len = strlen((char *)inn);//given data length
	u_int32 ap_len = abs((int)(55 - old_len)) % 64;   //(length to append 0+old length+1)mod 64 = 56
	//first write data
	for (i = 0; i < old_len; i++) {
		temp[i] = inn[i];
	}
	//append 1000 0000
	temp[old_len] = 0x80;
	//loop ap_len times 00000000
	for (i = old_len + 1; i < old_len + ap_len + 1; i++) {
		temp[i] = 0x00;
	}

	/*   append length data (64bits)   */
	u_int64 n = (old_len + 8) / 64 + 1; //number of 64-length-part(512-bit chunks)
	u_int32 la_len = old_len % 64;   //given data left in last part 
	//write the last 8 length
	for (int j = 1; j <= 8; j++) {
		temp[(n * 64) - j] = (u_c)(8 * old_len >> (j - 1) * 8);
	}

	u_int32 M_o[MAX_C/4];
	u_int32 M[16];   //every chunk of message into sixteen 32-bit big-endian words
	u_int32 T1 = 0, T2 = 0, T3 = 0, T4 = 0;
	//u_c -> u_int big-endian
	for (i = 0; i < MAX_C / 4; i++) {
		T1 = temp[4 * i];
		T2 = temp[4 * i + 1];
		T3 = temp[4 * i + 2];
		T4 = temp[4 * i + 3];
		M_o[i] = (T1 << 24) + (T2 << 16) + (T3 << 8) + T4;
	}

	/* print the message in hexadecimal
	   cout << "message in hexadecimal£º";
	   for (i = 0; i < n * 16; i++) {
		   cout << hex << " " << M_o[i];
	   }
	   cout << endl;
   */

   //for each chunk of n chunks to deal
	for (i = 0; i < n; i++) {
		//cout << "for chunk " << i << endl;
		for (int j = 0; j < 16; j++) {
			M[j] = M_o[(i * 16) + j];//break chunk into sixteen 32-bit big-endian words
		}
		M_D = sha.DEAL(M);
		
	}
	//print final hash value
	cout << "SHA256 hash value£º ";
	for (int j = 0; j < 8; j++) {
		cout << hex << M_D.H[j] << " ";
	}
	cout << endl;
	return 0;
}
