using System;
using System.Collections.Generic;
using System.Text;

namespace CodeGenerator
{
    public class SHA256
    {
        public static uint[] H0 = new uint[] 
        {
            0x6a09e667,
            0xbb67ae85,
            0x3c6ef372,
            0xa54ff53a,
            0x510e527f,
            0x9b05688c,
            0x1f83d9ab,
            0x5be0cd19 
        };

        public static uint[] K = new uint[]
        {
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        };

        public string GetSHA256Code(string content)
        {
            var code = string.Empty;
            var res = new List<uint>(H0);

            var byteArr = this.PreProcess(content);
            var chuncks = this.GetChuncks(byteArr);
            for(int i = 0; i < chuncks.Count; i++)
            {
                var words = new List<uint>(chuncks[i]);
                for(int j = 16; j < 64; j++)
                {
                    var word = Fun1(words[j - 2]) + words[j - 7] + Fun0(words[j - 15]) + words[j - 16];
                    words.Add(word);
                }

                var chuckRes = new List<uint>(res);
                for(int j = 0; j < 64; j++)
                {
                    var s0 = EFun0(chuckRes[0]);
                    var maj = MA(chuckRes[0], chuckRes[1], chuckRes[2]);
                    var t2 = s0 + maj;
                    var s1 = EFun1(chuckRes[4]);
                    var ch = CH(chuckRes[4], chuckRes[5], chuckRes[6]);
                    var t1 = chuckRes[7] + s1 + ch + K[j] + words[j];

                    chuckRes[7] = chuckRes[6];
                    chuckRes[6] = chuckRes[5];
                    chuckRes[5] = chuckRes[4];
                    chuckRes[4] = chuckRes[3] + t1;
                    chuckRes[3] = chuckRes[2];
                    chuckRes[2] = chuckRes[1];
                    chuckRes[1] = chuckRes[0];
                    chuckRes[0] = t1 + t2;
                }

                for(int j = 0; j < 8; j++)
                {
                    res[j] += chuckRes[j];
                }
            }

            foreach(var n in res)
            {
                var bytes = BitConverter.GetBytes(n);
                Array.Reverse(bytes);
                foreach(var b in bytes)
                {
                    code += b.ToString("X2");
                }
            }
            return code;
        }

        private uint Fun0(uint x)
        {
            return SRLoop(x, 7) ^ SRLoop(x, 18) ^ (x >> 3);
        }

        private uint Fun1(uint x)
        {
            return SRLoop(x, 17) ^ SRLoop(x, 19) ^ (x >> 10);
        }

        private uint EFun0(uint x)
        {
            return SRLoop(x, 2) ^ SRLoop(x, 13) ^ SRLoop(x, 22);
        }

        private uint EFun1(uint x)
        {
            return SRLoop(x, 6) ^ SRLoop(x, 11) ^ SRLoop(x, 25);
        }

        private uint CH(uint x, uint y, uint z)
        {
            return (x & y) ^ (~x & z);
        }

        private uint MA(uint x, uint y, uint z)
        {
            return (x & y) ^ (x & z) ^ (y & z);
        }

        private uint SRLoop(uint x, int count)
        {
            return (x << (32 - count) | (x >> count));
        }

        private List<List<uint>> GetChuncks(List<byte> arr)
        {
            if(arr.Count % 64 != 0)
            {
                throw new Exception("Error while Encoding!");
            }
            var count = arr.Count / 64;
            var resList = new List<List<uint>>();
            for(int i = 0; i < count; i++)
            {
                resList.Add(this.GetChunck(arr.GetRange(i * 64, 64)));
            }
            return resList;
        }

        private List<uint> GetChunck(List<byte> arr)
        {
            var resList = new List<uint>();
            for(int i = 0; i < 64; i += 4)
            {
                var byteArr = arr.GetRange(i, 4).ToArray();
                Array.Reverse(byteArr);
                resList.Add(BitConverter.ToUInt32(byteArr));
            }
            return resList;
        }

        private List<byte> PreProcess(string content)
        {
            var byteList = new List<byte>(System.Text.Encoding.Default.GetBytes(content));
            ulong bitLength = (ulong)byteList.Count * 8;
            byteList.Add(128);
            var extraCount = (56 + 64 - byteList.Count % 64) % 64;
            for(int i = 0; i < extraCount; i++)
            {
                byteList.Add(0);
            }
            var lengthBytes = BitConverter.GetBytes(bitLength);
            Array.Reverse(lengthBytes);
            foreach(var b in lengthBytes)
            {
                byteList.Add(b);
            }
            return byteList;
        }
    }
}
