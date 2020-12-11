import hashlib
import time


class SHA256:
    def __init__(self):
        # 64个常量
        self.constants = (
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
            0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2)
        # 迭代初始值，h0,h1,...,h7
        self.h = (
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
            0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19)

    # 右移b个bit
    @staticmethod
    def right_rotate(x, b):
        return ((x >> b) | (x << (32 - b))) & ((2 ** 32) - 1)

    # 填充长度
    @staticmethod
    def Pad(message):
        # 消息转换
        part1 = bytes(message, "ascii")
        # 填充”\x80“
        part2 = b"\x80"
        # 判断两种填充情况
        reminder = len(message) % 64
        # 不满56就填满56即可
        if reminder < 56:
            part3 = (55 - reminder) * b"\x00"
        # 大于56则额外填充一个块
        else:
            part3 = (119 - reminder) * b"\x00"
        # 填充数据长度
        part4 = (len(message) * 8).to_bytes(8, byteorder="big")
        # 拼接
        return part1 + part2 + part3 + part4

    # 子块迭代函数
    def Compress(self, Wt, Kt, A, B, C, D, E, F, G, H):
        return ((H + (self.right_rotate(E, 6) ^ self.right_rotate(E, 11) ^ self.right_rotate(E, 25)) + (
                (E & F) ^ (~E & G)) + Wt + Kt) + (
                        self.right_rotate(A, 2) ^ self.right_rotate(A, 13) ^ self.right_rotate(A, 22)) + (
                        (A & B) ^ (A & C) ^ (B & C))) & ((2 ** 32) - 1), A, B, C, (D + (
                H + (self.right_rotate(E, 6) ^ self.right_rotate(E, 11) ^ self.right_rotate(E, 25)) + (
                (E & F) ^ (~E & G)) + Wt + Kt)) & ((2 ** 32) - 1), E, F, G

    def hash(self, message):
        message = self.Pad(message)
        digest = list(self.h)
        # 将message拆分成512bit长度的块
        for i in range(0, len(message), 64):
            S = message[i: i + 64]
            # 进一步拆分成32bit的子块
            W = [int.from_bytes(S[e: e + 4], "big") for e in range(0, 64, 4)] + ([0] * 48)
            # 构造64个word
            for j in range(16, 64):
                W[j] = (W[j - 16] + (
                        self.right_rotate(W[j - 15], 7) ^ self.right_rotate(W[j - 15], 18) ^ (W[j - 15] >> 3)) + W[
                            j - 7] + (self.right_rotate(W[j - 2], 17) ^ self.right_rotate(W[j - 2], 19) ^ (
                        W[j - 2] >> 10))) & ((2 ** 32) - 1)
            A, B, C, D, E, F, G, H = digest
            # 根据构造的word进行64次子块迭代
            for j in range(64):
                A, B, C, D, E, F, G, H = self.Compress(W[j], self.constants[j], A, B, C, D, E, F, G, H)
            # 更新digest
            digest = [(x + y) & ((2 ** 32) - 1) for x, y in zip(digest, (A, B, C, D, E, F, G, H))]
        # 拼接结果
        return "".join(format(h, "02x") for h in b"".join(d.to_bytes(4, "big") for d in digest))


# 算法正确性验证函数
def main():
    encoder = SHA256()
    while 1:
        message = input("Enter string: ")
        hash1 = encoder.hash(message)
        x = hashlib.sha256()
        x.update(message.encode())
        hash2 = x.hexdigest()
        print(f"My SHA256 Algorithm's Output: {hash1}\n")
        print(f"Hashlib Algorithm's Output: {hash2}\n")


# 寻找前n位是0的SHA256的哈希值
def find(N):
    encoder = SHA256()
    start = time.time()
    text = "I am Satoshi Nakamoto"
    a = 0
    count = 0
    while 1:
        string = text + str(a)
        a += 1
        count += 1
        my_hash = encoder.hash(string)
        print(my_hash)
        check = my_hash[0:N]
        flag = 0
        for i in range(len(check)):
            if check[i] != '0':
                flag = 1
        if flag == 1:
            continue
        else:
            break
    end = time.time()
    cost = end - start
    print("花费了" + str(cost) + "s" + "找到了符合条件的字符串，找了" + str(count) + "个字符串")


if __name__ == "__main__":
    # 验证算法的正确性函数
    # main()
    # 挖矿模拟函数
    n = input("Enter target number n:")
    find(int(n))
