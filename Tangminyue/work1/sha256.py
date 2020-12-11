import struct

# Initialize variables
H_arr = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
         0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]

# Initialize table of round constants
K_arr = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
         0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
         0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
         0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
         0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
         0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
         0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
         0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2]


def pad(message):
    message = message.encode()
    length = len(message)

    # Append one bit '1' and seven bits '0'
    message += bytes([128])

    # Append K bytes '0'
    K = (512 - (length * 8 + 8 + 64) % 512) // 8
    message += bytes(K)

    # Append length
    message += (length * 8).to_bytes(8, 'big')
    return message

# Rotate (right)


def rotr(x, n):
    return ((x >> n) | (x << (32-n))) & 0xFFFFFFFF


# Sigma 0
def sigma0(t):
    return (rotr(t, 7) ^ rotr(t, 18) ^ (t >> 3))


# Sigma 1
def sigma1(t):
    return(rotr(t, 17) ^ rotr(t, 19) ^ (t >> 10))


def hash(message):
    # Pre-processing (Padding)
    message = pad(message)

    H = list(H_arr)
    K = list(K_arr)

    # break message into 512-bit chunks
    blocks = []
    for i in range(0, len(message), 64):
        blocks.append(message[i:i+64])

    for blk in blocks:
        w = []
        # copy chunk into first 16 words w[0..15] of the message schedule array
        for i in range(0, len(blk), 4):
            n = struct.unpack(">I", blk[i:i+4])
            w.append(n[0])

        # Extend the first 16 words into the remaining 48 words w[16..63] of the message schedule array
        for i in range(16, 64):
            w.append((sigma1(w[i-2]) + w[i-7] +
                      sigma0(w[i-15]) + w[i-16]) & 0xFFFFFFFF)

        # Initialize working variables to current hash value
        a = H[0]
        b = H[1]
        c = H[2]
        d = H[3]
        e = H[4]
        f = H[5]
        g = H[6]
        h = H[7]

        # Compression function main loop:
        for i in range(64):
            s0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)
            maj = (a & b) ^ (a & c) ^ (b & c)
            t2 = (s0 + maj) & 0xFFFFFFFF
            s1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)
            ch = (e & f) ^ ((0xFFFFFFFF ^ e) & g)
            t1 = (h + s1 + ch + K[i] + w[i]) & 0xFFFFFFFF

            h = g
            g = f
            f = e
            e = (d + t1) & 0xFFFFFFFF
            d = c
            c = b
            b = a
            a = (t1 + t2) & 0xFFFFFFFF

        # Add the compressed chunk to the current hash value
        H[0] += a
        H[1] += b
        H[2] += c
        H[3] += d
        H[4] += e
        H[5] += f
        H[6] += g
        H[7] += h

        for j in range(len(H)):
            H[j] = H[j] & 0xFFFFFFFF

    # Produce the final hash value (big-endian):
    result = bytes()
    for h in H:
        result += struct.pack(">I", h)

    return result.hex()
