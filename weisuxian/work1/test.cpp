#include <iostream>
#include <string>
#include "SHA256.h"

int main()
{
	std::string message = "3180102081weisuxian"; 
	SHA::Sha256 sha256; 
	std::string message_digest = sha256.getHexMessageDigest(message); 
	std::cout << message_digest << std::endl;
	getchar();
	return 0;
}
