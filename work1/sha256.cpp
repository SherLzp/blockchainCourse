#include<cstdio>
#include <cstring>
#include <cstdlib>
#include <iostream>

using namespace std;

typedef unsigned int u32int_t;
typedef unsigned char byte;
typedef unsigned long long u64int_t;

// 自然数中前8个质数（2,3,5,7,11,13,17,19）的！平方根！的小数部分取前32bit而来
const u32int_t SHA256_CONST8[8] = {
        0x6a09e667,
        0xbb67ae85,
        0x3c6ef372,
        0xa54ff53a,
        0x510e527f,
        0x9b05688c,
        0x1f83d9ab,
        0x5be0cd19,
};
// 类似上述产生方法，自然数中前64个质数的！立方根！的小数部分取前32bit而来
const u32int_t SHA256_CONST64[64] = {0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
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
                                     0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2};

u32int_t hashBench[64];

// 使用宏定义表示SHA256的一些数学处理过程
#define Ch(x, y, z) ((x) & (y)) ^ (~(x) & (z))

#define rotateRight(x, n) ((((x) & ((1 << (n)) - 1)) << (32 - (n))) | ((x) >> (n)))

#define Ma(x, y, z) (((x) & (y)) ^ ((x) & (z)) ^ ((y) & (z)))

#define sum0(x) (rotateRight(x, 2) ^ rotateRight(x, 13) ^ rotateRight(x, 22))

#define sum1(x) (rotateRight(x, 6) ^ rotateRight(x, 11) ^ rotateRight(x, 25))

#define sigma0(x) (rotateRight(x, 7) ^ rotateRight(x, 18) ^ ((x) >> 3))

#define sigma1(x) (rotateRight(x, 17) ^ rotateRight(x, 19) ^ ((x) >> 10))




struct SHA256_struct {
    u32int_t processBench[16];    //加密的measage
    u32int_t hash[8];      //hash的结果
    u64int_t hashLen;  //总共hash的byte数
    byte offset;           //一个update未对齐Word(4字节)的字节数
    byte index;            //当前写到processBench的位置
};

/**
 * 初始化sha结构体
 * @param s sha结构体
 */
void sha_init(SHA256_struct *s) {
    for (int i = 0; i < 8; i++) {// 先用常数填充hash
        s->hash[i] = SHA256_CONST8[i];
    }
    s->hashLen = 0;
    s->index = 0;
    s->offset = 0;
}

/**
 * 对512bit的数据进行一次加密
 * @param s sha结构体
 */
void sha_process512bit(SHA256_struct *s) {
    byte i;
    u32int_t m0, s0, s1, c1, t1;
    u32int_t oneTimeHash[8];
    for (i = 0; i < 8; i++) {
        oneTimeHash[i] = s->hash[i];
    }


    for (i = 0; i < 16; i++)
        hashBench[i] = s->processBench[i];

    // 使用两个sigma函数，将512bit的数据一次扩展，扩展到4个512bit，共2048bit（256byte）,这也是sha256输出的长度
    for (i = 16; i < 64; i++) {
        hashBench[i] = sigma1(hashBench[i - 2]) + hashBench[i - 7] + sigma0(hashBench[i - 15]) + hashBench[i - 16];
    }


    for (i = 0; i < 64; i++) {
        s0 = sum0(oneTimeHash[0]);
        s1 = sum1(oneTimeHash[4]);
        m0 = Ma(oneTimeHash[0], oneTimeHash[1], oneTimeHash[2]);
        c1 = Ch(oneTimeHash[4], oneTimeHash[5], oneTimeHash[6]);
        t1 = s1 + c1 + oneTimeHash[7] + hashBench[i] + SHA256_CONST64[i]; // hashBench中的值在这一层充当了变量

        // 可以看到，主要是常量池中的数组在进行交换，运算，但是多次添加了含有变化因素的t1后，结果就会因为微小的输入差距产生巨大差异
        oneTimeHash[7] = oneTimeHash[6];
        oneTimeHash[6] = oneTimeHash[5];
        oneTimeHash[5] = oneTimeHash[4];
        oneTimeHash[4] = oneTimeHash[3] + t1;
        oneTimeHash[3] = oneTimeHash[2];
        oneTimeHash[2] = oneTimeHash[1];
        oneTimeHash[1] = oneTimeHash[0];
        oneTimeHash[0] = t1 + m0 + s0;

    }
    // 对一次hash的结果累加，这是利用系统的32位溢出限制做一次加和取模运算
    // 此处的计算也比较重要，因为如果不好处理，sha256以每512bit为一次哈希周期的规律就容易被利用
    for (i = 0; i < 8; i++) {
        s->hash[i] += oneTimeHash[i];
    }

}

