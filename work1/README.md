# 作业1: SHA256

## SHA256 的实现

### 文件目录

|——SHA256.h
|——SHA256.cpp
|——main.cpp
|——PoW_demo.cpp
|——CmakeLists.txt

### 构建和运行方法

```zsh
mkdir build
cd build
cmake ..
make
./SHA256
```

### 测试

- Case 1: a

```zsh
$ ./SHA256
Text: a
ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb
```

- Case 2: abc

```zsh
$ ./SHA256.exe
Text: abc
ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
```

- Case 3: abcdefg123456

```zsh
$ ./SHA256.exe
Text: abcdefg123456
6e8dd5d63a6fbf83d4b58724e63169873f042b239946db3d2685bdf764f9bf8e
```

# SHA256 的作用

- 构建Merkle树

对每笔交易进行两次sha256. 当N个数据元素经过加密后插入Merkle树时，至多计算log2(N)次就能检查出任意某数据元素是否在该树中，非常高效

- 用于区块数据锁定

每个区块头记录上一个区块的 Hash 值，使得区块链无法被修改。

- 挖矿过程中的工作量证明（PoW）

例如：任务：找出一个数字字符串，他的 SHA256 值的前 5 位是`"ad573"`

```
$ ./PoW_demo
100
```
