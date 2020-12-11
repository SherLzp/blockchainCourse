#include<iostream>
#include"SHA256.h"
#include"stop_watch.h"
#include<fstream>
#include<iomanip>

using namespace std;

void basic_test();
void time_test();
void anti_modify_test();
void collide_test();
void char_counter();

int main()
{
    int mode = 0;
    cout << "Test mode:\n0.basic\n1.time\n2.anti-modify\n3.random collide\n";
    cin >> mode;
    switch (mode)
    {
    case 0:
        basic_test();
        break;
    case 1:
        time_test();
        break;
    case 2:
        anti_modify_test();
        char_counter();
        break;
    case 3:
        collide_test();
        break;
    default:
        cout << "Exit";
        return 0;
    }
    
}
void collide_test(){
    //cout << "Please type in the difficulty(1-32):";
    int bit_num;
    //cin >> bit_num;
    for (bit_num = 1; bit_num < 14; bit_num++) {
        for (int r = 1; r < 11; r++) {

            for (int j = 1; j < 1000000; j++) {
                std::ifstream is("rand.txt", std::ifstream::binary);
                if (is) {
                    // get length of file:
                    is.seekg(0, is.end);
                    int length = is.tellg();
                    is.seekg(0, is.beg);

                    int chunkNum = length * CHAR_BIT / CHUNK_LENGTH + 1;
                    int mod = (length * CHAR_BIT) % CHUNK_LENGTH;
                    if (mod >= 448)chunkNum++;

                    void* buffer = new char[chunkNum * CHUNK_LENGTH / CHAR_BIT];
                    memset(buffer, 0, chunkNum * CHUNK_LENGTH / CHAR_BIT);


                    //if (j % 1000 == 0)std::cout <<dec<< "Reading " << length << " characters...";
                    is.read((char*)buffer, length);
                    // ...buffer contains the entire file...
                    SHA256 Encoder;
                    Encoder.encryptMessage(buffer, is.gcount());
                    is.close();
                    std::ofstream _table(to_string(bit_num) + "bit.txt", ios::binary | ios::app );
                    std::ofstream outfile("rand.txt", ios::binary /*| ios::app*/);
                    //125 chars = 1000bits
                    //if(j%1000 == 0)cout <<dec<< j << "\t";
                    int flag = 0;
                    for (int i = 0; i < 8; i++) {
                        if (SHR(Encoder.H[0], 32-bit_num) == 0) {
                            flag = 1;
                        }
                        outfile <<setw(8)<<setfill('0')<< hex << Encoder.H[i];
                        //if(j%1000 == 0)cout <<setw(8)<<setfill('0')<<hex << Encoder.H[i];
                    }
                    if (flag) {
                        cout <<endl<< bit_num << ": " << dec << j ;
                        _table << dec << j << endl;
                        outfile.close();
                        _table.close();
                        delete[]buffer;
                        goto START;
                    }
                    //if (j % 1000 == 0) cout << endl;
                    outfile.close();
                    _table.close();
                    delete[] buffer;
                }
        
            }
        START:cout << "\n"; continue;
        }

    }

    return;	
}

void basic_test() {
    std::ifstream is("basic.txt", std::ifstream::binary);
    if (is) {
        // get length of file:
        is.seekg(0, is.end);
        int length = is.tellg();
        is.seekg(0, is.beg);

        int chunkNum = length * CHAR_BIT / CHUNK_LENGTH + 1;
        int mod = (length * CHAR_BIT) % CHUNK_LENGTH;
        if (mod >= 448)chunkNum++;
        void* buffer = new char[chunkNum * CHUNK_LENGTH / CHAR_BIT];
        memset(buffer, 0, chunkNum * CHUNK_LENGTH / CHAR_BIT);
        // read data as a block:
        is.read((char*)buffer, length);
        is.close();
        cout << "\nread in: "<<(char*)buffer;
        // ...buffer contains the entire file...

        SHA256 Encoder;
        Encoder.encryptMessage(buffer, is.gcount());

        std::ofstream os("basic.txt", ios::binary | ios::app);
        os << "\nresult:";
        for(int i =0 ;i<8;i++) os << setw(8)<<setfill('0')<<hex<<Encoder.H[i];
        os.close();

        cout << "\nresult:";
        for (int i = 0; i < 8; i++) {
            cout <<setw(8)<<setfill('0')<<hex<< Encoder.H[i];
        }
        delete[] buffer;

    }
}