void sha_fit(SHA256_struct *s, byte *str, u64int_t len) { // 规定4byte为一个word
    u64int_t i = 0;
    s->hashLen += len;


    u64int_t count = len >> 2;//计算这次加密有多少个word
    s->offset = len % 4;//对齐word剩余的byte


    for (i = 0; i < count; i++) {
        // 强制使用大端对其表示
        s->processBench[s->index++] = ((str[0]) << 24) |
                                      ((str[1]) << 16) |
                                      ((str[2]) << 8) |
                                      (str[3]);

        str += 4;
        if (s->index == 16) {
            sha_process512bit(s);//一次处理16个32位字，即512bit
            s->index = 0; //重置处理bench
        }
    }
    s->processBench[s->index] = 0;// 清空下一个要被写的word，防止下一步将byte写入（按位或）这个字时产生错误
    // 将剩下的byte强制用大端模式接写在processBench上，这样最后相当于右侧补0补足
    for (i = 0; i < s->offset; i++) {
        s->processBench[s->index] |= ((*str) << (8 * (3 - i)));
        str++;
    }

}

/**
 * 收尾工作，
 * @param s
 */
void sha_final(SHA256_struct *s) {
    byte temp = s->hashLen % 64;//计算需要填充多少byte
    byte fill[4] = {0x80, 0x0, 0x0, 0x0};
    u32int_t i;
    if (temp == 56) {//需要填充一个512bit
        //补齐前一次的512bit
        if (s->offset != 0) {
            // 把填充字节填充在最后一个字上
            for (i = 0; i < 4 - s->offset; i++) {
                s->processBench[s->index] |= (fill[i] << (8 * (3 - i - s->offset)));
            }
            s->index++;
        } else {
            s->processBench[s->index] = 0x80000000;
            s->index++;
        }
        // 剩下的填充的字取0
        for (i = s->index; i < 16; i++) {
            s->processBench[i] = 0;
        }

        sha_process512bit(s);

        // 再对最终结果进行一次与输入字符串长度有关的hash，进一步增加随机性
        for (i = 0; i < 14; i++) {
            s->processBench[i] = 0;
        }
        s->processBench[14] = s->hashLen >> 29;
        s->processBench[15] = s->hashLen << 3 & 0xffffffff;
        sha_process512bit(s);

    } else {
        if (s->offset != 0) {
            for (i = 0; i < 4 - s->offset; i++) {
                s->processBench[s->index++] |= (fill[i] << (8 * (3 - i - s->offset)));
            }
        } else {
            s->processBench[s->index++] = 0x80000000;
        }

        for (i = s->index; i < 14; i++) {
            s->processBench[i] = 0;
        }
        s->processBench[14] = s->hashLen >> 29;
        s->processBench[15] = s->hashLen << 3 & 0xffffffff;
        sha_process512bit(s);
    }
}

SHA256_struct *SHA256_generate(char *key) {
    SHA256_struct *sha = (SHA256_struct *) malloc(sizeof(SHA256_struct));
    sha_init(sha);
    sha_fit(sha, reinterpret_cast<byte *>(key), strlen(key));
    sha_final(sha);
    return sha;
}

