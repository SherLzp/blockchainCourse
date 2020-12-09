init_hash = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]

K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]

def ror(x, k):
    return 0xffffffff & (((x & 0xffffffff) >> (k & 31)) | (x << (32 - (k & 31))))

def shr(x, k):
    return (x & 0xffffffff) >> k

Ch = lambda x, y, z: (x & y) ^ (~x & z)
Maj = lambda x, y, z: (x & y) ^ (x & z) ^ (y & z)
Sigma0 = lambda x: ror(x, 2) ^ ror(x, 13) ^ ror(x, 22)
Sigma1 = lambda x: ror(x, 6) ^ ror(x, 11) ^ ror(x, 25)

def pre_process(bits:str):
    l = len(bits)
    k = 0
    while (l + 1 + k) % 512 != 448:
        k += 1
    bits = bits + '1' + '0'*k + str(format(l, '064b'))
    chunks = []
    while len(bits) > 0:
        chunks.append(bits[:512])
        bits = bits[512:]
    return chunks

def loop(chunks:list):
    H = [_ for _ in init_hash]
    for chunk in chunks:
        words = [int(chunk[i:i+32],base=2) for i in range(0, 512, 32)]
        for i in range(16, 64):
            s0 = ror(words[i-15], 7) ^ ror(words[i-15], 18) ^ shr(words[i-15], 3)
            s1 = ror(words[i-2], 17) ^ ror(words[i-2], 19) ^ shr(words[i-2], 10)
            words.append((words[i-16] + s0 + words[i-7] + s1) & 0xffffffff)
        a, b, c, d, e, f, g, h = (H[i] for i in range(8))
        for i in range(64):
            t1 = h + Sigma1(e) + Ch(e,f,g) + K[i] + words[i]
            t2 = Sigma0(a) + Maj(a,b,c)
            h, g, f, e, d, c, b, a = g, f, e, (d+t1)&0xffffffff, c, b, a, (t1+t2)&0xffffffff
        for i in range(8):
            H[i] = (H[i] + [a, b, c, d, e, f, g, h][i]) & 0xffffffff
    digest = ''.join([str(format(H[i], '032b')) for i in range(8)])
    return digest

def my_sha256(bs:bytes):
    bits = ''.join([str(format(b, '08b')) for b in bs])
    chunks = pre_process(bits)
    digest = loop(chunks)
    hexdigest = hex(int(digest, base=2))[2:]
    return hexdigest

def test():
    s = 'abc'
    h = my_sha256(s.encode())
    print(h)
    # 0x13b332010c37792371b684711ea30e0a35267e2f520ac032132f25c9c9d76c2c

if __name__ == "__main__":
    test()