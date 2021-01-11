# ZJU Blockchain Course		Homework 1

## SHA256 Algorithm

### Project Background

In the course *Blockchain*, we are asked to write a program that implements SHA256 encryption algorithm.

### Functionality

In this program, it can generate a 64-character-long SHA256 encrypted string according to your input.

### Development & Running Environment

#### Development Environment

- Windows 10 Pro
- GCC

#### Running Environment

- Use GCC command to generate executable file: ```gcc Main.cpp -o Main```
- Or use an IDE to compile and run the source code

### Test Demo

- For a simple input:

  The input is "abc"

  ![](https://github.com/ZJUslm/blockchainCourse/blob/3180103654/Leming%20Shen/work1/assets/1.bmp)

- For a string whose length is larger than 64 (512 bits):

  The input is "algnaposdghaiswaeo7593q0684726qao;lihg1684968$^&*(&&^bmnjhmkasdgmjl;p"

  ![](https://github.com/ZJUslm/blockchainCourse/blob/3180103654/Leming%20Shen/work1/assets/2.bmp)

### Correctness

- To check the correctness of my program, you can compare the output with a website:

  <iframe src="http://www.jsons.cn/sha/" width="100%" height="500"></iframe>

- I generate 1000 random strings whose length range from 1 to 20000, and the result is in "output.txt"

### About the Author

Leming Shen, majored in Software Engineering, College of Computer Science and Technology, Zhejiang University.

Student Number: 3180103654
