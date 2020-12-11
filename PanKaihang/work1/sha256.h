#ifndef _SHA_256_H
#define _SHA_256_H

#include <iostream>
#include <string>
#include <cstring>
#include <iomanip>

using namespace std;

typedef unsigned int uInt32;
typedef unsigned long long int uInt64;
typedef unsigned char uChar; 

class Sha256{
    private:
        static const uInt32 K[64];
        uInt32 H[8];
        char * oriStr;
        uInt32 * M;
        uInt32 W[64];
        uInt64 totalSize;   // the total size of the message after padding.
    private:
        // the funtion to rotate right.
        uInt32 rightRot(uInt32 w, int n);
        // pre-process the input string.
        void preProcess();
        // Calculate the message digest.
        void calMessageDigest();
    public:
        // constructor
        Sha256(string str);
        // destructor
        ~Sha256();
        // get the hash code of SHA256
        uInt32 * getHash();
};

#endif