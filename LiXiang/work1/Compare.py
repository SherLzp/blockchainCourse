#############
# 由于该实验是速度比较实验
# 个人通过py实现的SHA256算法存在待优化处
# 影响判断
# 因此采用hashlib中的SHA256实现速度判断
#############
from sha256 import SHA256
import hashlib
import time
def main():
    # x=""
    # y=""    
    x=hashlib.sha256()
    y=hashlib.sha256()
    with open('1.txt','r',encoding='utf-8') as f:
        temp1 = f.read()
    with open('2.txt','r',encoding='utf-8') as f:
        temp2 = f.read()
    # SHA256的比较
    print("reading done")
    start=time.time()
    # 这里是with语句的一个小bug,如果采用r的方式会报错
    # message = temp1.encode("utf8")
    # x=SHA256(message).hex()
    # message = temp2.encode("utf8")
    # y=SHA256(message).hex()
    x.update(temp1.encode('utf-8'))
    y.update(temp2.encode('utf-8'))
    if(x.hexdigest()==y.hexdigest()):
        print("相等")
    else:
        print("不等")
    end=time.time()
    print("SHA256耗时："+str(((end-start)*1000))+"ms")
    #采用传统方式判断
    start=time.time()
    flag=1
    for i in range(len(temp1)):
        if i>len(temp2) or temp1[i]!=temp2[i]:
            flag=0
    if(flag):
        print("相等")
    else:
        print("不等")
    end=time.time()
    print("传统方式比较耗时："+str(((end-start)*1000))+"ms")
if __name__ == "__main__":
    main()