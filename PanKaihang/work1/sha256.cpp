#include "sha256.h"

using namespace std;

// Some hash constants.
const uInt32 Sha256::K[64] = {
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
};

// constructor
Sha256::Sha256(string str){
    oriStr = (char *)str.c_str();
    // variable initialization
    H[0] = 0x6a09e667;  H[1] = 0xbb67ae85;
    H[2] = 0x3c6ef372;  H[3] = 0xa54ff53a;
    H[4] = 0x510e527f;  H[5] = 0x9b05688c;
    H[6] = 0x1f83d9ab;  H[7] = 0x5be0cd19;
}

// destructor
Sha256::~Sha256(){
    if(M != NULL)
        delete [] M;
}

// the funtion to rotate right.
uInt32 Sha256::rightRot(uInt32 w, int n){
    return ((w>>n)&0xFFFFFFFF) | (w<<(32-n));
}

// pre-process the input string.
void Sha256::preProcess(){
    int i;
    uInt64 len = strlen(oriStr);    // the length of the input string.
    uInt32 padNum = (len<56) ? (56-len) : (64 - (len-56)%64);   // the number of bytes to pad.
    totalSize = len + padNum + 8;   // the total length of the string after pre-processing.
    uChar *str = new uChar[totalSize]; 
    for(i=0; i<len; i++){
        str[i] = (uChar)oriStr[i];
    } 
    str[len] = 0x80;                // the first padding bit is 1.
    for(i=1; i<padNum; i++){        // other padding bits is 0.
        str[len+i] = 0x00;
    } 
    for(i=0; i<8; i++){             // attach the value of length.
        str[len+padNum+i] = (uChar)(((8*len)>>(56-i*8)) & 0xFF);
    }
    M = new uInt32[totalSize/4];    
    for(i=0; i<totalSize/4; i++){   // divide the message into 32 bits.
        uInt32 M1, M2, M3, M4;
        M1 = (uInt32)str[i*4+0] & 0xFF;
        M2 = (uInt32)str[i*4+1] & 0xFF;
        M3 = (uInt32)str[i*4+2] & 0xFF;
        M4 = (uInt32)str[i*4+3] & 0xFF;
        M[i] = (M1<<24) | (M2<<16) | (M3<<8) | M4;
    }
    delete []str;
}

// Calculate the message digest.
void Sha256::calMessageDigest(){
    int num, i;
    // An iteration is performed every 512bits
    for(num=0; num < totalSize/64; num++){
        uInt32 a, b, c, d, e, f, g, h;
        for(i=0; i<16; i++)
            W[i] = M[16*num+i];
        for(i=16; i<64; i++){  // calculate W[16] to W[63]
            uInt32 s0, s1;
            s0 = rightRot(W[i-15], 7) ^ rightRot(W[i-15], 18) ^ (W[i-15]>>3);
            s1 = rightRot(W[i-2], 17) ^ rightRot(W[i-2], 19) ^ (W[i-2]>>10);
            W[i] = W[i-16] + s0 + W[i-7] + s1;
        }
        a = H[0];   b = H[1];
        c = H[2];   d = H[3];
        e = H[4];   f = H[5];
        g = H[6];   h = H[7];
        for(i=0; i<64; i++){    // Perform 64 cycles.
            uInt32 s0, s1, t1, t2, ch, maxj;
            s0 = rightRot(a, 2) ^ rightRot(a, 13) ^ rightRot(a, 22);
            maxj = (a & b) ^ (a & c) ^ (b & c);
            t2 = s0 + maxj;
            s1 = rightRot(e, 6) ^ rightRot(e, 11) ^ rightRot(e, 25);
            ch = (e & f) ^ ((~e) & g);
            t1 = h + s1 + ch + K[i] + W[i];
            h = g;
            g = f;
            f = e;
            e = d + t1;
            d = c;
            c = b;
            b = a;
            a = t1 + t2;
        }
        // calculate H[0] to H[7]
        H[0] += a;
        H[1] += b;
        H[2] += c;
        H[3] += d;
        H[4] += e;
        H[5] += f;
        H[6] += g;
        H[7] += h;
    }
}

// get the hash code of SHA256
uInt32 * Sha256::getHash(){
    int i;
    preProcess();
    calMessageDigest();
    for(i=0; i<8; i++)
        cout << hex << setw(8) << setfill('0') << H[i];
    cout << endl;
    return H;
}