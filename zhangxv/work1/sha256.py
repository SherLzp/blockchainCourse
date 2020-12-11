class sha256:
    def __init__(self, plain):
        if type(plain) is not str:
            raise TypeError('PlainText must be str')
        self.plain_text = plain
        self.pad = self.padding()
        self.cut = self.cutting()
        self._H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]
        self._K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
          0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
          0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
          0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
          0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
          0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
          0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
          0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2]
        self.sha256 = self.hash()

    def __bitLen(self, obj):
        return len(obj)*8

    def __str2byte(self, string:str):
        arr = []
        for i in string.encode():
            arr.append(i)
        return arr

    def __add1_0(self, byte_arr):
        byte_arr.append(int('80', 16))
        while (self.__bitLen(byte_arr) % 512) != 448:
            byte_arr.append(0)

    def __len_64bit(self,length):
        arr = [0 for i in range(64)]
        inbit = bin(length)[2:] #remove 0b

        i = len(inbit)-1
        while i >= 0:
            arr[63-i] = inbit[len(inbit)-i-1]
            i = i - 1

        split = ''
        bin_arr = []

        for i in range(64):
            if (i+1)%8 == 0:
                split+=str(arr[i])
                bin_arr.append(split)
                split=''
            else:
                split+=str(arr[i])
        dec_arr = []
        for bin_str in bin_arr:
            dec_arr.append(int(bin_str, 2))

        return dec_arr


    def __add_length(self,byte_arr, length):
        len_arr = self.__len_64bit(length)
        for i in len_arr:
            byte_arr.append(i)

    def padding(self):
        if self.__bitLen(self.plain_text) >= 2**64:
            raise ValueError('Message too long')
        length = self.__bitLen(self.plain_text)
        byte_arr = self.__str2byte(self.plain_text)
        self.__add1_0(byte_arr)
        self.__add_length(byte_arr, length)
        return byte_arr

    def __toWord(self, pad, pos):
        tmp = 0
        for i in range(4):
            tmp <<= 8
            tmp += pad[pos+i]

        return tmp


    def cutting(self):
        '''
        message --> N个512bit的块
        每个512bit --> 16个32bit的word
        '''
        w = 16
        h = self.__bitLen(self.pad) // 512
        '''
        self.pad 里是按照字节存的，4个可以组成一个32bit
        '''
        m = [[0 for j in range(w) ] for i in range(h)]

        for i in range(len(m)):
            for j in range(len(m[i])):
                pos = (i*16+j)*4
                m[i][j] = self.__toWord(self.pad, pos)

        return m

    def __rotr(self,x, n):
        return (x>>n)|(x<<(32-n))&0xFFFFFFFF

    def __shr(self,x, n):
        return (x>>n)&0xFFFFFFFF

    def __Ch(self,x, y, z):
        return (x&y)^(~x&z)

    def __Ma(self,x, y, z):
        return (x&y)^(x&z)^(y&z)

    #s represents square c represents circle  The shape of sigma

    def __sigma0s(self,x):
        return self.__rotr(x, 2) ^ self.__rotr(x, 13) ^ self.__rotr(x, 22)

    def __sigma1s(self,x):
        return self.__rotr(x, 6) ^ self.__rotr(x, 11) ^ self.__rotr(x, 25)

    def __sigma0c(self,x):
        return self.__rotr(x, 7) ^ self.__rotr(x, 18) ^ self.__shr(x, 3)

    def __sigma1c(self,x):
        return self.__rotr(x, 17) ^ self.__rotr(x, 19) ^ self.__shr(x, 10)


    def hash(self):
        H = self._H.copy()

        for m in range(len(self.cut)):
            w = [0 for i in range(64)]
            for i in range(64):
                if i < 16:
                    w[i] = self.cut[m][i]
                else:
                    w[i] = (self.__sigma1c(w[i-2])+w[i-7]+self.__sigma0c(w[i-15])+w[i-16])&0xFFFFFFFF

            a = H[0]
            b = H[1]
            c = H[2]
            d = H[3]
            e = H[4]
            f = H[5]
            g = H[6]
            h = H[7]

            for t in range(64):
                temp_h_ch = (h + self.__Ch(e,f,g))&0xFFFFFFFF
                temp_kw = (self._K[t] + w[t])&0xFFFFFFFF
                t1 = (temp_h_ch + temp_kw + (self.__sigma1s(e))&0xFFFFFFFF)&0xFFFFFFFF
                t2 = ((self.__Ma(a,b,c)&0xFFFFFFFF) + self.__sigma0s(a))&0xFFFFFFFF
                h = g
                g = f
                f = e
                e = (d+t1)&0xFFFFFFFF
                d = c
                c = b
                b = a
                a = (t1+t2)&0xFFFFFFFF

            H[ 0 ]= (a + H[ 0 ]) &0xFFFFFFFF
            H[ 1 ]= (b + H[ 1 ]) &0xFFFFFFFF
            H[ 2 ]= (c + H[ 2 ]) &0xFFFFFFFF
            H[ 3 ]= (d + H[ 3 ]) &0xFFFFFFFF
            H[ 4 ]= (e + H[ 4 ]) &0xFFFFFFFF
            H[ 5 ]= (f + H[ 5 ]) &0xFFFFFFFF
            H[ 6 ]= (g + H[ 6 ]) &0xFFFFFFFF
            H[ 7 ]= (h + H[ 7 ]) &0xFFFFFFFF

        Hex = [hex(H[i]) for i in range(8)]
        string = ''
        for i in Hex:
            string += '{0:0>8}'.format(str(i)[2:])
        print(string)
        return string

if __name__ == '__main__':
    #line = int(input('请输入明文: '))
    #sha256('ab'*line)
    sha256('ab'*2000)
