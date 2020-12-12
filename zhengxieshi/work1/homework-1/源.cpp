#include<bits/stdc++.h>
#include <cstring>
using namespace std;

void bulidtree();
void check(vector<unsigned int*> list, unsigned int* root);
static unsigned int h[8] = {
        0x6a09e667,
        0xbb67ae85,
        0x3c6ef372,
        0xa54ff53a,
        0x510e527f,
        0x9b05688c,
        0x1f83d9ab,
        0x5be0cd19 };
static unsigned int k[64] = {
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2 };
class Block {
public:
    unsigned char b[64];
    Block() {}
};
class Readfile {
public:
    void readin(string filename, vector<Block>& blocklist) {
        Block tempblock;
        ifstream in(filename, ios::in | ios::binary);
        unsigned char tempbyte;
        int count = 0;//每64次清零
        while (in.read((char*)&tempbyte, sizeof(tempbyte))) {
            tempblock.b[count++] = (unsigned char)(tempbyte & 0xFF);
            if (count == 64) {
                count = 0;
                blocklist.push_back(tempblock);
            }
        }
        unsigned long size = blocklist.size() * 512 + count * 8;
        if (count < 56) {//凑448bit
            tempblock.b[count++] = (unsigned char)0x80;
            while (count < 56) {
                tempblock.b[count++] = (unsigned char)0x00;
            }
        }
        else {
            tempblock.b[count++] = (unsigned char)0x80;
            while (count < 64) {
                tempblock.b[count++] = (unsigned char)0x00;
            }
            blocklist.push_back(tempblock);
            count = 0;
            while (count < 56) {
                tempblock.b[count++] = (unsigned char)0x00;
            }
        }
        blocklist.push_back(tempblock);
        appendlength(blocklist, size);
        in.close();
    }
    void readin(string filename, vector<Block>& blocklist, string num) {
        Block tempblock;
        ifstream in(filename, ios::in | ios::binary);
        unsigned char tempbyte;
        int count = 0;//每64次清零
        while (in.read((char*)&tempbyte, sizeof(tempbyte))) {
            tempblock.b[count++] = (unsigned char)(tempbyte & 0xFF);
            if (count == 64) {
                count = 0; 
                blocklist.push_back(tempblock);
            }
        }
        char appends[10000];
        strcpy_s(appends,10000, num.c_str());
        int i = 0;
        while (appends[i]!='\0') {
            tempblock.b[count++] = (unsigned char)appends[i];
            if (count == 64) {
                count = 0;
                blocklist.push_back(tempblock);
            }
            i++;
        }
        unsigned long size = blocklist.size() * 512 + count * 8;
        if (count < 56) {//凑448bit
            tempblock.b[count++] = (unsigned char)0x80;
            while (count < 56) {
                tempblock.b[count++] = (unsigned char)0x00;
            }
        }
        else {
            tempblock.b[count++] = (unsigned char)0x80;
            while (count < 64) {
                tempblock.b[count++] = (unsigned char)0x00;
            }
            blocklist.push_back(tempblock);
            count = 0;
            while (count < 56) {
                tempblock.b[count++] = (unsigned char)0x00;
            }
        }
        blocklist.push_back(tempblock);
        appendlength(blocklist, size);
        in.close();
    }
    void appendlength(vector<Block>& blocklist,unsigned long size) {
        Block* last = &blocklist[blocklist.size() - 1];
        int append[64] = {0};
        int temp = size;
        int i = 63;
        while (temp != 0) {
            if (temp % 2 == 1) {
                append[i] = 1;
            }
            else
                append[i] = 0;
            i--;
            temp /= 2;
        }
        for (int i = 63; i > 55; i--) {
            last->b[i] = append[(i - 56) * 8];
            for (int j = 1; j < 8 ; j++) {
                last->b[i] *= 2;
                if (append[(i - 56) * 8 + j] == 1)
                    last->b[i] += 1;
            }
        }
    }
};
class SHA256 {
public :
    void main() {
        Readfile r;
        string filename = "testdata.txt";
        prepared_data.clear();
        r.readin(filename, prepared_data);
        sha256();
        for (int i = 0; i < 8; i++) {
            printf("%08x", H[i]);
        }
    }
    unsigned int* main(string filename) {
        Readfile r;
        prepared_data.clear();
        r.readin(filename, prepared_data);
        sha256();
        return H;
    }
    void main(int difficult) {
        Readfile r;
        string filename = "testdata.txt";

        int count = 0;
        unsigned int upbound = pow(2, 32 - difficult);
        clock_t start, end;
        start = clock();
        do{
            string append = to_string(count);
            prepared_data.clear();
            r.readin(filename, prepared_data,append);
            sha256();
            count++;
        } while (H[0] > upbound);
        end = clock();
        double endtime = (double)(end - start) / CLOCKS_PER_SEC;
        cout << "Total time:" << endtime << "s" << endl;
        for (int i = 0; i < 8; i++) {
            printf("%08x", H[i]);
        }
    }

