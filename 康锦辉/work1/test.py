from mysha256 import my_sha256
import random
import string
import time

def test1():
    result = True
    for i in range(1000):
        s = bytes([random.randint(0, 0xff) for _ in range(random.randint(1, 1000))])
        if my_sha256(s) != my_sha256(s):
            result = False
    print(result) # True


def test2():
    print(time.process_time()) # 0.078125
    for i in range(10000):
        s = bytes([random.randint(0, 0xff) for _ in range(random.randint(1, 1000))])
        h = my_sha256(s)
    print(time.process_time()) # 32.03125

def test4():
    s = bytes([random.randint(0, 0xff) for _ in range(random.randint(1, 100))])
    old_h = my_sha256(s)
    diffs = []
    for i in range(len(s)):
        s = s[:i] + bytes(random.randint(0, 0xff)) + s[i+1:]
        h = my_sha256(s)
        diffs.append(sum([[0, 1][x!=y] for x, y in zip(h, old_h)]))
        old_h = h
    print(diffs)
    # [62, 59, 59, 59, 60, 62, 60, 55, 61, 62, 57, 63, 58, 57, 61, 59, 59, 59, 58, 62, 62, 61, 60, 59, 59, 62, 61, 55, 63]
    # [58, 54, 61, 63, 60, 60, 60, 62, 0, 57, 61, 60, 64, 63, 54, 60, 62, 60, 61, 57, 61, 59, 60, 63, 57, 60, 59, 61, 63, 60, 63, 61, 61, 59, 62, 57, 63]
    # [58, 61, 61, 60, 63, 58, 58, 57, 62, 59, 61, 61, 58, 61, 59, 60, 61, 62, 60, 63, 62, 59, 61, 57, 55, 62, 61, 60, 62, 60, 64, 60, 62, 56, 60, 61, 61, 61, 60, 59, 57, 57, 52, 62, 59]
        
def test5():
    hs = []
    ss = []
    collided = 0
    for _ in range(100000):
        s = bytes([random.randint(0, 0xff) for _ in range(random.randint(1, 1000))])
        if s in ss:
            continue
        ss.append(s)
        h = my_sha256(s)
        if h in hs:
            collided += 1
            print('collided!', collided)
            continue
        hs.append(h)
    if collided == 0:
        print('no collision')
# no collision

if __name__ == '__main__':
    print('testing 1 ...')
    test1()
    print('testing 2 ...')
    test2()
    print('testing 4 ...')
    test4()
    print('testing 5 ...')
    test5()