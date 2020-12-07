#include"SHA256.h"

//64个常量，是自然数中前64个质数的立方根小数前32位
const UInt32 K[64] = {
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
};

//初始化，前八个素数的平方根小数前32位
void SHA256::INIT()
{
    MD.H[0] = 0x6a09e667;
    MD.H[1] = 0xbb67ae85;
    MD.H[2] = 0x3c6ef372;
    MD.H[3] = 0xa54ff53a;
    MD.H[4] = 0x510e527f;
    MD.H[5] = 0x9b05688c;
    MD.H[6] = 0x1f83d9ab;
    MD.H[7] = 0x5be0cd19;
}

///512bit数据，返回信息
Message_Digest SHA256::Deal(UInt32 M[16]) {
    UInt32 T1 = 0, T2 = 0;
    UInt32 W[64] = {0};
    UInt32 A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0;
    //构造64个字
    for (int i = 0; i < 16; i++) {
        W[i] = M[i];
    }
    for (int i = 16; i < 64; i++) {
        W[i] = SSigma_1(W[i - 2]) + W[i - 7] + SSigma_0(W[i - 1]) + W[i - 16];
    }
    A = MD.H[0];
    B = MD.H[1];
    C = MD.H[2];
    D = MD.H[3];
    E = MD.H[4];
    F = MD.H[5];
    G = MD.H[6];
    H = MD.H[7];
    cout << "初始化 : ";
    cout << hex << A << " " << B << " " << C << " " << D 
        << " " << E << " " << F << " " << G << " " << H << endl;
    int i;
    for (i = 0; i < 64; i++) {
        T1 = H + LSigma_1(E) + Ch(E, F, G) + W[i] + K[i];
        T2 = LSigma_0(A) + Ma(A, B, C);
        H = G;
        G = F;
        F = E;
        E = D;
        D = C;
        C = B;
        B = A;
        A = T1 + T2;
        cout << dec << "t = " << i << " : ";
        cout << hex << A << " " << B << " " << C << " " << D << " " << E << " " << F << " " << G << " " << H << endl;
    }
    UInt32 temp1, temp2, temp3, temp4, temp5, temp6, temp7, temp8;
    temp1 = MD.H[0]; temp2 = MD.H[1]; temp3 = MD.H[2]; temp4 = MD.H[3];//用于cout数据
    temp5 = MD.H[4]; temp6 = MD.H[5]; temp7 = MD.H[6]; temp8 = MD.H[7];//用于cout数据
    MD.H[0] = (MD.H[0] + A) & 0xFFFFFFFF;
    cout << "H[0] = " << temp1 << " + " << A << " = " << MD.H[0] << endl;
    MD.H[1] = (MD.H[1] + B) & 0xFFFFFFFF;
    cout << "H[1] = " << temp2 << " + " << B << " = " << MD.H[1] << endl;
    MD.H[2] = (MD.H[2] + C) & 0xFFFFFFFF;
    cout << "H[2] = " << temp3 << " + " << C << " = " << MD.H[2] << endl;
    MD.H[3] = (MD.H[3] + D) & 0xFFFFFFFF;
    cout << "H[3] = " << temp4 << " + " << D << " = " << MD.H[3] << endl;
    MD.H[4] = (MD.H[4] + E) & 0xFFFFFFFF;
    cout << "H[4] = " << temp5 << " + " << E << " = " << MD.H[4] << endl;
    MD.H[5] = (MD.H[5] + F) & 0xFFFFFFFF;
    cout << "H[5] = " << temp6 << " + " << F << " = " << MD.H[5] << endl;
    MD.H[6] = (MD.H[6] + G) & 0xFFFFFFFF;
    cout << "H[6] = " << temp7 << " + " << G << " = " << MD.H[6] << endl;
    MD.H[7] = (MD.H[7] + H) & 0xFFFFFFFF;
    cout << "H[7] = " << temp8 << " + " << H << " = " << MD.H[7] << endl;

    return MD;
}

//右旋转
UInt32 SHA256::ROTR(UInt32 W, int n) {
    return ((W >> n) & 0xFFFFFFFF) | (W) << (32 - (n));
}
//左旋转
UInt32 SHA256::ROTL(UInt32 W, int n) {
    return ((W << n) & 0xFFFFFFFF) | (W) >> (32 - (n));
}
//右位移
UInt32 SHA256::SHR(UInt32 W, int n) {
    return ((W >> n) & 0xFFFFFFFF);
}