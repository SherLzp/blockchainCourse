from sha256 import hash
from merkel import MerkelTree
import random
import time

# Part One

def randomString(len):
    len = len or 32
    ret = ''.join(random.choice('ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678') for _ in range(len))
    return ret

def testOne():
    print("实验1：")
    str1 = randomString(128)
    str2 = chr(ord(str1[0]) + 1) + str1[1:]
    print("Input1: " + str1)
    print("Input2: " + str2)
    print("Output1: " + hash(str1))
    print("Output2: " + hash(str2))


# Part Two

def testTwo(initStr, maxDiff):
    print("\n实验2: ")
    _str = ""
    difficulty = 1
    while difficulty <= maxDiff:
        starttime = time.time()
        i = 0
        while True:
            flag = False
            _str = initStr + str(i)
            result = hash(_str)
            for j in range(difficulty):
                if result[j] != '0':
                    flag = True
                    break
            if flag == False:
                print(result)
                endtime = time.time()
                print(round((endtime - starttime) * 1000))
                break
            i += 1

        difficulty += 1


# Part Three

def testThree():
    print("\n实验3:")

    MT1 = MerkelTree(['1', '2', '3', '4'])
    MT2 = MerkelTree(['2', '2', '3', '4'])
    #MT1.traverse() 会返回所有节点的hash值
    print("MT1 Root: " + MT1.root.hash)
    print("MT2 Root: " + MT2.root.hash)

    print()

    print("MT1 Fa1: " + MT1.root.child1.hash)
    print("MT2 Fa1: " + MT2.root.child1.hash)

    print()

    print("MT1 Leaf1: " + MT1.root.child1.child1.hash)
    print("MT2 Leaf1: " + MT2.root.child1.child1.hash)






# testOne()

# testTwo("I am XXX", 5)

testThree()