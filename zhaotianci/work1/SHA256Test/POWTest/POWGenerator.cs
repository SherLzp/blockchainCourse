using System;
using System.Collections.Generic;
using System.Numerics;
using System.Security.Cryptography;
using System.Text;

namespace POWTest
{
    public static class POWGenerator
    {
        static byte B1 = 0x0F;
        static byte B2 = 0xF0;
        public static byte[] GetPOWCode(int n, byte[] header)
        {
            var nonce = new BigInteger(0);
            var encoder = SHA256.Create();
            byte[] val;
            do
            {
                val = HeaderAddNonce(header, nonce.ToByteArray());
                val = encoder.ComputeHash(val);
                val = encoder.ComputeHash(val);
                nonce += 1;
            } while (!Check(n, val));
            return val;
        }

        public static bool Check(int n, byte[] hashVal)
        {
            for(int i = 0; i < n; i++)
            {
                var b = hashVal[i / 2];
                if(i % 2 == 0)
                {
                    b &= B2;
                }
                else
                {
                    b &= B1;
                }
                if(b != 0)
                {
                    return false;
                }
            }
            return true;
        }

        public static byte[] HeaderAddNonce(byte[] header, byte[] nonce)
        {
            var res = new byte[header.Length];
            int flag = 0;
            for(int i = 0; i < header.Length; i++)
            {
                int c;
                if(i < nonce.Length)
                {
                    c = header[header.Length - 1 - i] + nonce[nonce.Length - 1 - i] + flag;
                }
                else
                {
                    c = header[header.Length - 1 - i] + flag;
                }
                
                if(c >= 16)
                {
                    flag = 1;
                    c -= 16;
                }
                else
                {
                    flag = 0;
                }
                res[res.Length - 1 - i] = (byte)c;
            }
            return res;
        }
    }
}
