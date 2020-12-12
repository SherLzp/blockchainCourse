#define _CRT_SECURE_NO_WARNINGS

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "sha256.h"

void test_1();
void test_2();
void test_3();
void test_4();
void test_5();

int main()
{
	test_5();

	return 0;
}

void test_1() 
{
	BYTE text[] = { "hello world!" };
	char result[65];

	sha256(text, result);
	printf("%s", result);
}

void test_2()
{
	char res[101][65];
	for (int i = 0; i < 100; i++) {
		char s[10];
		_itoa(i, s, 10);
		BYTE text[] = { i };
		char result[65];

		sha256(text, result);
		printf("%s\n", result);
		
		for (int j = 0; j < i; j++)
			if (strcmp(res[j], result) == 0) {
				printf("Have same hash!\n");
				return;
			}
				
		strcpy(res[i], result);
	}
	printf("Have no same hash!\n");
}

void test_3()
{
	char res[101][65];
	for (int i = 0; i < 100; i++) {
		BYTE text[] = { "hello" };
		char result[65];

		sha256(text, result);
		printf("%s\n", result);

		for (int j = 0; j < i; j++)
			if (strcmp(res[j], result) != 0) {
				printf("Have different hash!\n");
				return;
			}

		strcpy(res[i], result);
	}
	printf("Have all same hash!\n");
}

void test_4()
{
	BYTE text[] = { "hello world!" };
	char result[65];
	sha256(text, result);
	printf("sha256(hello world!) = %s\n", result);

	printf("sha256(%s) = ", result);
	BYTE text2[] = { result };
	sha256(text2, result);
	printf("%s\n", result);
}

void test_5()
{
	BYTE text[] = { "hello world!" };
	char result[65];
	sha256(text, result);
	printf("%s\n", result);

	char s[20];
	printf("input your value:");
	scanf("%s", s);
	BYTE text2[] = { s };
	char res[65];
	sha256(text2, res);
	if (strcmp(result, res) == 0)
		printf("same!\n");
	else
		printf("different!\n");
}