#include<iostream>
#include<string>

using namespace std;
int main() {
  string test = "test";
  test.push_back('\n');
  for (auto a: test) {
    cout << a << endl;
  }
}
