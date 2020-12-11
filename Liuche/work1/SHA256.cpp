#include<iostream>
#include<string>
#include<cstring>
#include<vector>
using namespace std;

class sha256 {
private:
    //8个哈希初值
    unsigned int h[8] = { 
             0x6a09e667,
             0xbb67ae85,
             0x3c6ef372,
             0xa54ff53a,
             0x510e527f,
             0x9b05688c,
             0x1f83d9ab,
             0x5be0cd19 };

    //用到的64个常量
    unsigned int k[64] = { 
              0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
              0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
              0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
              0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
              0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
              0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
              0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
              0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
              0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
              0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
              0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
              0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
              0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
              0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
              0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
              0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2 };

    string msg;//消息原文
    string changed;//预处理之后的消息
    vector<vector<unsigned int>> chunks;//512-bit的chunk
    unsigned int hash[8];//八个哈希值（中间值）

    //将原文长度（64-bit 无符号整数）转化为string
    string l2s(unsigned long long int x) {
        string str = "";
        unsigned long long int k = 0xff00000000000000;
        for (int i = 0; i < 8; i++) {
            char c = (char)((x & k) >> (8 * (7-i)));
            str += c;
            k >>= 8;
        }
        return str;
    }

    //预处理函数
    void pre_processing() {
        changed = msg;

        //附加填充比特
        //在原文末尾符加一个bit，值为1。但是由于后面还要添加0，所以这里直接添加了8个bit（以字符的形式），这样方便做字符串操作
        char c = 0x80;
        changed += c;

        //计算还需要添加多少个0
        int count = 448 - changed.length()*8 % 512;
        if (count < 0)
            count += 512;

        //在末尾添加若干个0。由于添加的0的数量一定是8的倍数，因此将这些0转化成字符（ASCII码值为0x00），一个字符是原本的8个0
        count /= 8;
        c = 0;
        while (count) {
            changed += c;
            --count;
        }

        //附加长度值
        changed.append(l2s((unsigned long long)msg.length()*8));
    }
   
    //将预处理之后的消息分解成512-bit大小的块的函数
    void getchunk(string str) {
        vector<unsigned int> chunk;
        for (int i = 0; i < str.length(); i += 4) {
            unsigned int w = 0;
            for (int j = i; j < i + 4; j++) {
                w <<= 8;
                unsigned int k = (unsigned int)str[j];
                k &= 0xff;
                w |= k;
            }
            chunk.emplace_back(w);
        }
        chunks.emplace_back(chunk);
    }

    //算法中需要用到的6个逻辑函数
    unsigned int Ch(unsigned int a, unsigned int b, unsigned int c) {
        return (a & b) ^ ((~a) & c);
    }
    unsigned int Ma(unsigned int a, unsigned int b, unsigned int c) {
        return (a & b) ^ (a & c) ^ (b & c);
    }
    unsigned int sigma0(unsigned int x) {
        return ((x >> 2) | (x << 30)) ^ ((x >> 13) | (x << 19)) ^ ((x >> 22) | (x << 10));
    }
    unsigned int sigma1(unsigned int x) {
        return ((x >> 6) | (x << 26)) ^ ((x >> 11) | (x << 21)) ^ ((x >> 25) | (x << 7));
    }
    unsigned int theta0(unsigned int x) {
        return ((x >> 7) | (x << 25)) ^ ((x >> 18) | (x << 14)) ^ (x >> 3);
    }
    unsigned int theta1(unsigned int x) {
        return ((x >> 17) | (x << 15)) ^ ((x >> 19) | (x << 13)) ^ (x >> 10);
    }

public:
    //构造函数
    sha256(string str) :msg(str) {}

