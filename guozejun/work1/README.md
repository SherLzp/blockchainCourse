# homework1

> 郭泽均

## 运行方法

- 在机器上安装[lua](https://www.lua.org/)环境

- 自定义测试

  - Quick Start用例

  ```lua
  local sha = require("homework1")
  local foo = sha.sha256("test example")
  print(foo)
  -- output: fcacc4c6fc78a8a1429ed41c59bbca3b1052eeb3f9323725ce198d1ea8c32e06
  ```

- 默认测试用例

  `code`目录下运行`lua test.lua`
