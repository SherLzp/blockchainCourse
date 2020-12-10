#include <iostream>
#include <string>

#include "SHA256.h"

int main()
{
    std::string text;
    std::cout << "Text: ";
    std::cin >> text;
    SHA256 sha256(text);
    std::string res_hash = sha256.hash();
    std::cout << res_hash << std::endl;

    return 0;
}