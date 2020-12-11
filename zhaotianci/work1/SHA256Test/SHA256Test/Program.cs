using System;
using System.Text;

namespace SHA256Test
{
    class Program
    {
        static void Main(string[] args)
        {
            var content = Console.ReadLine();
            var encoder = new SHA256();
            Console.WriteLine(encoder.GetSHA256Code(content));

            //Verify
            var encoderVerify = System.Security.Cryptography.SHA256.Create();
            var rightRes = encoderVerify.ComputeHash(Encoding.Default.GetBytes(content));
            var res = string.Empty;
            foreach (var b in rightRes)
            {
                res += b.ToString("X2");
            }
            Console.WriteLine(res);
            Console.Read();
        }
    }
}