    //得到消息的哈希值
    vector<unsigned int>  gethash() {

        //预处理
        pre_processing();

        //将消息分解成512-bit的块
        for (int i = 0; i < changed.length(); i += 64) {
            getchunk(changed.substr(i, 64));
        }

        //由于采用无符号整形来存储数据，因此天然地将数据分成了若干个32-bit的word，不需要专门实现

        for (vector<unsigned int> w : chunks) {

            //将16个word扩展为64个word
            for (int i = 16; i < 64; i++) {
                unsigned int s0 = theta0(w[i - 15]);
                unsigned int s1 = theta1(w[i - 2]);
                w.emplace_back(w[i - 16] + s0 + w[i - 7] + s1);               
            }

            //进行64次加密循环
            memcpy(hash, h, sizeof(unsigned int)*8);
            for (int i = 0; i < 64; i++) {
                unsigned int s0 = sigma0(hash[0]); 
                unsigned int maj = Ma(hash[0], hash[1], hash[2]); 
                unsigned int t2 = s0 + maj;
                unsigned int s1 = sigma1(hash[4]); 
                unsigned int ch = Ch(hash[4], hash[5], hash[6]); 
                unsigned int t1 = hash[7] + s1 + ch + k[i] + w[i];
                hash[7] = hash[6];
                hash[6] = hash[5];
                hash[5] = hash[4];
                hash[4] = hash[3] + t1;
                hash[3] = hash[2];
                hash[2] = hash[1];
                hash[1] = hash[0];
                hash[0] = t1 + t2;
            }

            //根据每一轮循环的结果更新哈希值
            h[0] = h[0] + hash[0];
            h[1] = h[1] + hash[1];
            h[2] = h[2] + hash[2];
            h[3] = h[3] + hash[3];
            h[4] = h[4] + hash[4];
            h[5] = h[5] + hash[5];
            h[6] = h[6] + hash[6];
            h[7] = h[7] + hash[7];
        }

        //返回最终的哈希值
        vector<unsigned int>hash;
        for (int i = 0; i < 8; i++) {
            hash.emplace_back(h[i]);
        }
        return hash;
    }
};
int main() {
    //程序入口
    while (1) {

        //读入原文
        string msg = "";
        char op = 'n';
        cout << "输入原文：" << endl;
        getline(cin, msg);

        //用户按下回车前未输入其他字符，有三种情况：输入空字符、输入的字符是回车、退出程序
        if (msg == "") {
            cout << "输入空字符串？y-确定 n-继续输入 q-退出" << endl;
        }
        //用户按下回车前输入了其他字符，有两种情况：结束输入、输入的字符是回车
        else {
            cout << "结束输入？y-确定 n-继续输入" << endl;
        }

        //读入用户选择的操作
        cin >> op;
        getchar();

        //选择q则退出循环，结束程序
        if (op == 'q')
            break;

        //选择n则继续读入输入
        if (op == 'n') {
            string str = "";

            //用户未结束输入则循环读入
            while (op != 'y') {

                //输入不是q、y、n之一则程序无法处理，结束程序
                if (op != 'n') {
                    cout << "非法输入！程序结束" << endl;
                    return 0;
                }

                //将用户继续输入的内容附加在原文末尾
                msg.append(str);

                //将用户输入的回车字符附加在原文末尾（getline遇到回车结束，不会读入回车，因此需要单独附加）
                msg += '\n';

                cout << "继续输入原文：" << endl;
                getline(cin, str);

                //用户按下回车，有两种情况：结束输入、输入的字符是回车
                cout << "结束输入？y-确定 n-继续输入" << endl;
                cin >> op;
                getchar();
            }
            msg.append(str);
        }
        //输入不是q、y、n之一则程序无法处理，结束程序
        else if (op != 'y') {
            cout << "非法输入！程序结束" << endl;
            return 0;
        }

        //构造一个SHA256实例
        sha256 a(msg);

        //得出结果
        vector<unsigned int>hash = a.gethash();

        //输出结果
        cout << "\n加密后的哈希值：" << endl;
        for (int i = 0; i < 8; i++) {
            printf("%08x", hash[i]);
        }
        cout << '\n' << endl;
    }
    

    cout << "程序结束" << endl;
    return 0;
}
