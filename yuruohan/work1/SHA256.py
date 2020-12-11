# Author: Yu Ruohan
# Date: 12/01/2020

# Initialize variables
# (first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19):
H_array = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]

# Initialize table of round constants
# (first 32 bits of the fractional parts of the cube roots of the first 64 primes 2..311):
K_array = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
   0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
   0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
   0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
   0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
   0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
   0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
   0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2]

# Basic function
def rotateR(x, n):
    return ((x >> n) | (x << (32 - n)))
    # make sure the result is 32-bit

def sigma0(x):
    return (rotateR(x, 7) ^ rotateR(x, 18) ^ (x >> 3))

def sigma1(x):
    return (rotateR(x, 17) ^ rotateR(x, 19) ^ (x >> 10))

def Sigma0(x):
    return (rotateR(x, 2) ^ rotateR(x, 13) ^ rotateR(x, 22))

def Sigma1(x):
    return (rotateR(x, 6) ^ rotateR(x, 11) ^ rotateR(x, 25))

def Ch(x, y, z):
    return (x & y) ^ ( ~x & z)

def Maj(x, y, z):
    return (x & y) ^ (x & z) ^ (y & z)


# Pre-processing:
# append the bit '1' to the message
# append k bits '0', where k is the minimum number >= 0 such that the resulting message
#     length (in bits) is congruent to 448(mod 512)
# append length of message (before pre-processing), in bits, as 64-bit big-endian integer

def padding(msg: bytearray):
    # append 1 and 0
    length = len(msg) * 8   # in bits
    msg.append(0x80)        # 0x80 = 1000 0000
    while (len(msg) * 8 + 64) % 512 != 0:
        msg.append(0x00)
    
    # append the length
    msg += length.to_bytes(8, 'big')

    return msg

def sha256(msg):
    # Deal with string
    if isinstance(msg, str):
        msg = bytearray(msg, 'utf-8')
    
    # Pre-process
    msg = padding(msg)

    # Break message into 512-bit chunks
    chunks = []     # contain 512-bit(=64bytes) chunks of message
    for i in range(0, len(msg), 64):
        chunks.append(msg[i:i+64])  # every 512-bit chunk

    # setting initial values
    h0 = H_array[0]
    h1 = H_array[1]
    h2 = H_array[2]
    h3 = H_array[3]
    h4 = H_array[4]
    h5 = H_array[5]
    h6 = H_array[6]
    h7 = H_array[7]

    for each_chunk in chunks:
        # break chunk into sixteen 32-bit(=4bytes) big-endian words w[0..15]
        w = []
        for t in range(0, len(each_chunk), 4):
            w.append(bytes(each_chunk[t:t+4]))
        for t in range(16, 64):
            s0 = sigma0(int.from_bytes(w[t-15], 'big'))
            s1 = sigma1(int.from_bytes(w[t-2], 'big'))
            res = s0 + s1 + int.from_bytes(w[t-7], 'big') + int.from_bytes(w[t-16], 'big')
            w.append((res % (2 ** 32)).to_bytes(4, 'big'))      # mod (2**32) to prevent int too big to convert
        assert len(w) == 64

        a = h0
        b = h1
        c = h2
        d = h3
        e = h4
        f = h5
        g = h6
        h = h7
    
        for j in range(0, 64):
            s0 = Sigma0(a)
            maj = Maj(a, b, c)
            s1 = Sigma1(e)
            ch = Ch(e, f, g)

            t1 = (h + s1 + ch + K_array[j] + int.from_bytes(w[j], 'big')) % (2 ** 32)
            t2 = (s0 + maj) % (2 ** 32)

            h = g
            g = f
            f = e
            e = (d + t1) % (2 ** 32)
            d = c
            c = b
            b = a
            a = (t1 + t2) % (2 ** 32)
        # calculation for one chunk finished

        h0 = (h0 + a) % (2 ** 32)
        h1 = (h1 + b) % (2 ** 32)
        h2 = (h2 + c) % (2 ** 32)
        h3 = (h3 + d) % (2 ** 32)
        h4 = (h4 + e) % (2 ** 32)
        h5 = (h5 + f) % (2 ** 32)
        h6 = (h6 + g) % (2 ** 32)
        h7 = (h7 + h) % (2 ** 32)
    # calculation for all chunks finished

    return ((h0).to_bytes(4, 'big') + (h1).to_bytes(4, 'big') +
            (h2).to_bytes(4, 'big') + (h3).to_bytes(4, 'big') +
            (h4).to_bytes(4, 'big') + (h5).to_bytes(4, 'big') +
            (h6).to_bytes(4, 'big') + (h7).to_bytes(4, 'big'))

if __name__ == '__main__':
    infile = open('./input.txt', 'r', encoding="utf-8")
    msg = infile.read()
    infile.close()
    
    res = sha256(msg)
    print ("SHA256 (" + msg + ") = \n" + res.hex())

    outfile = open('./output.txt', 'w')
    outfile.write(res.hex())
    outfile.close()
