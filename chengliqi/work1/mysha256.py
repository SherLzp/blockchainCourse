import time
import hashlib
import hashlib as hasher
import datetime as date
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

def pre_processing():
    global x
    x = input("输入需要hash的字段：")
    #print(x)
    global start
    start = time.time()
    binaryEncode = bytearray(x, 'utf-8')
    # 字符扩展 首先补位1byte 8字节,第一位为1:1000 0000  每字节8位
    binaryEncodeLength = len(x) * 8
    #print(len(binaryEncode) * 8)
    binaryEncode.append(0x80)
    #print(len(binaryEncode) * 8)
    # 设l为长度，k为0位，最后累加，然后l+1+k全等448 mod 512
    #变为512的整数倍
    while (((len(binaryEncode) * 8 + 64) % 512) != 0):
        binaryEncode.append(0x00)
    #print(len(binaryEncode) * 8)
    #补位：原消息x的64位二进制表示形式
    #我采用的是大端
    binaryEncode += binaryEncodeLength.to_bytes(8, 'big')
    #print(len(binaryEncode) * 8)
    return binaryEncode

def generate_hash(message: bytearray) -> bytearray:

    #分类信息处理，可以处理中文、英文、数字
    if isinstance(message, str):
        message = bytearray(message, 'ascii')
    elif isinstance(message, bytes):
        message = bytearray(message)
    elif not isinstance(message, bytearray):
        raise TypeError


    length = len(message) * 8
    message.append(0x80)
    while (len(message) * 8 + 64) % 512 != 0:
        message.append(0x00)
    #原消息x的64位二进制表示形式
    message += length.to_bytes(8, 'big')

    assert (len(message) * 8) % 512 == 0, "扩展错误"


    blocks = []
    #分块64byte=512bit
    for i in range(0, len(message), 64):
        blocks.append(message[i:i+64])


    h0 = 0x6a09e667
    h1 = 0xbb67ae85
    h2 = 0x3c6ef372
    h3 = 0xa54ff53a
    h5 = 0x9b05688c
    h4 = 0x510e527f
    h6 = 0x1f83d9ab
    h7 = 0x5be0cd19


    for message_block in blocks:

        message_schedule = []
        for t in range(0, 64):
            if t <= 15:
                message_schedule.append(bytes(message_block[t*4:(t*4)+4]))
            else:
                term1 = _sigma1(int.from_bytes(message_schedule[t-2], 'big'))
                term2 = int.from_bytes(message_schedule[t-7], 'big')
                term3 = _sigma0(int.from_bytes(message_schedule[t-15], 'big'))
                term4 = int.from_bytes(message_schedule[t-16], 'big')

                schedule = ((term1 + term2 + term3 + term4) % 2**32).to_bytes(4, 'big')
                message_schedule.append(schedule)

        assert len(message_schedule) == 64

        a = h0
        b = h1
        c = h2
        d = h3
        e = h4
        f = h5
        g = h6
        h = h7

        for t in range(64):
            t1 = ((h + _capsigma1(e) + _ch(e, f, g) + K[t] +
                   int.from_bytes(message_schedule[t], 'big')) % 2**32)

            t2 = (_capsigma0(a) + _maj(a, b, c)) % 2**32

            h = g
            g = f
            f = e
            e = (d + t1) % 2**32
            d = c
            c = b
            b = a
            a = (t1 + t2) % 2**32

        h0 = (h0 + a) % 2**32
        h1 = (h1 + b) % 2**32
        h2 = (h2 + c) % 2**32
        h3 = (h3 + d) % 2**32
        h4 = (h4 + e) % 2**32
        h5 = (h5 + f) % 2**32
        h6 = (h6 + g) % 2**32
        h7 = (h7 + h) % 2**32

    return ((h0).to_bytes(4, 'big') + (h1).to_bytes(4, 'big') +
            (h2).to_bytes(4, 'big') + (h3).to_bytes(4, 'big') +
            (h4).to_bytes(4, 'big') + (h5).to_bytes(4, 'big') +
            (h6).to_bytes(4, 'big') + (h7).to_bytes(4, 'big'))

def _sigma0(num: int):
    num = (_rotate_right(num, 7) ^
           _rotate_right(num, 18) ^
           (num >> 3))
    return num

def _sigma1(num: int):
    num = (_rotate_right(num, 17) ^
           _rotate_right(num, 19) ^
           (num >> 10))
    return num

def _capsigma0(num: int):
    num = (_rotate_right(num, 2) ^
           _rotate_right(num, 13) ^
           _rotate_right(num, 22))
    return num

def _capsigma1(num: int):
    num = (_rotate_right(num, 6) ^
           _rotate_right(num, 11) ^
           _rotate_right(num, 25))
    return num

def _ch(x: int, y: int, z: int):
    return (x & y) ^ (~x & z)

def _maj(x: int, y: int, z: int):
    return (x & y) ^ (x & z) ^ (y & z)

def _rotate_right(num: int, shift: int, size: int = 32):
    return (num >> shift) | (num << size - shift)

