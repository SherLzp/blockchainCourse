from sha256 import sha256

m = 'I am Satoshi Nakamoto'
start = ''
for n in range(6):
    count = 0
    while True:
        if sha256(m + str(count)).startswith(start):
            break
        count += 1
    print("SHA256(" + m + str(count) + "): " + sha256(m + str(count)))
    start += '0'
