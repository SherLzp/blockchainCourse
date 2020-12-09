#include"SHA256.h"

//Initialize hash variables
void SHA256::init_hash() {
	MD.H[0] = 0x6a09e667;
	MD.H[1] = 0xbb67ae85;
	MD.H[2] = 0x3c6ef372;
	MD.H[3] = 0xa54ff53a;
	MD.H[4] = 0x510e527f;
	MD.H[5] = 0x9b05688c;
	MD.H[6] = 0x1f83d9ab;
	MD.H[7] = 0x5be0cd19;
}

//deal process for each chunck
M_Dige SHA256::DEAL(u_int32 M[16]) {
	int i;
	u_int32 T1 = 0, T2 = 0;
	u_int32 W[64] = { 0 };
	u_int32 A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0;
	/* build 64 words*/
	for (i = 0; i < 16; i++) {
		W[i] = M[i];
	}
	for (i = 16; i < 64; i++) {
		W[i] = sigma_1(W[i - 2]) + W[i - 7] + sigma_0(W[i - 15]) + W[i - 16];
	}
	A = MD.H[0];
	B = MD.H[1];
	C = MD.H[2];
	D = MD.H[3];
	E = MD.H[4];
	F = MD.H[5];
	G = MD.H[6];
	H = MD.H[7];

	for (i = 0; i < 64; i++) {
		T1 = H + Sigma1(E) + Ch(E, F, G) + K[i] + W[i];
		T2 = Sigma0(A) + Ma(A, B, C);
		H = G;
		G = F;
		F = E;
		E = D + T1;
		D = C;
		C = B;
		B = A;
		A = T1 + T2;
		/* print each result of 64 encryption loops
		cout << dec << i << ":";
		cout << hex << A << " " << B << " " << C << " " << D << " " << E << " " << F << " " << G << " " << H << endl;
	*/
	}

	//add this chunk's hash to result
	MD.H[0] = (MD.H[0] + A) & 0xFFFFFFFF;
	MD.H[1] = (MD.H[1] + B) & 0xFFFFFFFF;
	MD.H[2] = (MD.H[2] + C) & 0xFFFFFFFF;
	MD.H[3] = (MD.H[3] + D) & 0xFFFFFFFF;
	MD.H[4] = (MD.H[4] + E) & 0xFFFFFFFF;
	MD.H[5] = (MD.H[5] + F) & 0xFFFFFFFF;
	MD.H[6] = (MD.H[6] + G) & 0xFFFFFFFF;
	MD.H[7] = (MD.H[7] + H) & 0xFFFFFFFF;

	return MD;
}

u_int32 S(u_int32 W, int n) {
	return ((W >> n) & 0xFFFFFFFF) | (W) << (32 - (n));
}

u_int32 R(u_int32 W, int n) {
	return ((W >> n) & 0xFFFFFFFF);
}