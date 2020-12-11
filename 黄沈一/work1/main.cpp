#include<iostream>
#include<vector>
#include<string>
#include<cstring>
#include<bitset>
#include<sstream>
#include<iomanip>
using namespace std;


//constants
unsigned long h0 = 0x6a09e667;
unsigned long h1 = 0xbb67ae85;
unsigned long h2 = 0x3c6ef372;
unsigned long h3 = 0xa54ff53a;
unsigned long h4 = 0x510e527f;
unsigned long h5 = 0x9b05688c;
unsigned long h6 = 0x1f83d9ab;
unsigned long h7 = 0x5be0cd19;
unsigned long mod = 0xFFFFFFFF;

// override the '+'
unsigned long Plus(vector<unsigned long> input) {
  unsigned long res = 0;
  for (auto i: input) {
    res += i;
    res &= mod;
  }
  return res;
}

vector<unsigned long> k =\
    {0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,\
		0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,\
		0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,\
		0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,\
		0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,\
		0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,\
		0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,\
		0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2};

// convert the insigned long to a string of 4 chars
string convert_to_string(unsigned long h) {
  bitset<32> bs(h);
  unsigned n = bs.to_ulong();
	stringstream sstream;
	sstream << hex << setw(8) << setfill('0') << n;
	string temp;
	sstream >> temp;
  return temp;
}


// convert the alphas into binaries
vector<unsigned long> convert_to_binary(const string s) {
    vector<unsigned long> res;
    long size = s.size();
    for(long i = 0; i < size; i++) {
      bitset<8> b(s.c_str()[i]);
      res.push_back(b.to_ulong());
    }
    return res;
}

vector<unsigned long> padding(vector<unsigned long> raw) {
  unsigned long long l = raw.size();
  l *= 8;
  raw.push_back((unsigned long)(128));
  long size = raw.size();
  size *= 8;
  while((size)%512!=448) {
    raw.push_back((unsigned long)(0));
    size += 8;
  }
  bitset<64> b(l);
  string string_64 = b.to_string();
  for(int i = 0; i < 63; i+=8) {
    bitset<8> temp(string_64.substr(i, i+7));
    raw.push_back(temp.to_ulong());
  }
  return raw;
}

// break the 512-bit block into 16 32-bit blocks and compute the rest blocks
vector<unsigned long> resizing(vector<unsigned long> block) {
  // w[0-16]
  vector<unsigned long> output(16);
  for(int i = 0; i < 64; i = i + 4)
	{
		bitset<32> temp(0);
		temp = (unsigned long) block[i] << 24;
		temp |= (unsigned long) block[i + 1] << 16;
    temp |= (unsigned long) block[i + 2] << 8;
		temp |= (unsigned long) block[i + 3];
		output[i/4] = temp.to_ulong();
	}
  return output;
}

//right rotate
inline unsigned long rightRotate(unsigned long num, int bits) {
  return ((num)>>(bits)) | ((num)<<(32-bits)) & mod;
}

//right shift
inline unsigned long rightShift(unsigned long num, int bits) {
  return (num) >> (bits) & mod;
}

// compute the rest of the w
void computeRestW(vector<unsigned long>& w) {
  unsigned long s0;
  unsigned long s1;
  for (int i = 16; i < 64; i++) {
    s0 = rightRotate(w[i-15], 7) ^ (rightRotate(w[i-15], 18)) ^ (rightShift(w[i-15], 3));
    s0 &= mod;
    s1 = rightRotate(w[i-2], 17) ^ (rightRotate(w[i-2], 19)) ^ (rightShift(w[i-2], 10));
    s1 &= mod;
    w.push_back((w[i-16]+s0+w[i-7]+s1)&(mod));
  }
  return;
}

// hash part
void Hash(vector<unsigned long> w) {
  int times = w.size() / 64;
  //initialization
  unsigned long a = h0;
  unsigned long b = h1;
  unsigned long c = h2;
  unsigned long d = h3;
  unsigned long e = h4;
  unsigned long f = h5;
  unsigned long g = h6;
  unsigned long h = h7;

  // some useful variables
  unsigned long s1;
  unsigned long ch;
  unsigned long temp1;
  unsigned long s0;
  unsigned long maj;
  unsigned long temp2;

  for (int i = 0; i < 64; i++) {
    // computation
    s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25) & mod;
    ch = (e & f) ^ ((~e) & g) & mod;
    temp1 = h + s1 + ch + k[i] + w[i] & mod;
    s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22) & mod;
    maj = (a & b) ^ (a & c) ^ (b & c) & mod;
    temp2 = s0 + maj & mod;
  
  
    // update the parameters
    h = g;
    g = f;
    f = e;
    e = Plus({d, temp1});
    d = c;
    c = b;
    b = a;
    a = Plus({temp1, temp2});
  }
  // add the computed chunk to the current hash value
  h0 = Plus({h0, a});
  h1 = Plus({h1, b});
  h2 = Plus({h2, c});
  h3 = Plus({h3, d});
  h4 = Plus({h4, e});
  h5 = Plus({h5, f});
  h6 = Plus({h6, g});
  h7 = Plus({h7, h});
  
  

}

string Print() {
  // to the final convertion work here
  string res;
  // do your final things here
  res = convert_to_string(h0) + convert_to_string(h1) + \
        convert_to_string(h2) + convert_to_string(h3) + \
        convert_to_string(h4) + convert_to_string(h5) + \
        convert_to_string(h6) + convert_to_string(h7);
  return res;

}

int main() {
  string message;
  string m;
  cout << "plz enter the message to encypt:" << endl;


  while(getline(cin, m)) {
    string letter;
    cout << "Enter q to quit, else to continue:" << endl;
    cin >> letter;
    getchar();
    message += m;
    if (letter=="q") {
      break;
    } else {
      message += '\n';
    }
  }



  vector<unsigned long> test, t, temp;
  test = convert_to_binary(message);
  t = padding(test);
  int size = t.size();

  for (int i = 0; i < size/64; i++) {
    vector<unsigned long> tt(t.begin()+i*64, t.begin()+(i+1)*64);
    temp = resizing(tt);
    computeRestW(temp);
    Hash(temp);
  }
  cout << Print() << endl;
}
