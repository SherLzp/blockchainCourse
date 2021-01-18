#include<iostream>
#include<string>
#include<cstring>
#include<vector>
using namespace std;

class sha256 {
private:
    //8����ϣ��ֵ
    unsigned int h[8] = { 
             0x6a09e667,
             0xbb67ae85,
             0x3c6ef372,
             0xa54ff53a,
             0x510e527f,
             0x9b05688c,
             0x1f83d9ab,
             0x5be0cd19 };

    //�õ���64������
    unsigned int k[64] = { 
              0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
              0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
              0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
              0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
              0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
              0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
              0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
              0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
              0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
              0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
              0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
              0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
              0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
              0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
              0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
              0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2 };

    string msg;//��Ϣԭ��
    string changed;//Ԥ����֮�����Ϣ
    vector<vector<unsigned int>> chunks;//512-bit��chunk
    unsigned int hash[8];//�˸���ϣֵ���м�ֵ��

    //��ԭ�ĳ��ȣ�64-bit �޷���������ת��Ϊstring
    string l2s(unsigned long long int x) {
        string str = "";
        unsigned long long int k = 0xff00000000000000;
        for (int i = 0; i < 8; i++) {
            char c = (char)((x & k) >> (8 * (7-i)));
            str += c;
            k >>= 8;
        }
        return str;
    }

    //Ԥ������
    void pre_processing() {
        changed = msg;

        //����������
        //��ԭ��ĩβ����һ��bit��ֵΪ1���������ں��滹Ҫ���0����������ֱ�������8��bit�����ַ�����ʽ���������������ַ�������
        char c = 0x80;
        changed += c;

        //���㻹��Ҫ��Ӷ��ٸ�0
        int count = 448 - changed.length()*8 % 512;
        if (count < 0)
            count += 512;

        //��ĩβ������ɸ�0��������ӵ�0������һ����8�ı�������˽���Щ0ת�����ַ���ASCII��ֵΪ0x00����һ���ַ���ԭ����8��0
        count /= 8;
        c = 0;
        while (count) {
            changed += c;
            --count;
        }

        //���ӳ���ֵ
        changed.append(l2s((unsigned long long)msg.length()*8));
    }
   
    //��Ԥ����֮�����Ϣ�ֽ��512-bit��С�Ŀ�ĺ���
    void getchunk(string str) {
        vector<unsigned int> chunk;
        for (int i = 0; i < str.length(); i += 4) {
            unsigned int w = 0;
            for (int j = i; j < i + 4; j++) {
                w <<= 8;
                unsigned int k = (unsigned int)str[j];
                k &= 0xff;
                w |= k;
            }
            chunk.emplace_back(w);
        }
        chunks.emplace_back(chunk);
    }

    //�㷨����Ҫ�õ���6���߼�����
    unsigned int Ch(unsigned int a, unsigned int b, unsigned int c) {
        return (a & b) ^ ((~a) & c);
    }
    unsigned int Ma(unsigned int a, unsigned int b, unsigned int c) {
        return (a & b) ^ (a & c) ^ (b & c);
    }
    unsigned int sigma0(unsigned int x) {
        return ((x >> 2) | (x << 30)) ^ ((x >> 13) | (x << 19)) ^ ((x >> 22) | (x << 10));
    }
    unsigned int sigma1(unsigned int x) {
        return ((x >> 6) | (x << 26)) ^ ((x >> 11) | (x << 21)) ^ ((x >> 25) | (x << 7));
    }
    unsigned int theta0(unsigned int x) {
        return ((x >> 7) | (x << 25)) ^ ((x >> 18) | (x << 14)) ^ (x >> 3);
    }
    unsigned int theta1(unsigned int x) {
        return ((x >> 17) | (x << 15)) ^ ((x >> 19) | (x << 13)) ^ (x >> 10);
    }

public:
    //���캯��
    sha256(string str) :msg(str) {}

