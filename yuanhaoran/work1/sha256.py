K = (0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
     0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
     0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
     0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
     0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
     0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
     0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
     0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2)
H = (0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19)


def right_rotate(x, b):
    return ((x >> b) | (x << (32 - b))) & ((2 ** 32) - 1)


def pad(src):
    des = bytes(src, "ascii") + b"\x80"
    if len(des) % 64 <= 56:
        des += b"\x00" * (56 - len(des) % 64)
    else:
        des += b"\x00" * (120 - len(des) % 64)
    des += (len(src) << 3).to_bytes(8, "big")
    return des


def compress(w, k, a, b, c, d, e, f, g, h):
    s1 = right_rotate(e, 6) ^ right_rotate(e, 11) ^ right_rotate(e, 25)
    ch = (e & f) ^ (~e & g)
    temp1 = h + s1 + ch + k + w
    s0 = right_rotate(a, 2) ^ right_rotate(a, 13) ^ right_rotate(a, 22)
    maj = (a & b) ^ (a & c) ^ (b & c)
    temp2 = s0 + maj

    return (temp1 + temp2) & ((2 ** 32) - 1), a, b, c, (d + temp1) & ((2 ** 32) - 1), e, f, g


def sha256(message):
    message = pad(message)
    digest = list(H)

    for i in range(0, len(message), 64):
        chunk = message[i: i + 64]
        w = [int.from_bytes(chunk[e: e + 4], "big") for e in range(0, 64, 4)] + ([0] * 48)

        for j in range(16, 64):
            s0 = right_rotate(w[j - 15], 7) ^ right_rotate(w[j - 15], 18) ^ (w[j - 15] >> 3)
            s1 = right_rotate(w[j - 2], 17) ^ right_rotate(w[j - 2], 19) ^ (w[j - 2] >> 10)
            w[j] = (w[j - 16] + s0 + w[j - 7] + s1) & ((2 ** 32) - 1)

        a, b, c, d, e, f, g, h = digest

        for j in range(64):
            a, b, c, d, e, f, g, h = compress(w[j], K[j], a, b, c, d, e, f, g, h)

    digest = [(x + y) & ((2 ** 32) - 1) for x, y in zip(digest, (a, b, c, d, e, f, g, h))]
    return "".join(format(h, "02x") for h in b"".join(d.to_bytes(4, "big") for d in digest))
