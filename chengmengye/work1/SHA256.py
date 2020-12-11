import hashlib
import time

h0 = 0x6a09e667
h1 = 0xbb67ae85
h2 = 0x3c6ef372
h3 = 0xa54ff53a
h4 = 0x510e527f
h5 = 0x9b05688c
h6 = 0x1f83d9ab
h7 = 0x5be0cd19

k = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2]


#将x循环右移b个bit
def RightR(x,b):
    return (x>>b)|(x<<32-b)

#逻辑函数定义
def Ch(x,y,z):
    return (x & y) ^ (~x & z)

def Ma(x,y,z):
    return (x & y) ^ (x & z) ^ (y & z)

def Sum0(x):
    return RightR(x,2) ^ RightR(x,13) ^ RightR(x,22)

def Sum1(x):
    return RightR(x,6) ^ RightR(x,11) ^ RightR(x,25)

def Sigma0(x):
    return RightR(x,7) ^ RightR(x,18) ^ (x>>3)

def Sigma1(x):
    return RightR(x,17) ^ RightR(x,19) ^ (x>>10)

#哈希计算算法
def Hash(message,h0,h1,h2,h3,h4,h5,h6,h7,k):
    #处理多种输入，中文/英文
    if isinstance(message, str):
        message = bytearray(message, 'ascii')
    elif isinstance(message, bytes):
        message = bytearray(message)
    elif not isinstance(message, bytearray):
        raise TypeError
    
    #消息预处理
    l=len(message)*8
    message.append(0x80)
    while (len(message)*8+64)%512!=0:
        message.append(0x00)
    message+=l.to_bytes(8,'big')

    #将消息分解成512-bit大小的块
    blocks=[]
    for i in range(0,len(message),64):
        blocks.append(message[i:i+64])

    #哈希计算主循环（64次）
    for m_block in blocks:
        words=[]
        #构造64个word
        for j in range(0,16):
            words.append(bytes(m_block[j*4:j*4+4]))
        for j in range(16,64):
            temp1=Sigma1(int.from_bytes(words[j-2],'big'))
            temp2=int.from_bytes(words[j-7],'big')
            temp3=Sigma0(int.from_bytes(words[j-15],'big'))
            temp4=int.from_bytes(words[j-16],'big')
            words.append(((temp1+temp2+temp3+temp4)%2**32).to_bytes(4,'big'))

        a=h0
        b=h1
        c=h2
        d=h3
        e=h4
        f=h5
        g=h6
        h=h7

        #进行64次加密循环
        for j in range(0,64):
            t1=(h+Sum1(e)+Ch(e,f,g)+k[j]+int.from_bytes(words[j],'big'))%2**32 
            t2=(Sum0(a)+Ma(a,b,c))%2**32 
            h=g
            g=f
            f=e
            e=(d+t1)%2**32
            d=c
            c=b
            b=a
            a=(t1+t2)%2**32 

        h0=(a+h0)%2**32 
        h1=(b+h1)%2**32 
        h2=(c+h2)%2**32 
        h3=(d+h3)%2**32 
        h4=(e+h4)%2**32 
        h5=(f+h5)%2**32 
        h6=(g+h6)%2**32 
        h7=(h+h7)%2**32 

    return ((h0).to_bytes(4,'big') + (h1).to_bytes(4,'big') +(h2).to_bytes(4,'big') + (h3).to_bytes(4,'big') 
            +(h4).to_bytes(4,'big') + (h5).to_bytes(4,'big') +(h6).to_bytes(4,'big') + (h7).to_bytes(4,'big'))


#------------------------------------------------------------------------------
#main函数
message=input("Please enter the string: ")
start=time.time()#记录SHA256算法所用时间
result1=Hash(message.encode('utf-8'),h0,h1,h2,h3,h4,h5,h6,h7,k).hex()
end=time.time()
print('SHA256 implemented by myself: ',result1)
print('Time to calculate sha256: %fms'%((end-start)*1000))

#调用python库的SHA256检验加密结果
result2=hashlib.sha256(message.encode('utf-8')).hexdigest()
print('SHA256 implemented by python\'s library: ',result2)
if result1==result2:
    print('The SHA256 algorithm is correct!')

#--------------------------------------------------------------------------------
#实验数据验证sha256在区块链中作用：
#实验1：利用SHA256对比两个大文件内容是否相同
#1.证明SHA256验证速度快
print('Please input two long strings to show the verification speed of SHA256 is fast.')
print('Ouput True if the two strings are the same.')
a=input('Please input the string1: ')
b=input('Please input the string2: ')

#通过SHA256比较两个大文件
start_t=time.time()
m1=hashlib.sha256(a.encode('utf-8'))
m2=hashlib.sha256(b.encode('utf-8'))
print((m1.hexdigest()) == (m2.hexdigest()))
end_t=time.time()
print('Time to compare two strings by SHA256: %fms'%((end_t-start_t)*1000))

#普通字符串比较
flag=1
for i in range(0,len(a)):
    if a[i]!=b[i] or i>len(b):
        flag=0
print(bool(flag))
end_t2=time.time()
print('Time to compare two strings normally: %fms'%((end_t2-end_t)*1000))

#2.证明SHA256有防止篡改的作用
print('Please input more than one string with slight difference to prove that SHA256 can prevent tampering.')
a=input('Please input the string1: ')
print('S1: ',hashlib.sha256(a.encode('utf-8')).hexdigest())
b=input('Please input the string2: ')
print('S2: ',hashlib.sha256(b.encode('utf-8')).hexdigest())
c=input('Please input the string1: ')
print('S3: ',hashlib.sha256(c.encode('utf-8')).hexdigest())
d=input('Please input the string2: ')
print('S4: ',hashlib.sha256(d.encode('utf-8')).hexdigest())

#3.比特币挖矿,验证SHA256在PoW中的作用
import hashlib
x=1
while x:
    mystr = hashlib.sha256(f"{x}".encode("utf-8")).hexdigest()
    print(x , mystr)
    if mystr[:6] == "000000":#寻找前置零的个数
        break
    x += 1
print("ok")