    //�õ���Ϣ�Ĺ�ϣֵ
    vector<unsigned int>  gethash() {

        //Ԥ����
        pre_processing();

        //����Ϣ�ֽ��512-bit�Ŀ�
        for (int i = 0; i < changed.length(); i += 64) {
            getchunk(changed.substr(i, 64));
        }

        //���ڲ����޷����������洢���ݣ������Ȼ�ؽ����ݷֳ������ɸ�32-bit��word������Ҫר��ʵ��

        for (vector<unsigned int> w : chunks) {

            //��16��word��չΪ64��word
            for (int i = 16; i < 64; i++) {
                unsigned int s0 = theta0(w[i - 15]);
                unsigned int s1 = theta1(w[i - 2]);
                w.emplace_back(w[i - 16] + s0 + w[i - 7] + s1);               
            }

            //����64�μ���ѭ��
            memcpy(hash, h, sizeof(unsigned int)*8);
            for (int i = 0; i < 64; i++) {
                unsigned int s0 = sigma0(hash[0]); 
                unsigned int maj = Ma(hash[0], hash[1], hash[2]); 
                unsigned int t2 = s0 + maj;
                unsigned int s1 = sigma1(hash[4]); 
                unsigned int ch = Ch(hash[4], hash[5], hash[6]); 
                unsigned int t1 = hash[7] + s1 + ch + k[i] + w[i];
                hash[7] = hash[6];
                hash[6] = hash[5];
                hash[5] = hash[4];
                hash[4] = hash[3] + t1;
                hash[3] = hash[2];
                hash[2] = hash[1];
                hash[1] = hash[0];
                hash[0] = t1 + t2;
            }

            //����ÿһ��ѭ���Ľ�����¹�ϣֵ
            h[0] = h[0] + hash[0];
            h[1] = h[1] + hash[1];
            h[2] = h[2] + hash[2];
            h[3] = h[3] + hash[3];
            h[4] = h[4] + hash[4];
            h[5] = h[5] + hash[5];
            h[6] = h[6] + hash[6];
            h[7] = h[7] + hash[7];
        }

        //�������յĹ�ϣֵ
        vector<unsigned int>hash;
        for (int i = 0; i < 8; i++) {
            hash.emplace_back(h[i]);
        }
        return hash;
    }
};
int main() {
    //�������
    while (1) {

        //����ԭ��
        string msg = "";
        char op = 'n';
        cout << "����ԭ�ģ�" << endl;
        getline(cin, msg);

        //�û����»س�ǰδ���������ַ��������������������ַ���������ַ��ǻس����˳�����
        if (msg == "") {
            cout << "������ַ�����y-ȷ�� n-�������� q-�˳�" << endl;
        }
        //�û����»س�ǰ�����������ַ���������������������롢������ַ��ǻس�
        else {
            cout << "�������룿y-ȷ�� n-��������" << endl;
        }

        //�����û�ѡ��Ĳ���
        cin >> op;
        getchar();

        //ѡ��q���˳�ѭ������������
        if (op == 'q')
            break;

        //ѡ��n�������������
        if (op == 'n') {
            string str = "";

            //�û�δ����������ѭ������
            while (op != 'y') {

                //���벻��q��y��n֮һ������޷�������������
                if (op != 'n') {
                    cout << "�Ƿ����룡�������" << endl;
                    return 0;
                }

                //���û�������������ݸ�����ԭ��ĩβ
                msg.append(str);

                //���û�����Ļس��ַ�������ԭ��ĩβ��getline�����س��������������س��������Ҫ�������ӣ�
                msg += '\n';

                cout << "��������ԭ�ģ�" << endl;
                getline(cin, str);

                //�û����»س���������������������롢������ַ��ǻس�
                cout << "�������룿y-ȷ�� n-��������" << endl;
                cin >> op;
                getchar();
            }
            msg.append(str);
        }
        //���벻��q��y��n֮һ������޷�������������
        else if (op != 'y') {
            cout << "�Ƿ����룡�������" << endl;
            return 0;
        }

        //����һ��SHA256ʵ��
        sha256 a(msg);

        //�ó����
        vector<unsigned int>hash = a.gethash();

        //������
        cout << "\n���ܺ�Ĺ�ϣֵ��" << endl;
        for (int i = 0; i < 8; i++) {
            printf("%08x", hash[i]);
        }
        cout << '\n' << endl;
    }
    

    cout << "�������" << endl;
    return 0;
}
