#include "SHA256.h"
#include <stdio.h>
#include <string>
#include <iostream>

int pow(unsigned int* vector)
{
	int count = 0;
	unsigned int temp;
	for (int i = 0; i <= 7; i++)
	{
		temp = 0x80000000;
		for (int j = 0; j <= 31; j++, temp>>=1)
		{
			if ((temp & vector[i]) == 0) count++;
			else return count;
		}
	}
	return count;
}

int main()
{
	unsigned char msg[16] = "abcdefg1234567";
	unsigned int length = 14;
	unsigned int vector[8];
	SHA256(msg, length, vector);
	printf("SHA256-Result: ");
	for (int i = 0; i <= 7; i++)
	{
		printf("%X", vector[i]);
	}
	printf("\n");

	char powmsg[40];

	std::string prefix = "I am Satoshi Nakamoto";
	unsigned int difficulty = 15;
	for (int i = 0;; i++) {
		std::string now = prefix + std::to_string(i);
		std::cout << now <<" : ";
		strcpy_s(powmsg, now.c_str());
		SHA256((unsigned char*)powmsg, now.length(), vector);
		for (int j = 0; j <= 7; j++) printf("%X", vector[j]);
		printf(" %u\n", pow(vector));
		if (pow(vector) >= difficulty) break;
	}

	return 0;
}