void SHA256_print_recycle(SHA256_struct *sha1, SHA256_struct *sha2, char *key1, char *key2) {
    printf("SHA256(%s) = ", key1);
    for (int i = 0; i < 8; i++) {
        printf("%x", sha1->hash[i]);
    }
    printf("\n");
    printf("SHA256(%s) = ", key2);
    for (int i = 0; i < 8; i++) {
        printf("%x", sha2->hash[i]);
    }
    printf("\n");
    uint32_t diffBitCnt = 0;
    // 统计两个input的hash值的bit wise的差别情况
    for (uint32_t i = 0; i < 8; i++) {
        for (uint32_t j = 0; j < 32; j++) {
            if (((sha1->hash[i] >> j) & 1) != ((sha2->hash[i] >> j) & 1)) {
                diffBitCnt++;
            }
        }
    }
    printf("total bit difference number: %d, bit-wise different rate : %.4f\n", diffBitCnt, double(diffBitCnt) / 256);
    free(sha1);
    free(sha2);
}

/**
 * 展示SHA256算法的输入输出，用于体现SHA256用于区块链锁定的功能
 * @param key key值
 */
void SHA256_demonstrate_lock_test(char *key1, char *key2) {
    SHA256_print_recycle(SHA256_generate(key1), SHA256_generate(key2), key1, key2);
}

/**
 * 展示SHA256算法对于规定工作量的作用
 * @param header 除了nonce之外的其他header值，在实际应用中代表区块头节点除nonce之外的部分
 * @param difficulty 为了细化，表示正确的PoW必须满足头部difficulty个！bit！为0
 */
void SHA256_demonstrate_PoW_test(const char *header, int difficulty) {
    char *key = (char *) malloc(sizeof(char) * (1 << 20));
    char *adder = (char *) malloc(sizeof(char) * 5);


    for (u32int_t nonce = 0; nonce < INT32_MAX; ++nonce) {
        memset(key, 0, 1 << 20);
        memset(adder, 0, 5);
        strcat(key, header);// 先添加头部

        // 将nonce转化为byte串,用小端表示
        adder[3] = (nonce >> 24) & 0xff;
        adder[2] = (nonce >> 16) & 0xff;
        adder[1] = (nonce >> 8) & 0xff;
        adder[0] = nonce & 0xff;
        strcat(key, adder);

        printf("key is %s%x\n", header, nonce);
        SHA256_struct *rst = SHA256_generate(key);
        bool isFit = true;
        int i = 0;
        for (; i < difficulty / 32; ++i) {
            if (rst->hash[i] != 0) {
                isFit = false;
                break;
            }
        }
        if (((rst->hash[i] >> (31 - difficulty % 32)) & 0xffffffff) != 0) {
            isFit = false;
        }
        free(rst);
        if (isFit) {
            printf("Found the available key : %s%x,iterative size is %d\n", header, nonce, nonce);
            break;
        }

    }
}


int main() {


//     限定输入长度为（1<<20)byte，即1MB，这个长度似乎曾经是比特币区块的标准长度
    cout << "-----part 1(3 input pairs)------" << endl;
    char *key1 = (char *) malloc(sizeof(char) * (1 << 20));
    char *key2 = (char *) malloc(sizeof(char) * (1 << 20));
    for (int i = 0; i < 3; i++) {
        printf("input key1(as char string):");
        scanf("%s", key1);
        printf("input key2(as char string):");
        scanf("%s", key2);
        SHA256_demonstrate_lock_test(key1, key2);
    }
    free(key1);
    free(key2);
    cout << "-----part 2(1 input pairs)------" << endl;
    char *header = (char *) malloc(sizeof(char) * (1 << 20));
    int difficulty;
    printf("input test header(as char string):");
    scanf("%s", header);
    printf("input difficulty(as integer):");
    scanf("%d", &difficulty);
    SHA256_demonstrate_PoW_test(header, difficulty);


}
