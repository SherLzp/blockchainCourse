# SHA256

### 文件结构

sha256.py为SHA256的实现源码。merkel.py和pow.py分别为区块数据锁定和PoW的测试代码，可以直接运行查看结果。

### 快速开始

将sha256.py放到项目目录中。以下为一个简单的样例：

```python
from sha256 import sha256

message = "abc"
print(sha256(message))
```

输出结果：

```python
ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
```

