#include "SHA256.h"
#include <iostream>
#include <Windows.h>
#include <string>
#include <fstream>
#include <sstream>
#include <future>
#include <functional>
#include <chrono>

template <typename T>
std::string ConvertToString(T Number){
	std::ostringstream ss;
	ss << Number;
	return ss.str();
}
void clear() {
	COORD topLeft = { 0, 0 };
	HANDLE console = GetStdHandle(STD_OUTPUT_HANDLE);
	CONSOLE_SCREEN_BUFFER_INFO screen;
	DWORD written;

	GetConsoleScreenBufferInfo(console, &screen);
	FillConsoleOutputCharacterA(
		console, ' ', screen.dwSize.X * screen.dwSize.Y, topLeft, &written
	);
	FillConsoleOutputAttribute(
		console, FOREGROUND_GREEN | FOREGROUND_RED | FOREGROUND_BLUE,
		screen.dwSize.X * screen.dwSize.Y, topLeft, &written
	);
	SetConsoleCursorPosition(console, topLeft);
}

std::string coloredMSG(std::string MSG) { 
	std::this_thread::sleep_for(std::chrono::milliseconds(200));
	HANDLE hConsolec = GetStdHandle(STD_OUTPUT_HANDLE);

	std::cout << MSG << std::endl;
	return MSG;
}  

int main() {
	while (true) {
		auto WelcomeMSG = std::async(std::launch::async, coloredMSG,"Enter the string:");
		std::string input;
		std::cin >> input;
		std::cout << "The Hash Result: " << sha256(input);
		auto hash = ConvertToString(sha256(input));

		std::ofstream file;
		file.open("HashLog.txt", std::ios_base::app);
		file << "The string: " << input << '\n' << "The Result: " << hash << '\n';
		file.close();

		std::cout << std::endl;
		std::cout << std::endl;
		bool autoMSG = true;
		std::string responMSG;
		auto nextMSG = std::async(std::launch::async, coloredMSG, "Do it again? yes or no");
		std::cin >> responMSG;
	
		if (responMSG == "no")
			return 0;
		while (responMSG != "yes") {
			if (responMSG == "disable") {
				autoMSG = false;
				clear();
				break;
			}
			else {
				if (autoMSG == true) {
					std::cout << std::endl;
					auto resrepeatMSG = std::async(std::launch::async, coloredMSG, "Wrong Typing!");
					std::string repeatMSG;
					std::cin >> repeatMSG;
					if (repeatMSG == "yes" || repeatMSG == "no") {
						if (repeatMSG == "no")
							return 0;
						clear();
						break;
					}
				}
			}
			break;
		}
		clear();
	}
	system("pause");
	return 0;
}