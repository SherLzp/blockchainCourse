如何运行：

①安装配置nodejs、npm、yarn、truffle、ganache

②浏览器安装MetaMask插件（个人使用的是firefox浏览器，用Chrome应该也能装）

③打开ganache，选择quickstart。点击右上角齿轮进入设置页面，在workspace中add project，选中truffle文件夹中的truffle-config.js。然后点击右上角“SAVE AND RESTART”

④用vscode打开antd/src/api中的contact.ts文件，把第七行中的地址替换成ganache中合约的地址

const contract = new web3.eth.Contract(CrowdFunding.abi, '0xda648db68Db1F0bdCeC53d89B4AE318D8aef2F25');

⑤打开命令行界面，进入finalwork文件夹，输入truffle compile，接着输入truffle migrate

⑥在antd文件夹下输入yarn，安装完成后输入yarn serve。

⑦浏览器访问本地端口，通过metamask连接本地网络，即可使用。
 界面截图：

![img](file:///C:/Users/orgas/AppData/Local/Temp/msohtmlclip1/01/clip_image002.jpg)