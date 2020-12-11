#include"My_SHA256.h"
#include<iomanip>
#pragma warning(disable:4996)
const unsigned int K[64] = {
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
};

SHA256::SHA256() {
    fresh();
}

void SHA256::fresh() {
    MD[0] = 0x6a09e667;
    MD[1] = 0xbb67ae85;
    MD[2] = 0x3c6ef372;
    MD[3] = 0xa54ff53a;
    MD[4] = 0x510e527f;
    MD[5] = 0x9b05688c;
    MD[6] = 0x1f83d9ab;
    MD[7] = 0x5be0cd19;
}

unsigned int* SHA256::sha256(unsigned char* s, int len) {
    fresh();
    unsigned int chunk_number = get_chunknumber(s, len);
    //unsigned int chunk_number = appendLength(s, len);
    s = appendLength(s, len);
    unsigned int** chunks = divide(s, chunk_number);
    for (int i = 0; i < chunk_number; i++) {
        deal(chunks[i]);
    }
    
    for (int i = 0; i < chunk_number; i++) {
        unsigned int* p = chunks[i];
        delete[] p;
    }
    delete[] chunks;
    unsigned int* md = new unsigned int[8];
    for (int i = 0; i < 8; i++)    md[i] = MD[i];
    return md;
}

void SHA256::deal(unsigned int* chunk) {
    int i;
    unsigned int T1 = 0, T2 = 0;
    unsigned int W[64] = { 0 };
    unsigned int A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0;
    for (i = 0; i < 16; i++) {
        W[i] = chunk[i];
    }
    for (i = 16; i < 64; i++) {
        W[i] = SSigma_1(W[i - 2]) + W[i - 7] + SSigma_0(W[i - 15]) + W[i - 16];
    }
    A = MD[0];
    B = MD[1];
    C = MD[2];
    D = MD[3];
    E = MD[4];
    F = MD[5];
    G = MD[6];
    H = MD[7];
    for (i = 0; i < 64; i++) {
        T1 = H + LSigma_1(E) + Ch(E, F, G) + K[i] + W[i];
        T2 = LSigma_0(A) + Ma(A, B, C);
        H = G;
        G = F;
        F = E;
        E = D + T1;
        D = C;
        C = B;
        B = A;
        A = T1 + T2;
    }
    MD[0] = (MD[0] + A) & 0xFFFFFFFF;
    MD[1] = (MD[1] + B) & 0xFFFFFFFF;
    MD[2] = (MD[2] + C) & 0xFFFFFFFF;
    MD[3] = (MD[3] + D) & 0xFFFFFFFF;
    MD[4] = (MD[4] + E) & 0xFFFFFFFF;
    MD[5] = (MD[5] + F) & 0xFFFFFFFF;
    MD[6] = (MD[6] + G) & 0xFFFFFFFF;
    MD[7] = (MD[7] + H) & 0xFFFFFFFF;
}
unsigned int SHA256::get_chunknumber(unsigned char* s, int len) {
    unsigned int left = len % 64;
    unsigned int needed = left <= 56 ? 56 - left : 120 - left;  //需要填充的长度
    unsigned int chunk_number = (len + needed + 8) / 64;
    return chunk_number;
}
unsigned char* SHA256::appendLength(unsigned char* s, int len) {
    unsigned int left = len % 64;
    unsigned int needed = left <= 56 ? 56 - left : 120 - left;  //需要填充的长度
    unsigned int chunk_number = (len + needed + 8) / 64;
    
    unsigned char* new_s = new unsigned char[len + needed + 9];
    for (int i = 0; i < len; i++) {
        new_s[i] = s[i];
    }
    delete[]s;
    s = new_s;
    if (needed != 0) {
        s[len] = 0x80;
    }
    for (int i = 0; i < needed - 1; i++) {
        s[len + 1 + i] = 0;
    }
    //填充最后8byte
    s[len + needed + 0] = s[len + needed + 1] = s[len + needed + 2] = s[len + needed + 3] = 0;
    unsigned int t = len * 8;
    unsigned char* l = (unsigned char*)(&t);
    s[len + needed + 4] = l[3]; s[len + needed + 5] = l[2]; s[len + needed + 6] = l[1]; s[len + needed + 7] = l[0];
    s[len + needed + 8] = 0;
    return s;
}

