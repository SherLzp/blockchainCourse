###################
# Developer: LX
# Date: 2020/12/02
# Purpose: Implementation of SHA256
###################
#coding:utf-8

# 常量储存
H = (0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19)
K = (
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
)

# 根据Blog提到的几个会用到的计算函数
def rightrotate(x, n):
    return ((x >> n) | (x << (32 - n))) & 0xFFFFFFFF
def sigma0(t):
	return (rightrotate(t, 7) ^ rightrotate(t, 18) ^ (t >> 3))
def sigma1(t):
	return(rightrotate(t, 17) ^ rightrotate(t, 19) ^ (t >> 10))

# 预处理步骤，核心思想在填充成512个bit(64byte)倍数的块
def preprocess(m):
    length=len(m)
    m+=b"\x80"      
    #通过0x80把第一个1放进去，这里其实多放了7个0，也就是一个byte,但是输入其实都是byte为单位的，所以没有关系
    # 448bit = 56byte 512bit = 64byte
    remain = length % 64    
    if (remain)< 56 :   #如果比448小，就不用再补一块512了
        m+=b"\x00" * ((56-1)-remain)
    else:
        m+=b"\x00" * ((56-1+64)-remain)
    #最后一块剩下的64bit放长度信息，大端
    temp=(length*8).to_bytes(8,"big")
    #print(temp)  
    m+=temp
    return m

# 处理函数，调用了preprocess以及之前的三个计算函数，输入为utf8编码后的
def SHA256(m):
    message=preprocess(m)
    #print (message)
    result=list(H)    
    #64个byte作为一个循环(1个block)
    for i in range(0,len(message),64):
        block=message[i:i+64]
        w = []
        for i in range(0, 16):
            w.append(bytes(block[i*4:i*4+4]))
        #把16个word扩充成64个word
        for i in range(16,64):
            w1=sigma1(int.from_bytes(w[i-2],'big'))
            w2=int.from_bytes(w[i-7],'big')
            w3=sigma0(int.from_bytes(w[i-15],'big'))
            w4=int.from_bytes(w[i-16],'big')
            w.append(((w1+w2+w3+w4) & 0xFFFFFFFF).to_bytes(4,'big'))
        #根据伪代码给8个变量
        #print(w)
        assert len(w) == 64
        a = result[0]
        b = result[1]
        c = result[2]
        d = result[3]
        e = result[4]
        f = result[5]
        g = result[6]
        h = result[7]

        for j in range(64):
            s0=rightrotate(a, 2) ^ rightrotate(a, 13) ^ rightrotate(a, 22)
            maj = (a & b) ^ (a & c) ^ (b & c)
            t2 = (s0 + maj) & 0xFFFFFFFF
            s1 = rightrotate(e, 6) ^ rightrotate(e, 11) ^ rightrotate(e, 25)
            ch = (e & f) ^ ((0xFFFFFFFF^e) & g)
            t1 = (h + s1 + ch + K[j] + int.from_bytes(w[j],'big')) & 0xFFFFFFFF                      
            h = g
            g = f
            f = e
            e = (d + t1) & 0xFFFFFFFF
            d = c
            c = b
            b = a
            a = (t1 + t2) & 0xFFFFFFFF
        result[0] += a
        result[1] += b
        result[2] += c
        result[3] += d
        result[4] += e
        result[5] += f
        result[6] += g
        result[7] += h      
        for j in range(0,len(result)):
            result[j]=result[j]&0xFFFFFFFF
    sum=bytearray()
    for h in result:
        sum+=h.to_bytes(4,'big')
    return sum

def main():
    temp = input("Enter string: ")
    message = temp.encode("utf8")
    print("Encoded result by SHA256: "+ SHA256(message).hex())        
    

if __name__ == "__main__":
    main()

