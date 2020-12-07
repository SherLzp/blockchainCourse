import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class SHA256 {

    static long h0 = 0x6a09e667;
    static long h1 = 0xbb67ae85;
    static long h2 = 0x3c6ef372;
    static long h3 = 0xa54ff53a;
    static long h4 = 0x510e527f;
    static long h5 = 0x9b05688c;
    static long h6 = 0x1f83d9ab;
    static long h7 = 0x5be0cd19;
    // message schedule
    static long key[] = { 0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4,
            0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152,
            0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138,
            0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70,
            0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
            0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa,
            0xa4506ceb, 0xbef9a3f7, 0xc67178f2 };

    public static void main(String[] args) {
        List<long[]> input = new ArrayList<>();
        init(input);
        long[] temp = input.get(0);
        for (long[] t : input) {
            process(t);
        }
        System.out.println(Integer.toHexString((int) h0) + Integer.toHexString((int) h1) + Integer.toHexString((int) h2)
                + Integer.toHexString((int) h3) + Integer.toHexString((int) h4) + Integer.toHexString((int) h5)
                + Integer.toHexString((int) h6) + Integer.toHexString((int) h7));
    }

    // Process raw data and divide it into 512bits' arrays
    static void init(List<long[]> input) {
        System.out.println("请输入要加密的数据：");
        Scanner scan = new Scanner(System.in);
        String tempS = scan.nextLine();
        byte[] tempB = null;
        try {
            tempB = tempS.getBytes("utf-8");
        } catch (Exception e) {
            System.out.println(e);
        }
        int[] tempI = new int[tempB.length];
        for (int i = 0; i < tempB.length; i++) {
            tempI[i] = (int) tempB[i] & 0x000000ff;
        }

        int countI = 0, count = 0;
        long[] temp = new long[16];
        while (true) {
            for (int i = 0; i < 4; i++) {
                if (count == tempI.length) {
                    temp[countI] += (1 << (8 * (4 - i) - 1));
                    if (countI > 13) {
                        input.add(temp.clone());
                        temp = new long[16];
                    }
                    temp[15] += 8 * tempI.length;
                    input.add(temp.clone());
                    return;
                }
                temp[countI] = temp[countI] + (tempI[count++] << (3 - i) * 8);
            }
            countI++;
            if (countI == 16) {
                input.add(temp.clone());
                temp = new long[16];
                countI = 0;
            }
        }
    }

    // process the 512bits array
    static void process(long[] input) {
        long t1 = 0, t2 = 0;
        long[] w = new long[64];
        long A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0;
        for (int i = 0; i < 16; i++) {
            w[i] = input[i];
        }
        for (int i = 16; i < 64; i++) {
            w[i] = sigma1(w[i - 2]) + w[i - 7] + sigma0(w[i - 15]) + w[i - 16];
        }
        A = h0;
        B = h1;
        C = h2;
        D = h3;
        E = h4;
        F = h5;
        G = h6;
        H = h7;
        for (int i = 0; i < 64; i++) {
            t1 = H + Sigma1(E) + ch(E, F, G) + key[i] + w[i];
            t2 = Sigma0(A) + ma(A, B, C);
            H = G & 0x00000000FFFFFFFFL;
            G = F & 0x00000000FFFFFFFFL;
            F = E & 0x00000000FFFFFFFFL;
            E = (D + t1) & 0x00000000FFFFFFFFL;
            D = C & 0x00000000FFFFFFFFL;
            C = B & 0x00000000FFFFFFFFL;
            B = A & 0x00000000FFFFFFFFL;
            A = (t1 + t2) & 0x00000000FFFFFFFFL;
        }
        int[] result = new int[8];
        h0 = (h0 + A) & 0x00000000FFFFFFFFL;
        h1 = (h1 + B) & 0x00000000FFFFFFFFL;
        h2 = (h2 + C) & 0x00000000FFFFFFFFL;
        h3 = (h3 + D) & 0x00000000FFFFFFFFL;
        h4 = (h4 + E) & 0x00000000FFFFFFFFL;
        h5 = (h5 + F) & 0x00000000FFFFFFFFL;
        h6 = (h6 + G) & 0x00000000FFFFFFFFL;
        h7 = (h7 + H) & 0x00000000FFFFFFFFL;
        result[0] = (int) h0;
        result[1] = (int) h1;
        result[2] = (int) h2;
        result[3] = (int) h3;
        result[4] = (int) h4;
        result[5] = (int) h5;
        result[6] = (int) h6;
        result[7] = (int) h7;
        return;
    }

    static long ch(long x, long y, long z) {
        return (x & y) ^ ((0x00000000FFFFFFFF & (~x)) & z);
    }

    static long ma(long x, long y, long z) {
        return (x & y) ^ (x & z) ^ (y & z);
    }

    static long rotl(long x, long n) {

        return 0x00000000FFFFFFFFL & ((x << n) & 0x00000000FFFFFFFFL | (x) >> (32 - (n)));
    }

    static long shr(long x, long n) {

        return (((x & 0x00000000FFFFFFFFL) >> n) & 0x00000000FFFFFFFFL);
    }

    static long Sigma0(long x) {
        x = x & 0x00000000FFFFFFFFL;
        return rotl(x, 30) ^ rotl(x, 19) ^ rotl(x, 10);
    }

    static long Sigma1(long x) {
        x = x & 0x00000000FFFFFFFFL;
        return rotl(x, 26) ^ rotl(x, 21) ^ rotl(x, 7);
    }

    static long sigma0(long x) {
        x = x & 0x00000000FFFFFFFFL;
        return rotl(x, 25) ^ rotl(x, 14) ^ shr(x, 3);
    }

    static long sigma1(long x) {
        x = x & 0x00000000FFFFFFFFL;
        return rotl(x, 15) ^ rotl(x, 13) ^ shr(x, 10);
    }

}