unsigned int** SHA256::divide(unsigned char* s, unsigned int chunk_number) {
    unsigned int** chunks = new (unsigned int*[chunk_number]);
    for (int i = 0; i < chunk_number; i++) {
        chunks[i] = new unsigned int[16];
        for (int j = 0; j < 16; j++) {
            unsigned int T1 = (unsigned int)s[64 * i + 4 * j + 0];
            unsigned int T2 = (unsigned int)s[64 * i + 4 * j + 1];
            unsigned int T3 = (unsigned int)s[64 * i + 4 * j + 2];
            unsigned int T4 = (unsigned int)s[64 * i + 4 * j + 3];
            unsigned int t = (T1 << 24) + (T2 << 16) + (T3 << 8) + T4;
            chunks[i][j] = t;
        }
    }
    return chunks;
}

unsigned int SHA256::Ch(unsigned int x, unsigned int y, unsigned int z) {
    return ((x & y) ^ ((~x) & z));
}
unsigned int SHA256::Ma(unsigned int x, unsigned int y, unsigned int z) {
    return ((x & y) ^ (x & z) ^ (y & z));
}
unsigned int SHA256::LSigma_0(unsigned int x) {
    return SRA(x,2) ^ SRA(x, 13) ^ SRA(x, 22);
}
unsigned int SHA256::LSigma_1(unsigned int x) {
    return SRA(x, 6) ^ SRA(x, 11) ^ SRA(x, 25);
}
unsigned int SHA256::SSigma_0(unsigned int x) {
    return SRA(x, 7) ^ SRA(x, 18) ^ SRL(x, 3);
}
unsigned int SHA256::SSigma_1(unsigned int x) {
    return SRA(x, 17) ^ SRA(x, 19) ^ SRL(x, 10);
}

/*POW*/

int main() {
    SHA256 sha256;
    char* s = new char[1000];
    char* A = new char[1000];
    char* B = new char[1000];
    char* C = new char[1000];
    char* D = new char[1000];
    int cnt = 0;
    strcpy(A, "ABCDEFG");
    strcpy(B, "ABEjafnln8owh3oGuGGgi7g68gigwohFG");
    strcpy(C, "jafnln8ooGUKBukeknwanto8q24n0npqmnganpbmanib8h8h3nr13lr1bbbnlainfbukG7OIGOgi7g68gtigfrnwohFG");
    strcpy(D, "123456789QWERTYUIOP");
    strcpy(s, C);
    
    unsigned int* MD = sha256.sha256((unsigned char*)s, strlen(s));
    cnt++;
    while(false){
    //while (MD[0]&0xf0000000) {
        cout << hex << setw(8) << setfill('0') << MD[0] << MD[1] << MD[2] << MD[3] << MD[4] << MD[5] << MD[6] << MD[7] << "                                "  << cnt << endl;
        MD = sha256.sha256((unsigned char*)(MD));
        cnt++;
    }
    cout << hex << setw(8) << setfill('0')  << MD[0] << MD[1] << MD[2] << MD[3] << MD[4] << MD[5] << MD[6] << MD[7] << endl;
    cout << dec << cnt << endl;
    system("pause");
    return 0;
}


