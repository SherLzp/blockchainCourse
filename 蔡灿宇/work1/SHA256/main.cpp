#include"SHA256.h"


void home();
void batch();
void input();

int main()
{
	home();

	return 0;
}

void home()
{
	cout << "===============================================================================" << endl;
	cout << "                                                                               " << endl;
	cout << "                           欢迎来到SHA256算法实现!                             " << endl;
	cout << "                                                                               " << endl;
	cout << "       [1] 自动批处理                                  [2] 手动输入            " << endl;
	cout << "       [3] 回到首页                                    [0] 退出                " << endl;
	cout << "                                                                               " << endl;
	cout << "===============================================================================" << endl;
	int choice;
	cout << "请输入选项：";
	cin >> choice;
	while (choice != 1 && choice != 2 && choice != 3 && choice != 0)
	{
		cout << "无效选项，请重新输入选项：";
		cin >> choice;
	}
	switch (choice)
	{
	case 1:
		batch();
		break;
	case 2:
		input();
		break;
	case 3:
		home();
		break;
	case 0:
		exit(0);
		break;
	default:;
	}
}

void batch()
{
	string input;
	string output;
	int number = 1;
	while (number < 100)
	{
		input = "I am 3180101972 Llux NO." + to_string(number);
		output = Convert(input);
		cout << input << " ==> " << output << endl;
		number++;
	}
	system("pause");
	home();
}

void input()
{
	cout << "--------------------注意：若输入return，则退出手动输入！-----------------------" << endl;
	string input;
	cin.ignore();
	getline(cin, input);
	while (input != "return")
	{
		string output;
		output = Convert(input);
		cout << input << " ==> " << output << endl;
		getline(cin, input);
	}
	home();
}

