#include <iostream>
#include <fstream>

#include "sha256.h"

using namespace std;

int main(){
    while(1){
        string str, choice = "1";
        cout << "*****************************************************SHA256*****************************************************" << endl;
        cout << "Enter 1 to get the string from the command line. " << endl; 
        cout << "Enter 2 to get the string from a file. Enter 3 to exit." << endl;
        cout << "Please input your choice (1 or 2 or 3): " << endl;
        getline(cin, choice);       // Input the choice.
        if(choice == "1"){          // get the string from the command line.
            cout << "Please input the string to be encrypted with sha256:" << endl;
            getline(cin, str);
        }
        else if(choice == "2"){     // get the string from a file.
            string fileName, buf;
            cout << "Please input the file name:" << endl;
            getline(cin, fileName);
            ifstream ifs;
            ifs.open(fileName.c_str(), ios::in);
            if(!ifs.is_open()) {
                cout << "Cannot open the file!!!" << endl << endl;
                continue;
            }
            while(getline(ifs,buf)) 
                str += buf;
            ifs.close();
        }
        else    break;
        Sha256 shaEncode = Sha256(str); 
        cout << "The hash value obtained by sha256 is:" << endl; 
        shaEncode.getHash();    // Calculate the hash code.
        cout << endl;
    }
    return 0;
}
