import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.Scanner;

public class SHA256Test {
    //主函数
    public static void main(String[] args) {
        System.out.println("原字符串：");
        Scanner input = new Scanner(System.in);
        String s = input.nextLine();
        byte[] b = SHA(s.getBytes());
        System.out.println("哈希值：");
        for (byte bb : b) System.out.printf("%02x", bb);
    }

    //预处理函数
    static int[] pretreatment(byte[] StrBytes) {
        ArrayList<Integer> a = new ArrayList<>();
        for (byte b : StrBytes) {
            for (int i = 7; i >= 0; i--) {
                if (((b >> i) & 0x1) == 0) a.add(0);
                else a.add(1);
            }
        }
        long n = a.size();
        //进行补位
        a.add(1);
        while (a.size() % 512 != 448) a.add(0);
        for (int i = 63; i >= 0; i--) {
            if (((n >> i) & 0x1) == 0) a.add(0);
            else a.add(1);
        }
        //将ArrayList转化成int[]
        int nn = a.size() / 32;
        int[] result = new int[nn];
        for (int i = 0; i < a.size(); i = i + 32) {
            long t = 0;
            for (int j = i; j < i + 32; j++) {
                int k = j % 32;
                if (a.get(j) == 1)
                    t += (long) Math.pow(2, 31 - k);
            }
            result[i / 32] = (int) t;
        }
        return result;
    }

    //算法实现函数
    static byte[] SHA(byte[] StrBytes) {
        //存储哈希值
        int[] H = {0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19};
        //常量
        int[] K = {
                0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
                0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
                0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
                0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
                0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
                0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
                0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
                0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        };
        int[] W = new int[64];
        int[] A = new int[8];
        int[] words = pretreatment(StrBytes);
        int n = words.length / 16;
        for (int i = 0; i < n; i++) {
            //初始化A
            for (int j = 0; j < 8; j++) A[j] = H[j];
            //计算64个W
            for (int j = 0; j < 16; j++) W[j] = words[i * 16 + j];
            for (int j = 16; j < W.length; j++) W[j] = ksi1(W[j - 2]) + W[j - 7] + ksi0(W[j - 15]) + W[j - 16];
            //按照公式迭代计算64次A
            for (int j = 0; j < 64; j++) {
                int a = A[7] + Ch(A[4], A[5], A[6]) + sig1(A[4]) + W[j] + K[j];
                int b = sig0(A[0]) + Ma(A[0], A[1], A[2]);
                A[7] = A[6];
                A[6] = A[5];
                A[5] = A[4];
                A[4] = A[3];
                A[3] = A[2];
                A[2] = A[1];
                A[1] = A[0];
                A[4] += a;
                A[0] = a + b;
            }
            for (int j = 0; j < 8; j++) H[j] += A[j]; //更新哈希值
        }
        ByteBuffer b = ByteBuffer.allocate(32);
        for (int i : H) b.putInt(i);
        return b.array();
    }

    //六个逻辑函数
    static int Ch(int x, int y, int z) {
        return (x & y) ^ ((~x) & z);
    }

    static int Ma(int x, int y, int z) {
        return (x & y) ^ (x & z) ^ (y & z);
    }

    static int sig0(int x) {
        return Integer.rotateRight(x, 2) ^ Integer.rotateRight(x, 13) ^ Integer.rotateRight(x, 22);
    }

    static int sig1(int x) {
        return Integer.rotateRight(x, 6) ^ Integer.rotateRight(x, 11) ^ Integer.rotateRight(x, 25);
    }

    static int ksi0(int x) {
        return Integer.rotateRight(x, 7) ^ Integer.rotateRight(x, 18) ^ (x >>> 3);
    }

    static int ksi1(int x) {
        return Integer.rotateRight(x, 17) ^ Integer.rotateRight(x, 19) ^ (x >>> 10);
    }
}
