// 找到一个数字字符串，其前5位为"ad573"

#include <iostream>
#include <string>

#include "SHA256.h"

constexpr int max_num = 100000;

int main()
{
    std::string text;

    for(int i = 0; i < max_num; ++i)
    {
        SHA256 temp(text + std::to_string(i));
        if(temp.hash().substr(0, 5) == "ad573")
        {
            std::cout << i << std::endl;
            break;
        }
    }

    return 0;
}