    vector<Block> prepared_data;
    unsigned int H[8];//作为输入和输出
    unsigned int CH(unsigned int x, unsigned int y, unsigned int z) { return (x & y) ^ ((~x) & z); }
    unsigned int MAJ(unsigned int x, unsigned int y, unsigned int z) {
        return (x & y) ^ (x & z) ^ (y & z);
    }
    unsigned int ROTR(unsigned int length, unsigned int x) {
        return (x >> length) | x << (32 - length);
    }
    unsigned int BSIG0(unsigned int x) {
        return ROTR(2, x) ^ ROTR(13, x) ^ ROTR(22, x);
    }
    unsigned int BSIG1(unsigned int x) {
        return ROTR(6, x) ^ ROTR(11, x) ^ ROTR(25, x);
    }
    unsigned int SSIG0(unsigned int x) {
        return ROTR(7, x) ^ ROTR(18, x) ^ (x >> 3);
    }
    unsigned int SSIG1(unsigned int x) {
        return ROTR(17, x) ^ ROTR(19, x) ^ (x >> 10);
    }
    void sha256() {
        unsigned int w[64];
        int round = prepared_data.size();
        //init
        H[0] = h[0];
        H[1] = h[1];
        H[2] = h[2];
        H[3] = h[3];
        H[4] = h[4];
        H[5] = h[5];
        H[6] = h[6];
        H[7] = h[7];
        for (int i = 0; i < round; i++) {
            for (int j = 0; j < 16; j++) {
                unsigned int temp = (prepared_data[i].b[j * 4] & 0xff) << 24 | (prepared_data[i].b[j * 4 + 1] & 0xff) << 16 |
                    (prepared_data[i].b[j * 4 + 2] & 0xff) << 8 | (prepared_data[i].b[j * 4 + 3] & 0xff);
                //temp是把四个Byte合并成一个int
                w[j] = temp;
            }
            for (int j = 16; j < 64; j++) {
                w[j] = (SSIG1(w[j - 2]) + w[j - 7] + SSIG0(w[j - 15]) + w[j - 16]);
            }
            unsigned int a = H[0];
            unsigned int b = H[1];
            unsigned int c = H[2];
            unsigned int d = H[3];
            unsigned int e = H[4];
            unsigned int f = H[5];
            unsigned int g = H[6];
            unsigned int h = H[7];
            for (int j = 0; j < 64; j++) {
                unsigned int T1 = h + BSIG1(e) + CH(e, f, g) + k[j] + w[j];
                unsigned int T2 = BSIG0(a) + MAJ(a, b, c);
                h = g;
                g = f;
                f = e;
                e = d + T1;
                d = c;
                c = b;
                b = a;
                a = T1 + T2;
            }
            H[0] = H[0] + a;
            H[1] = H[1] + b;
            H[2] = H[2] + c;
            H[3] = H[3] + d;
            H[4] = H[4] + e;
            H[5] = H[5] + f;
            H[6] = H[6] + g;
            H[7] = H[7] + h;
        }
    }
};

class tree {
public:
    tree() { 
        this->leftchild = NULL; 
        this->rightchild = NULL;
    }
    unsigned int H[8];
    tree* leftchild;
    tree* rightchild;
};