void time_test() {
    std::ofstream os("time_test.txt", ios::binary);
    os << "d37429a2c1e2462f38ddbd5d130d97e875d790105b20fb413990865f8ef4e979d37429a2c1e2462f38ddbd5d130d97e875d790105b20fb413990865f8ef4e979";
    os.close();
    for (int i = 0; i < 1000; i++) {
        std::ifstream is("time_test.txt", std::ifstream::binary);
        if (is) {
            // get length of file:
            is.seekg(0, is.end);
            int length = is.tellg();
            is.seekg(0, is.beg);

            int chunkNum = length * CHAR_BIT / CHUNK_LENGTH + 1;
            int mod = (length * CHAR_BIT) % CHUNK_LENGTH;
            if (mod >= 448)chunkNum++;
            void* buffer = new char[chunkNum * CHUNK_LENGTH / CHAR_BIT];
            memset(buffer, 0, chunkNum * CHUNK_LENGTH / CHAR_BIT);
            // read data as a block:
            is.read((char*)buffer, length);
            is.close();
            // ...buffer contains the entire file...

            SHA256 Encoder;
            stop_watch clk;

            clk.start();// time
            Encoder.encryptMessage(buffer, is.gcount());
            clk.stop();
            /*if(i%50 == 0)*/ cout << "\n"<< is.gcount()<<"\t" << clk.elapsed();//ns
            std::ofstream os("time_test.txt", ios::binary | ios::app);
            os << "d37429a2c1e2462f38ddbd5d130d97e875d790105b20fb413990865f8ef4e979d37429a2c1e2462f38ddbd5d130d97e875d790105b20fb413990865f8ef4e979";
            os.close();

        }
    }
    os.open("time_test.txt", ios::binary);
    os << "Done";
    os.close();

}

void char_counter() {
    std::ifstream is("x1-bit chg.txt", ios::binary);
    string str;
    int n;
    int ch[256][64] = {0};
    int bit_num = 6;
    cout << "\nPlease type in the number of chars you would like to count: (1-64)";
    cin >> bit_num;
    for (int i = 0; i < 10000; i++) {

        is >> n;
        is >> str;
        for (int j = 0; j < bit_num; j++) {
            ch[str[j]][j]++;
         }
        //cout << str<<endl;
        //cout <<ch[str[0]]++<<endl;
    }
    is.close();
    for (int j = 0; j < bit_num; j++) {
        cout << j + 1<< "bit:\n";
        for (int i = 0; i < 256; i++) {
            if (ch[i][j]) {
                cout << hex << (char)i;
                cout << '\t' << dec << ch[i][j] << endl;
            }
        }
        cout << endl;
    }
    return;
}

// 
void anti_modify_test()
{
    std::ofstream outfile("x1-bit chg.txt", ios::binary);
    void* buffer = new char[20001];
    char* chptr = (char*)buffer;
    memset(buffer, 'a',20001);
    for (int j = 0; j < 10000; j++) {
            *(chptr + j) += 1;
            //cout << str;
            SHA256 Encoder;
            Encoder.encryptMessage(buffer, 10000);
            outfile << to_string(j)<<"\t";
            for (int i = 0; i < 8; i++) outfile <<setw(8)<<setfill('0')<< hex << Encoder.H[i];
            outfile << endl;
            if (j % 3000 == 0)cout << ".";

        //}
    }
    delete[] buffer;
    cout << "done\n";
    outfile.close();

    return;
}