/*Merkle Tree*/
/*
void printMD(unsigned int* MD) {
    cout << hex << setfill('0')<< MD[0] << MD[1] << MD[2] << MD[3] << MD[4] << MD[5] << MD[6] << MD[7] << endl;
}

int main() {
    SHA256 sha256;
    char* A = new char[1000];
    char* B = new char[1000];
    char* C = new char[1000];
    char* D = new char[1000];
    int cnt = 0;
    strcpy(A, "ABCDEFG");
    strcpy(B, "ABEjafnln8owh3oGuGGgi7g68gigwohFG");
    strcpy(C, "jafnln8ooGUKBukeknwanto8q24n0npqmnganpbmanib8h8h3nr13lr1bbbnlainfbukG7OIGOgi7g68gtigfrnwohFG");
    strcpy(D, "123456789QWERTYUIO");
    unsigned int* HA0 = new unsigned int[8];
    unsigned int* HA = new unsigned int[8];
    unsigned int* HB0 = new unsigned int[8];
    unsigned int* HB = new unsigned int[8];
    unsigned int* HC0 = new unsigned int[8];
    unsigned int* HC = new unsigned int[8];
    unsigned int* HD0 = new unsigned int[8];
    unsigned int* HD = new unsigned int[8];
    unsigned int* HAB0 = new unsigned int[8];
    unsigned int* HAB = new unsigned int[8];
    unsigned int* HCD0 = new unsigned int[8];
    unsigned int* HCD = new unsigned int[8];
    unsigned int* HABCD0 = new unsigned int[8];
    unsigned int* HABCD = new unsigned int[8];
    unsigned int* AB = new unsigned int[8];
    unsigned int* CD = new unsigned int[8];
    unsigned int* ABCD = new unsigned int[8];
    HA0 = sha256.sha256((unsigned char*)A, strlen(A));
    HB0 = sha256.sha256((unsigned char*)B, strlen(B));
    HC0 = sha256.sha256((unsigned char*)C, strlen(C));
    HD0 = sha256.sha256((unsigned char*)D, strlen(D));
    HA = sha256.sha256((unsigned char*)HA0);
    HB = sha256.sha256((unsigned char*)HB0);
    HC = sha256.sha256((unsigned char*)HC0);
    HD = sha256.sha256((unsigned char*)HD0);
    cout << "HA = "; printMD(HA);
    cout << "HB = "; printMD(HB);
    cout << "HC = "; printMD(HC);
    cout << "HD = "; printMD(HD);
    unsigned long CarryAB = 0;
    unsigned long CarryCD = 0;
    for (int i = 7; i >=0 ; i--) {
        AB[i] = (unsigned int)((unsigned long)HA[i] + (unsigned long)HB[i] + CarryAB);
        CD[i] = (unsigned int)((unsigned long)HC[i] + (unsigned long)HD[i] + CarryCD);
        CarryAB = ((unsigned long)HA[i] + (unsigned long)HB[i] + CarryAB) > 0xffffffff ? 1 : 0;
        CarryCD = ((unsigned long)HC[i] + (unsigned long)HD[i] + CarryCD) > 0xffffffff ? 1 : 0;
    }
    HAB0 = sha256.sha256((unsigned char*)AB);
    HCD0 = sha256.sha256((unsigned char*)CD);
    HAB = sha256.sha256((unsigned char*)HAB0);
    HCD = sha256.sha256((unsigned char*)HCD0);
    cout << "HAB = "; printMD(HAB);
    cout << "HCD = "; printMD(HCD);
    unsigned long CarryABCD = 0;
    for (int i = 7; i >= 0; i--) {
        ABCD[i] = (unsigned int)((unsigned long)HAB[i] + (unsigned long)HCD[i] + CarryABCD);
        CarryABCD = ((unsigned long)HAB[i] + (unsigned long)HCD[i] + CarryABCD) > 0xffffffff ? 1 : 0;
    }
    HABCD = sha256.sha256((unsigned char*)ABCD);
    HABCD0 = sha256.sha256((unsigned char*)HABCD);
    cout << "HABCD = "; printMD(HABCD);
    system("pause");
    return 0;
}

*/