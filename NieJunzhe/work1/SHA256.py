import hashlib
import time


class SHA256:
    def __init__(self):
        # 64个常量
        self.constants = (
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2)
        # 8个哈希初始值，h0,h1,...,h7
        self.h = (
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
            0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19)

    # x循环右移b个bit
    # RightShift b bit
    def RightShift(self, x, b):
        return ((x >> b) | (x << (32 - b))) & ((1 << 32)-1)

    # 信息预处理, 附加填充和附加长度值
    def preProcess(self, temp):
        # 补1
        t0 = bytes(temp, "ascii") + b"\x80"
        # 补0
        t1 = b"\x00" * ((55 if (len(temp) % 64) < 56 else 119) - (len(temp) % 64))
        # 8字节的length
        t2 = (len(temp)*8).to_bytes(8, "big")
        return t0 + t1 + t2

    def hash(self, message):
        message = self.preProcess(message)
        digest = list(self.h)

        for i in range(0, len(message), 64):
            block = message[i: i + 64]
            word = []
            for i in range(0, 64, 4):
                word += [int.from_bytes(block[i: i + 4], "big")]
            word += [0] * 48

            # 构造后48个word
            for j in range(16, 64):
                s0 = self.RightShift(word[j - 15], 7) ^ self.RightShift(word[j - 15], 18) ^ (word[j - 15] >> 3)
                s1 = self.RightShift(word[j - 2], 17) ^ self.RightShift(word[j - 2], 19) ^ (word[j - 2] >> 10)
                word[j] = (word[j - 16] + s0 + word[j - 7] + s1) & ((2**32)-1)

            A, B, C, D, E, F, G, H = digest

            for j in range(64):
                S1 = self.RightShift(E, 6) ^ self.RightShift(E, 11) ^ self.RightShift(E, 25)
                ch = (E & F) ^ (~E & G)
                temp1 = H + S1 + ch + word[j] + self.constants[j]
                S0 = self.RightShift(A, 2) ^ self.RightShift(A, 13) ^ self.RightShift(A, 22)
                maj = (A & B) ^ (A & C) ^ (B & C)
                H = G & ((1 << 32) - 1)
                G = F & ((1 << 32) - 1)
                F = E & ((1 << 32) - 1)
                E = (D + temp1)  & ((1 << 32) - 1)
                D = C & ((1 << 32) - 1)
                C = B & ((1 << 32) - 1)
                B = A & ((1 << 32) - 1)
                A = (temp1 + S0 + maj)  & ((1 << 32) - 1)

            digest[0] = (digest[0] + A) & ((1 << 32) - 1)
            digest[1] = (digest[1] + B) & ((1 << 32) - 1)
            digest[2] = (digest[2] + C) & ((1 << 32) - 1)
            digest[3] = (digest[3] + D) & ((1 << 32) - 1)
            digest[4] = (digest[4] + E) & ((1 << 32) - 1)
            digest[5] = (digest[5] + F) & ((1 << 32) - 1)
            digest[6] = (digest[6] + G) & ((1 << 32) - 1)
            digest[7] = (digest[7] + H) & ((1 << 32) - 1)
        hash_value = b"".join(d.to_bytes(4, "big") for d in digest)
        return "".join(format(h, "02x") for h in hash_value)


def main():
    encoder = SHA256()
    while True:
        message = input("Enter string: ")
    # 验证工作量
    # message = "I am Satoshi Nakamoto"
    # flag = [0] * 10
    # Nonce = 0
    # time_start = time.time()
    # while True:
    #     temp = message+str(Nonce)
    #     if encoder.hash(temp)[0] == '0':
    #         if flag[0] == 0:
    #             flag[0] = 1
    #             time_end = time.time()
    #             print("找到第1位hash值为0时的时间："+str(time_end - time_start))
    #         if encoder.hash(temp)[1] == '0':
    #             if flag[1] == 0:
    #                 flag[1] = 1
    #                 time_end = time.time()
    #                 print("找到前2位hash值为0时的时间：" + str(time_end - time_start))
    #             if encoder.hash(temp)[2] == '0':
    #                 if flag[2] == 0:
    #                     flag[2] = 1
    #                     time_end = time.time()
    #                     print("找到前3位hash值为0时的时间：" + str(time_end - time_start))
    #                 if encoder.hash(temp)[3] == '0':
    #                     if flag[3] == 0:
    #                         flag[3] = 1
    #                         time_end = time.time()
    #                         print("找到前4位hash值为0时的时间：" + str(time_end - time_start))
    #                     if encoder.hash(temp)[4] == '0':
    #                         if flag[4] == 0:
    #                             flag[4] = 1
    #                             time_end = time.time()
    #                             print("找到前5位hash值为0时的时间：" + str(time_end - time_start))
    #                         if encoder.hash(temp)[5] == '0':
    #                             if flag[5] == 0:
    #                                 flag[5] = 1
    #                                 time_end = time.time()
    #                                 print("找到前6位hash值为0时的时间：" + str(time_end - time_start))
    #                             if encoder.hash(temp)[6] == '0':
    #                                 if flag[6] == 0:
    #                                     flag[6] = 1
    #                                     time_end = time.time()
    #                                     print("找到前7位hash值为0时的时间：" + str(time_end - time_start))
    #                                 if encoder.hash(temp)[7] == '0':
    #                                     if flag[7] == 0:
    #                                         flag[7] = 1
    #                                         time_end = time.time()
    #                                         print("找到前8位hash值为0时的时间：" + str(time_end - time_start))
    #     Nonce += 1

        print(encoder.hash(message))
        #用于验证算法正确性
        # print(hashlib.sha256(message.encode("utf-8")).hexdigest())


if __name__ == "__main__":
    main()

