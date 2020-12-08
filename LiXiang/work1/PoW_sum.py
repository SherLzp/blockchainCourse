from sha256 import SHA256
def main():
    temp=0
    count=0
    while 1:
        temp=temp+1
        s="I am Satoshi Nakamoto"+str(temp)
        message = s.encode("utf8")
        result=SHA256(message).hex()
        print(s+"-------->"+result)
        if(result[0]=='0' and result[1]=='0'):            
            count+=1
        if (temp>=100000):
            print("Satisfied solution number: "+ str(count))
            break

if __name__ == "__main__":
    main()