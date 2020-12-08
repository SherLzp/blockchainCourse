#include "SHA256.h"

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

const unsigned int H0[8] = {
    0x6a09e667,
    0xbb67ae85,
    0x3c6ef372,
    0xa54ff53a,
    0x510e527f,
    0x9b05688c,
    0x1f83d9ab,
    0x5be0cd19
};


void SHA256::init() {
    for (int i = 0; i < 8; i++) {
        H[i] = H0[i];
    }
}

// L2B: little endian convert to big endian
unsigned int SHA256::L2B(unsigned int num) {
    return ((num & 0xff) << 24) |
        ((num & 0xff00) << 8) |
        ((num & 0xff0000) >> 8) |
        ((num >> 24) & 0xff);
}

// processChunk: this function cope with each 512-bit chunk
void SHA256::processChunk(unsigned int chunk[]) {
    unsigned int hash_value[8];// a,b,c,d,e,f,g,h


    //First 16 32-bit words
    unsigned int W[64] = {0};
    for (int i = 0; i < 16; i++) {
        W[i] = L2B(chunk[i]);
    }
    // Extend the 16 32-bit words to 64
    for (int i = 16; i < 64; i++) {
        unsigned int s0 = _sigma_0(W[i - 15]);
        unsigned int s1 = _sigma_1(W[i - 2]);
        W[i] = W[i - 16] + s0 + W[i - 7] + s1;
    }

    //std::cout << "\nInitial:\n";
    for (int i = 0; i < 8; i++) {
        hash_value[i] = H[i];
        //std::cout << std::hex << hash_value[i] << " ";
    }

    //Main Loop
    for (int i = 0; i < 64; i++) {
        unsigned int temp2 = Sigma_0(hash_value[0]) + Ma(hash_value[0], hash_value[1], hash_value[2]);
        unsigned int temp1 = hash_value[7] + Sigma_1(hash_value[4]) + Ch(hash_value[4], hash_value[5], hash_value[6]) + K[i] + W[i];
        hash_value[7] = hash_value[6];                //h
        hash_value[6] = hash_value[5];                //g
        hash_value[5] = hash_value[4];                //f
        hash_value[4] = hash_value[3] + temp1;        //e
        hash_value[3] = hash_value[2];                //d
        hash_value[2] = hash_value[1];                //c
        hash_value[1] = hash_value[0];                //b
        hash_value[0] = temp1 + temp2;                //a

        //output
       /* std::cout <<"\n"<< i << ":"<<std::hex
            << hash_value[0] << " "
            << hash_value[1] << " "
            << hash_value[2] << " "
            << hash_value[3] << " "
            << hash_value[4] << " "
            << hash_value[5] << " "
            << hash_value[6] << " "
            << hash_value[7] ;*/
    }
    //std::cout << std::endl;


    for (int i = 0; i < 8; i++) {
        // final addition
        H[i] += hash_value[i];
    }

}


void SHA256::encryptMessage(void* src, __int64 c_num) {
    
    //512 = 64 char = 16 uint32 = 8 uint64
    int chunkNum = c_num * CHAR_BIT / CHUNK_LENGTH + 1;
    int mod = (c_num * CHAR_BIT)% CHUNK_LENGTH;
    if (mod >= 448)chunkNum++;
    
    char* cptr = (char*)src;
    *(cptr + c_num) = 1<<7; // extension 1000 0000
    
    uint64_t bit_num = c_num * CHAR_BIT;

    // message length 64bit
    for (int i = 0; i < 8; i++) {
        *(cptr + chunkNum * CHUNK_LENGTH / CHAR_BIT - i-1) = bit_num >> (i * CHAR_BIT);
       /* std::cout << (bit_num >> (i * CHAR_BIT));*/
    }

    

    unsigned int* cursor_32 = (unsigned int*)src;
    for (int i = 0; i < chunkNum; i++) {
        processChunk(cursor_32);
        cursor_32 += 16;
    }
    //std::cout << "\n----------result----------\n";
    //for(int i = 0;i<8;i++) printf("%x", H[i]);
    //std::cout << "\n";
    //memset(src, 0, MAXN);
    //memcpy(src, str.c_str(), str.size());
    
}
