using System;
using System.Security.Cryptography;
using System.Text;

namespace POWTest
{
    class Program
    {
        static void Main(string[] args)
        {
            var headerData = "Header Data";
            int count = 5;

            var n = Convert.ToInt32(Console.ReadLine());

            var encoder = SHA256.Create();
            var hashVal = encoder.ComputeHash(Encoding.Default.GetBytes(headerData));
            PrintBytes(hashVal);
            for(int i = 0; i < count; i++)
            {
                hashVal = POWGenerator.GetPOWCode(n, hashVal);
                PrintBytes(hashVal);
            }
            Console.Read();
        }

        static void PrintBytes(byte[] bytes)
        {
            var res = string.Empty;
            foreach (var b in bytes)
            {
                res += b.ToString("X2");
            }
            Console.WriteLine(res);
        }
    }
}
