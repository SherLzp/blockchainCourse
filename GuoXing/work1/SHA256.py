#这是一个SHA256加密算法的实现

class SHA256:
    def __init__(self):
        #初始化64个密钥
        self.key = (
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
        #初始化8个初始字
        self.h = (
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
            0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19)
    #循环右移
    def rightrotate(self,x,a):
        return (x >> a) | (x << (32-a)) & ((2**32) - 1)
    #消息预处理
    def pre(self,m):
        return bytes(m,"ascii") + b"\x80" + (b"\x00"* ((55 if (len(m)% 64 < 56) else 119 ) - (len(m) % 64))) +(
            (len(m)<<3).to_bytes(8,"big"))
    #单轮运算
    def compress(self, Wt, Kt, A, B, C, D, E, F, G, H):
        return ((H + Wt + Kt + ((E & F) ^ (~E & G )) + (
            self.rightrotate(E,6) ^ self.rightrotate(E,11) ^ self.rightrotate(E,25)) + (
                self.rightrotate(A,2) ^ self.rightrotate(A,13) ^ self.rightrotate(A,22)) + (
                (A & B) ^ (A & C) ^ (B & C))) & ((2**32)-1)),A,B,C,(D+(
            H + Wt + Kt + ((E & F) ^ (~E & G )) + (self.rightrotate(E,6) ^ self.rightrotate(E,11) ^ self.rightrotate(E,25)))) & ((2**32)-1),E,F,G
    #循环运算求出hash值
    def hash(self,m):
        m = self.pre(m)
        digest = list(self.h)
        A, B, C, D, E, F, G, H = digest
        AA,BB,CC,DD,EE,FF,GG,HH = digest
        for i in range(0,len(m),64):
            S = m[i: i + 64]
            W =[int.from_bytes(S[e : e+4],"big") for e in range(0, 64, 4)] + ([0] * 48)

            A = AA
            B = BB
            C = CC
            D = DD
            E = EE
            F = FF
            G = GG
            F = FF

            #构造64个字
            for j in range(16,64):
                W[j] = ((self.rightrotate(W[j-2],17) ^ self.rightrotate(W[j-2],19) ^ (W[j-2]>>10)) + W[j-7] + (
                        self.rightrotate(W[j-15],7) ^ self.rightrotate(W[j-15],18) ^ W[j-15]>>3) + W[j-16])& ((2**32)-1)
            #循环加密
            for j in range(64):
                A,B,C,D,E,F,G,H = self.compress(W[j],self.key[j],A,B,C,D,E,F,G,H)

            if (i+64)<len(m):
                #print(AA)
                #print(A)
                AA=(AA + A)& ((2**32)-1)
                BB=(BB + B)& ((2**32)-1)
                CC=(CC + C)& ((2**32)-1)
                DD=(DD + D)& ((2**32)-1)
                EE=(EE + E)& ((2**32)-1)
                FF=(FF + F)& ((2**32)-1)
                GG=(GG + G)& ((2**32)-1)
                HH=(HH + H)& ((2**32)-1)
                #print(AA)

        return "".join(format(h, "02x") for h in b"".join(
            d.to_bytes(4, "big") for d in [(x + y) & ((2**32)-1) for x, y in zip((A, B, C, D, E, F, G, H), (AA,BB,CC,DD,EE,FF,GG,HH))]))

def main():
    encoder = SHA256()

    while True:
        message = input("明文： ")
        print(f"密文：{encoder.hash(message)}\n")


if __name__ == "__main__":
    main()