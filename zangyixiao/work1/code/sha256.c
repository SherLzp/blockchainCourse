#include "sha256.h"

#if TAG 
//Show intermediate process information
static void show_table(const uint8_t *data, int size)
{
    int dig = 32;
 
    if (data[0] == 0x21)
    	return;
    
    for(int i=0; i<size; i++) 
    {
        if((i % dig) == 0) 
            printf( "[%02x] ", i/dig );
        printf( "%02x", data[i] );
        
        if(((i+1) % dig) == 0)
            printf( "\n" );
    }
 
    printf("\n");
    return;
}
#else
#define show_table(a, b) 
#endif
 
static void transform(const uint8_t *msg, uint32_t *h)
{
    uint32_t w[64];
    uint32_t a0, b1, c2, d3, e4, f5, g6, h7;
    uint32_t t1, t2;
 
    int i = 0;
    int j = 0;
 
    //Extend the sixteen 32-bit words into sixty-four 32-bit words:
    for (i=0; i<16; i++) 
    {
        w[i] = msg[j]<<24 | msg[j+1]<<16 | msg[j+2]<<8 | msg[j+3];
        j += 4;
    }
    
    //Construct 64 words
    for(i=16; i<64; i++)
        w[i] = SSigma1(w[i-2]) + w[i-7] + SSigma0(w[i-15]) + w[i-16];
    
    show_table((uint8_t*)w, 64*4);
 
    //Initialize hash value for this chunk
    a0 = h[0];
    b1 = h[1];
    c2 = h[2];
    d3 = h[3];
    e4 = h[4];
    f5 = h[5];
    g6 = h[6];
    h7 = h[7];
    
    //Perform 64 cycles
    for (i= 0; i<64; i++) 
    {
        t1 = h7 + BSigma1(e4) + CHX(e4, f5, g6) + cst[i] + w[i];
        t2 = BSigma0(a0) + MAJ(a0, b1, c2);
 
        h7 = g6;
        g6 = f5;
        f5 = e4;
        e4 = d3 + t1;
        d3 = c2;
        c2 = b1;
        b1 = a0;
        a0 = t1 + t2;
    }
    
    //Add this chunk's hash to result so far
    h[0] += a0;
    h[1] += b1;
    h[2] += c2;
    h[3] += d3;
    h[4] += e4;
    h[5] += f5;
    h[6] += g6;
    h[7] += h7;
 
    return;
}
 
void sha256(const uint8_t *string, uint32_t len, uint32_t *hash)
{
    uint8_t *tmp = (uint8_t*)string;
    uint8_t  content[SHA256_COVER_SIZE];
    uint32_t size = 0;
    
    uint32_t i = 0;
    uint32_t n = 0;
    uint32_t m = 0;
    uint32_t h[8];
 
    //Initialize variables
    h[0] = 0x6a09e667;
    h[1] = 0xbb67ae85;
    h[2] = 0x3c6ef372;
    h[3] = 0xa54ff53a;
    h[4] = 0x510e527f;
    h[5] = 0x9b05688c;
    h[6] = 0x1f83d9ab;
    h[7] = 0x5be0cd19;
 
    memset(content, 0x00, sizeof(uint8_t)*SHA256_COVER_SIZE);
 
    n = len / SHA256_BLOCK_SIZE;
    m = len % SHA256_BLOCK_SIZE;
 
    if (m*8 < 448 )
        size = SHA256_BLOCK_SIZE;
    else
        size = SHA256_BLOCK_SIZE*2;
        
    //Pre-processing
    if (m != 0)
        memcpy(content, tmp + (n * SHA256_BLOCK_SIZE), m);
    content[m] = 0x80;	//append the bit '1' to the message
    //append k bits '0', where k is the minimum number >= 0 such that the resulting message
    content[size-4]  = ((len*8)&0xff000000) >> 24;
    content[size-3]  = ((len*8)&0x00ff0000) >> 16;
    content[size-2]  = ((len*8)&0x0000ff00) >> 8;
    content[size-1]  = ((len*8)&0x000000ff);
 
    show_table(tmp, len-m);
    show_table(content, size);
 
    //Process the message in successive 512-bit chunks:
    for (i=0; i<n; i++) 
    {
        transform(tmp, h);
        tmp += SHA256_BLOCK_SIZE;
    }
 
    tmp = content;
    n = size / SHA256_BLOCK_SIZE;
    for (i=0; i<n; i++) 
    {
        transform(tmp, h);
        tmp += SHA256_BLOCK_SIZE;
    }
    
    //Produce the final hash value (big-endian)
    if (hash != NULL)
        memcpy(hash, h, sizeof(uint32_t)*8);
        
    return;
}
