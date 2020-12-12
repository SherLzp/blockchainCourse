import struct
def out_hex(list1):
        for i in list1:
                print ("%08x" % i)
        print ("\n")
    
def rotate_left(a, k):
        k = k % 32
        return ((a << k) & 0xFFFFFFFF) | ((a & 0xFFFFFFFF) >> (32 - k))
def rotate_right(a, k):
        k = k % 32
        return (((a >> k) & 0xFFFFFFFF) | ((a & 0xFFFFFFFF) << (32 - k))) & 0xFFFFFFFF

def rotate_shift(a,k):
    k = k%32
    return ((a >> k) & 0xFFFFFFFF);

def P_0(X):
        return (rotate_right(X, 7)) ^ (rotate_right(X, 18)) ^ (rotate_shift(X,3))

def P_1(X):
        return (rotate_right(X, 17)) ^ (rotate_right(X, 19)) ^ (rotate_shift(X,10))

IV="0x6A09E667 0xBB67AE85 0x3C6EF372 0xA54FF53A 0x510E527F 0x9B05688C 0x1F83D9AB 0x5BE0CD19"

IV=IV.replace("0x","")
IV=int(IV.replace(" ",""),16)

K = """0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,  
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,  
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,  
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,  
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,  
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2 """

K=K.replace("\n","")
K=K.replace(", ","")
K=K.replace(" ","")
K=K.replace("0x","")
K=int(K,16)

a = []
for i in range(0, 8):
        a.append(0)
        a[i] = (IV >> ((7 - i) * 32)) & 0xFFFFFFFF
IV = a

k = []
for i in range(0,64):
    k.append(0)
    k[i]= (K >> ((63-i)*32)) & 0xFFFFFFFF
K = k

def CF(V_i, B_i):
        W = []
        for j in range(0, 16):
                W.append(0)
                unpack_list = struct.unpack(">I", B_i[j*4:(j+1)*4])
                W[j] = unpack_list[0]
        for j in range(16, 64):
                W.append(0)
                s0 = P_0(W[j-15])
                s1 = P_1(W[j-2])
                W[j] = (W[j-16] + s0 + W[j-7] + s1) & 0xFFFFFFFF
                str1 = "%08x" % W[j]
        W_1 = []


        A, B, C, D, E, F, G, H = V_i

        for j in range(0, 64):
                SS1 = rotate_right(E,6) ^ rotate_right(E,11) ^ rotate_right(E,25)
                SS0 = rotate_right(A,2) ^ rotate_right(A,13) ^ rotate_right(A,22)
                ch  = (E & F) ^ ((~E) & G)
                temp1 = (H + SS1 + ch + K[j] + W[j]) & 0xFFFFFFFF
                maj = (A & B) ^ (A & C) ^ ( B & C)
                temp2 = (SS0 + maj) & 0xFFFFFFFF

                H = G
                G = F
                F = E
                E = (D + temp1)
                D = C
                C = B
                B = A
                A = (temp1 + temp2)


                A = A & 0xFFFFFFFF
                B = B & 0xFFFFFFFF
                C = C & 0xFFFFFFFF
                D = D & 0xFFFFFFFF
                E = E & 0xFFFFFFFF
                F = F & 0xFFFFFFFF
                G = G & 0xFFFFFFFF
                H = H & 0xFFFFFFFF


        V_i_1 = []
        V_i_1.append((A + V_i[0]) & 0xFFFFFFFF)
        V_i_1.append((B + V_i[1]) & 0xFFFFFFFF)
        V_i_1.append((C + V_i[2]) & 0xFFFFFFFF)
        V_i_1.append((D + V_i[3]) & 0xFFFFFFFF)
        V_i_1.append((E + V_i[4]) & 0xFFFFFFFF)
        V_i_1.append((F + V_i[5]) & 0xFFFFFFFF)
        V_i_1.append((G + V_i[6]) & 0xFFFFFFFF)
        V_i_1.append((H + V_i[7]) & 0xFFFFFFFF)

        return V_i_1

def hash_msg(msg):
        len1 = len(msg)
        reserve1 = len1 % 64
        msg1 = msg.encode() + struct.pack("B",128)
        reserve1 = reserve1 + 1
        for i in range(reserve1, 56):
                msg1 = msg1 + struct.pack("B",0)

        bit_length = (len1) * 8
        bit_length_string = struct.pack(">Q", bit_length)
        msg1 = msg1 + bit_length_string

        print (len(msg1) )
        group_count = int(len(msg1) / 64 )
        print(group_count)

        m_1 = B = []
        for i in range(0, group_count):
                B.append(0)
                B[i] = msg1[i*64:(i+1)*64]

        V = []
        V.append(0)
        V[0] = IV
        for i in range(0, group_count):
                V.append(0)
                V[i+1] = CF(V[i], B[i])

        return V[i+1]

print ("1313141151617118819101100191171615113121")
y = hash_msg("1313141151617118819101100191171615113121")
print ("result: ")
out_hex(y)