if __name__ == "__main__":
    x = input("输入需要hash的字段：")
    start = time.time()
    #print(x.encode('utf-8'))
    print("自己实现的sha256:" + generate_hash(x.encode('utf-8')).hex())
    end = time.time()
    print("单次计算sha256:%fms" % ((end - start) * 1000))
    #python自带的sha256调用：
    m = hashlib.sha256()  # 括号内也可以传值，类型也要求是bytes类型
    m.update(x.encode('utf-8'))
    print("调用python库检验:" + m.hexdigest())

    # 实验数据验证sha256在区块链中作用：
    # 1.验证sha256Hash比较速度，对于大文件或者长字符串只需要比较其hash值，而不用比较其具体内容,用于验证的字符串见testbig.txt
    print("实验一：验证sha256大文件比较速度快")
    y = input("输入需要比较的字段1：")
    z = input("输入需要比较的字段2：")
    md1 = hashlib.sha256()
    md2 = hashlib.sha256()
    stime = time.time()
    md1.update(y.encode('utf-8'))
    md2.update(z.encode('utf-8'))
    print((md1.hexdigest()) == (md2.hexdigest()))
    etime = time.time()
    print("单次计算sha256:%fms" % ((etime - stime) * 1000))
    flag = 1;
    MinLen=(len(y)<len(z)) and len(y) or len(z)
    for i in range(0, MinLen):
        if i > len(z) or y[i] != z[i]:
            flag = 0
            break;
    print(bool(flag))
    e1time = time.time()
    print("单次计算sha256:%fms" % ((e1time - etime) * 1000))

    # 2.实现小型区块链，上一块的信息用于下一块加密
    print("实验二：小型区块链，上一块信息对下一块加密")


    # 小型区块链区块头
    class Block:
        def __init__(self, index, timestamp, data, previous_hash):
            self.index = index
            self.timestamp = timestamp
            self.data = data
            self.previous_hash = previous_hash
            self.hash = self.hash_block()

        def hash_block(self):
            sha = hasher.sha256()
            sha.update((str(str(self.index) +
                            str(self.timestamp) +
                            str(self.data) +
                            str(self.previous_hash)).encode('utf-8')))
            return sha.hexdigest()


    # 创建起始块
    def create_genesis_block():
        return Block(0, date.datetime.now(), "创世块", "0")


    def next_block(last_block):
        this_index = last_block.index + 1
        this_timestamp = date.datetime.now()
        this_data = "Hey! I'm CLQ " + str(this_index)  # 输出的信息，可以更改
        this_hash = last_block.hash  # 上一块的hash值
        return Block(this_index, this_timestamp, this_data, this_hash)


    if __name__ == '__main__':

        blockchain = [create_genesis_block()]
        previous_block = blockchain[0]

        # 产生20个区块
        num_of_blocks_to_add = 20

        # 将块添加到区块链上
        for i in range(0, num_of_blocks_to_add):
            block_to_add = next_block(previous_block)
            blockchain.append(block_to_add)
            previous_block = block_to_add
            # 输出区块链
            print("Block #{} has been added to the blockchain!".format(block_to_add.index))
            print("Hash: {}\n".format(block_to_add.hash))
        print(blockchain)

    # 3.区块链PoW中SHA256作用（寻找前n位0）
    print("实验三：区块链PoW中SHA256作用（寻找前n位0）")
    # 小型区块链区块头
    class Block:
        def __init__(self, index, timestamp, data, previous_hash):
            self.index = index
            self.timestamp = timestamp
            self.data = data
            self.previous_hash = previous_hash
            self.hash = self.hash_block()

        def hash_block(self):
            sha = hasher.sha256()
            sha1 = hasher.sha256()
            for i in range(0,100000000):
                #两次sha256
                sha1.update((str(str(self.index) +
                            str(self.timestamp) +
                            str(self.data) +
                            str(i)+
                            str(self.previous_hash)).encode('utf-8')))
                sha.update(sha1.hexdigest().encode("utf-8"))
                s0="0000000000000000000000000000000000000000000000000000000000000000"
                global Nounce
                if sha.hexdigest()[0:int(Nounce)] == s0[0:int(Nounce)]:
                    break;
            return sha.hexdigest()


    # 创建起始块
    def create_genesis_block():
        return Block(0, date.datetime.now(), "创世块", "0000000003180102634clq3180102634clq3180102634clq0000000000000000")


    def next_block(last_block):
        this_index = last_block.index + 1
        this_timestamp = date.datetime.now()
        #this_data = "Hey! I'm CLQ " + str(this_index)  # 输出的信息，可以更改
        this_data = input(str("输入第"+str(this_index)+"区块信息：")) + str(this_index)  # 输出的信息，可以更改
        this_hash = last_block.hash  # 上一块的hash值
        return Block(this_index, this_timestamp, this_data, this_hash)

    if __name__ == '__main__':
        Nounce = input("请输入PoW挖矿寻找的前置位0个数：")
        blockchain = [create_genesis_block()]
        previous_block = blockchain[0]

        # 产生20个区块
        num_of_blocks_to_add = input("请输入希望产生的区块数：")

        # 将块添加到区块链上
        for i in range(0, int(num_of_blocks_to_add)):
            block_to_add = next_block(previous_block)
            blockchain.append(block_to_add)
            previous_block = block_to_add
            # 输出区块链
            print("Block #{} has been added to the blockchain!".format(block_to_add.index))
            print("Hash: {}\n".format(block_to_add.hash))
        print(blockchain)