void buildtree() {
    SHA256 a;
    tree tree1,tree2,tree3,tree4;
    unsigned int* H;
    H = a.main("tree1.txt");
    for (int i = 0; i < 8; i++) {
        tree1.H[i] = H[i];
    }
    H = a.main("tree2.txt");
    for (int i = 0; i < 8; i++) {
        tree2.H[i] = H[i];
    }
    H = a.main("tree3.txt");
    for (int i = 0; i < 8; i++) {
        tree3.H[i] = H[i];
    }
    H = a.main("tree4.txt");
    for (int i = 0; i < 8; i++) {
        tree4.H[i] = H[i];
    }
    tree father1, father2;
    ofstream output;
    output.open("father1.txt");
    unsigned int temp[8];
    for (int i = 0; i < 8; i++) {
        temp[i] = tree1.H[i]+tree2.H[i];
        output << temp[i];
    }
    output.close();
    H = a.main("father1.txt");
    for (int i = 0; i < 8; i++) {
        father1.H[i] = H[i];
    }
    output.open("father2.txt");
    for (int i = 0; i < 8; i++) {
        temp[i] = tree3.H[i] + tree4.H[i];
        output << temp[i];
    }
    output.close();
    H = a.main("father2.txt");
    for (int i = 0; i < 8; i++) {
        father2.H[i] = H[i];
    }
    tree grandfather;
    output.open("grandfather.txt");
    for (int i = 0; i < 8; i++) {
        temp[i] = father1.H[i] + father2.H[i];
        output << temp[i];
    }
    output.close();
    H = a.main("grandfather.txt");
    for (int i = 0; i < 8; i++) {
        grandfather.H[i] = H[i];
    }
    cout << "tree1 : ";
    for (int j = 0; j < 8; j++)
        cout << hex << tree1.H[j];
    cout << endl;
    cout << "tree2 : ";
    for (int j = 0; j < 8; j++)
        cout << hex << tree2.H[j];
    cout << endl;
    cout << "tree3 : ";
    for (int j = 0; j < 8; j++)
        cout << hex << tree3.H[j];
    cout << endl;
    cout << "tree4 : ";
    for (int j = 0; j < 8; j++)
        cout << hex << tree4.H[j];
    cout << endl;
    cout << "father1 : ";
    for (int j = 0; j < 8; j++)
        cout << hex << father1.H[j];
    cout << endl;
    cout << "father2 : ";
    for (int j = 0; j < 8; j++)
        cout << hex << father2.H[j];
    cout << endl;
    cout << "grandfather : ";
    for (int j = 0; j < 8; j++)
        cout << hex << grandfather.H[j];
    cout << endl;

    vector<unsigned int*> test;
    test.push_back(tree3.H);
    test.push_back(tree4.H);
    test.push_back(tree1.H);
    check(test,grandfather.H);
}

void check(vector<unsigned int*> list, unsigned int* root) {
    SHA256 a;
    unsigned int H[8];
    unsigned int* temp;
    ofstream output;
    int inputcount = 0;
    int outputcount = 0;
    for (int i = 0; i < 8; i++)
        H[i] = list[0][i];
    cout << "input " << inputcount++ << " : ";
    for (int i = 0; i < 8; i++)
        cout << hex << H[i];
    cout << endl;
    for (int i = 1; i < list.size(); i++) {
        cout << "input " << inputcount++ << " : ";
        for (int j = 0; j < 8; j++)
            cout << hex << list[i][j];
        cout << endl;
        output.open("checktemp.txt");
        for (int j = 0; j < 8; j++) {
            H[j] = H[j] + list[i][j];
            output << H[j];
        }
        output.close();
        temp = a.main("checktemp.txt");
        for(int j = 0; j < 8; j++){
            H[j] = temp[j];
        }
        cout << "output " << outputcount++ << " : ";
        for (int j = 0; j < 8; j++)
            cout << hex << H[j];
        cout << endl;
    }
    bool flag = true;
    for (int i = 0; i < 8; i++) {
        if (H[i] != root[i]) {
            flag = false;
            break;
        }
    }
    cout << "root" << " : ";
    for (int j = 0; j < 8; j++)
        cout << hex << root[j];
    cout << endl;
    if (flag) {
        cout << "True!" << endl;
    }
    else
        cout << "false!" << endl;
}

int main() {
    SHA256 a;
    
    //int difficult;
    //cin >> difficult;
    //a.main(difficult);

    a.main();
    system("pause");

    //buildtree();
    //system("pause");
}