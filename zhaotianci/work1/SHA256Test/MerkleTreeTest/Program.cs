using System;
using System.Collections.Generic;

namespace MerkleTreeTest
{
    class Program
    {
        static void Main(string[] args)
        {
            var merkleTree = new MerkleTree(new List<string>()
            {
                "Data1", "Data2", "Data3", "Data4"
            });

            var input = Console.ReadLine().Split(" ");
            var index = Convert.ToInt32(input[0]);
            Console.WriteLine(merkleTree.Verify(index, input[1]));
            Console.Read();
        }
    }
}
