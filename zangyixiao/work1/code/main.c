#include "sha256.h"
 
int main(int argc, char* argv[])
{
    uint8_t* string = NULL;	//Used to receive input data
    uint32_t len = 0;		//Used to record data length
    uint32_t sha[8];		//Used to store converted data
 
    if (argc == 1) 
    {
        printf("Please input data😅️\n");
        return 0;
    }
 
    string = (uint8_t*)argv[1];
    len = strlen(argv[1]);
    printf("len = %d\n", len);
    printf("string = %s\n", argv[1]);
 
    //SHA256 hash conversion
    sha256(string, len, sha);
    
    //Output converted data
    printf("SHA256 hash conversion success😎️\nvalue of sha256 = ");
    for (int i=0; i<8; i++)
        printf("%08x", sha[i]);
    printf("\n");
 
    return 0;
}
