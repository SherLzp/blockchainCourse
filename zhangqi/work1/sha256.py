# coding: utf-8

import copy
import hashlib
import time


def rightRotate(Slice, bit):
    return ((Slice >> bit) | (Slice << (32 - bit))) & ((1 << 32) - 1)


class SHA256:
    def __init__(self):
        self.s = []

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

        # 8个哈希初值
        self.h = (
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
            0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19)

    # 预处理
    def preProcess(self):
        bit = self.s[0]
        for i in range(1, len(self.s)):
            bit = (bit << 8) | self.s[i]
        bit = ((((bit << 1) | 0b1) << ((447 - 8 * len(self.s)) % 512)) << 64) | 8 * len(self.s)
        return bit

    # 按512位分块
    def bitSlice(self):
        bit = self.preProcess()
        temp = copy.deepcopy(bit)
        slices = []
        while temp != 0:
            slices.append(temp & ((1 << 512) - 1))
            temp >>= 512
        slices.reverse()
        return slices

    # 对每个字进行处理
    def sliceProcess(self):
        slices = self.bitSlice()
        digest = list(self.h)
        for i in range(len(slices)):
            words = []
            temp = copy.deepcopy(slices[i])
            for j in range(16):
                words.append(temp & ((1 << 32) - 1))
                temp >>= 32
            words.reverse()
            words += [0] * 48
            for j in range(16, 64):
                words[j] = (words[j - 16] + (rightRotate(words[j - 15], 7) ^ rightRotate(words[j - 15], 18) ^ (words[j - 15] >> 3)) + words[j - 7]
                            + (rightRotate(words[j - 2], 17) ^ rightRotate(words[j - 2], 19) ^ (words[j - 2] >> 10))) & ((1 << 32) - 1)
            a, b, c, d, e, f, g, h = digest
            for j in range(64):
                s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)
                ch = (e & f) ^ ((~e) & g)
                temp1 = (h + s1 + ch + self.constants[j] + words[j]) & ((1 << 32) - 1)
                s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)
                maj = (a & b) ^ (a & c) ^ (b & c)
                temp2 = (s0 + maj) & ((1 << 32) - 1)

                h = g & ((1 << 32) - 1)
                g = f & ((1 << 32) - 1)
                f = e & ((1 << 32) - 1)
                e = (d + temp1) & ((1 << 32) - 1)
                d = c & ((1 << 32) - 1)
                c = b & ((1 << 32) - 1)
                b = a & ((1 << 32) - 1)
                a = (temp1 + temp2) & ((1 << 32) - 1)

            digest[0] = (digest[0] + a) & ((1 << 32) - 1)
            digest[1] = (digest[1] + b) & ((1 << 32) - 1)
            digest[2] = (digest[2] + c) & ((1 << 32) - 1)
            digest[3] = (digest[3] + d) & ((1 << 32) - 1)
            digest[4] = (digest[4] + e) & ((1 << 32) - 1)
            digest[5] = (digest[5] + f) & ((1 << 32) - 1)
            digest[6] = (digest[6] + g) & ((1 << 32) - 1)
            digest[7] = (digest[7] + h) & ((1 << 32) - 1)
        return digest

    def res(self):
        digest = self.sliceProcess()
        bt = b"".join(b.to_bytes(4, "big") for b in digest)
        result = "".join(format(h, "02x") for h in bt)
        return result


def main():
    encoder = SHA256()
    while True:
        msg = input("Enter string(press 'ENTER' to exit): ")
        if len(msg) <= 0:
            break
        start = time.time()
        encoder.s = msg.encode("utf8")
        end = time.time()
        print("My output:       " + encoder.res())
        print("Standard output: " + hashlib.sha256(msg.encode("utf8")).hexdigest())
        print("Calculating time: " + str(end - start) + "s.")


if __name__ == "__main__":
    main()
