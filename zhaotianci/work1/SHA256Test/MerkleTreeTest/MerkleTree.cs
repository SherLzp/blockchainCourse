using System;
using System.Collections.Generic;
using System.Text;
using System.Security.Cryptography;
using System.Linq;

namespace MerkleTreeTest
{
    public class MNode
    {
        public byte[] HashValue { get; set; }
        public MNode Parent { get; set; }
        public MNode LChild { get; set; }
        public MNode RChild { get; set; }

        public MNode(MNode lChild, MNode rChild)
        {
            this.Parent = null;
            this.LChild = lChild;
            this.RChild = rChild;
            lChild.Parent = this;
            rChild.Parent = this;

            var encoder = SHA256.Create();
            this.HashValue = encoder.ComputeHash(AddHashValue(lChild.HashValue, rChild.HashValue));
        }

        public MNode(string data)
        {
            this.Parent = null;
            this.LChild = null;
            this.RChild = null;

            var encoder = SHA256.Create();
            this.HashValue = encoder.ComputeHash(Encoding.Default.GetBytes(data));
        }

        public static MNode GetSibling(MNode node)
        {
            if(node == null)
            {
                return null;
            }
            var p = node.Parent;
            if(p == null)
            {
                return null;
            }
            if(node == p.LChild)
            {
                return p.RChild;
            }
            return p.LChild;
        }

        public static MNode GetRoot(MNode node)
        {
            if(node.Parent == null)
            {
                return node;
            }
            return GetRoot(node.Parent);
        }

        public static byte[] AddHashValue(byte[] a, byte[] b)
        {
            var res = new byte[a.Length];
            int flag = 0;
            for(int i = a.Length - 1; i >=0; i--)
            {
                var c = a[i] + b[i] + flag;
                if(c >= 16)
                {
                    flag = 1;
                    c -= 16;
                }
                else
                {
                    flag = 0;
                }
                res[i] = (byte)c;
            }
            return res;
        }
    }

    public class MerkleTree
    {
        public List<MNode> Leaves { get; private set; }
        public MNode Root { get; private set; }

        public MerkleTree(List<string> datas)
        {
            this.Leaves = new List<MNode>();
            foreach(var data in datas)
            {
                this.Leaves.Add(new MNode(data));
            }
            this.ConstructTree();
            this.Root = MNode.GetRoot(this.Leaves[0]);
        }

        private void ConstructTree()
        {
            var buffer = new List<MNode>(this.Leaves);
            while(buffer.Count > 1)
            {
                var count = buffer.Count;
                for (int i = 0; i < count; i += 2)
                {
                    buffer.Add(new MNode(buffer[i], buffer[i + 1]));
                }
                buffer.RemoveRange(0, count);
            }
        }

        public bool Verify(int index, string data)
        {
            var encoder = SHA256.Create();
            var hashValue = encoder.ComputeHash(Encoding.Default.GetBytes(data));

            var node = this.Leaves[index];
            var sibling = MNode.GetSibling(node);
            while(sibling != null)
            {
                hashValue = encoder.ComputeHash(MNode.AddHashValue(hashValue, sibling.HashValue));
                node = node.Parent;
                sibling = MNode.GetSibling(node);
            }
            return Enumerable.SequenceEqual(this.Root.HashValue, hashValue);
        }
    }
}
