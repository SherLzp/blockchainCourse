// environment requirement:
//     32-bit, little-endien machine

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

typedef unsigned char        BYTE; // 8-bit
typedef unsigned int         WORD; // 32-bit
typedef unsigned long long  DWORD; // 64-bit

typedef struct {
	BYTE data[64];                 // block to process
	WORD state[8];                 // digest
	DWORD blen;                    // length of data in bit
	WORD dlen;                     // length of data in byte
} SHA256_CTX;

#define ROR(a,b) (((a) >> (b)) | ((a) << (32-(b))))

#define CH(x,y,z) (((x) & (y)) ^ (~(x) & (z)))
#define MAJ(x,y,z) (((x) & (y)) ^ ((x) & (z)) ^ ((y) & (z)))
#define EP0(x) (ROR(x,2) ^ ROR(x,13) ^ ROR(x,22))
#define EP1(x) (ROR(x,6) ^ ROR(x,11) ^ ROR(x,25))
#define SIG0(x) (ROR(x,7) ^ ROR(x,18) ^ ((x) >> 3))
#define SIG1(x) (ROR(x,17) ^ ROR(x,19) ^ ((x) >> 10))

const WORD k[64] = {
	0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
	0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
	0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
	0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
	0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
	0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
	0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
	0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
};

void sha256_process_block(SHA256_CTX *ctx) {
	WORD a, b, c, d, e, f, g, h, t1, t2, w[64];
	const BYTE *data = ctx->data;

	for (int i = 0, j = 0;i < 16;i++, j += 4)
		w[i] = (data[j] << 24) | (data[j + 1] << 16) | (data[j + 2] << 8) | (data[j + 3]);
	for (int i = 16;i < 64;i++)
		w[i] = SIG1(w[i - 2]) + w[i - 7] + SIG0(w[i - 15]) + w[i - 16];

	a = ctx->state[0];
	b = ctx->state[1];
	c = ctx->state[2];
	d = ctx->state[3];
	e = ctx->state[4];
	f = ctx->state[5];
	g = ctx->state[6];
	h = ctx->state[7];

	for (int i = 0;i < 64;i++) {
		t1 = h + EP1(e) + CH(e,f,g) + k[i] + w[i];
		t2 = EP0(a) + MAJ(a,b,c);
		h = g;
		g = f;
		f = e;
		e = d + t1;
		d = c;
		c = b;
		b = a;
		a = t1 + t2;
	}

	ctx->state[0] += a;
	ctx->state[1] += b;
	ctx->state[2] += c;
	ctx->state[3] += d;
	ctx->state[4] += e;
	ctx->state[5] += f;
	ctx->state[6] += g;
	ctx->state[7] += h;
}

const WORD initial_state[8] = {0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19};
void sha256_init(SHA256_CTX *ctx) {
	memcpy(ctx->state, initial_state, sizeof(initial_state));
	ctx->dlen = 0;
	ctx->blen = 0;
}

void sha256_update(SHA256_CTX *ctx, const BYTE data[], size_t len) {
	for (int i = 0;i < len;i++) {
		ctx->data[ctx->dlen++] = data[i];
		if (ctx->dlen == 64) {
			sha256_process_block(ctx);
			ctx->blen += 512;
			ctx->dlen = 0;
		}
	}
}

void sha256_final(SHA256_CTX *ctx) {
	int i = ctx->dlen;

	if (i < 56) {
		ctx->data[i++] = 0x80;
		while (i < 56)
			ctx->data[i++] = 0x00;
	}
	else {
		ctx->data[i++] = 0x80;
		while (i < 64)
			ctx->data[i++] = 0x00;
		sha256_process_block(ctx);
		memset(ctx->data, 0, 56);
	}

	// big-endien
	ctx->blen += ctx->dlen * 8;
	*(DWORD*)(ctx->data+56) = ctx->blen;
	BYTE _;
	_ = ctx->data[56]; ctx->data[56] = ctx->data[63]; ctx->data[63] = _;
	_ = ctx->data[57]; ctx->data[57] = ctx->data[62]; ctx->data[62] = _;
	_ = ctx->data[58]; ctx->data[58] = ctx->data[61]; ctx->data[61] = _;
	_ = ctx->data[59]; ctx->data[59] = ctx->data[60]; ctx->data[60] = _;

	sha256_process_block(ctx);
}

void sha256(BYTE* data, int len, BYTE* digest) {
	SHA256_CTX* ctx = (SHA256_CTX*)malloc(sizeof(SHA256_CTX));
	sha256_init(ctx);
	sha256_update(ctx, data, len);
	sha256_final(ctx);
	for(int i = 0;i < 8;i++)
		sprintf((char*)(digest+(i<<3)), "%08x", ctx->state[i]);
}

// 256-bit add
void add(char* x, char* y, char* z) {
	WORD carry = 0;
	char z_[10][10];
	for(int i = 7;i >= 0;i--) {
		WORD lft, rgt;
		sscanf(x+(i<<3), "%08x", &lft);
		sscanf(y+(i<<3), "%08x", &rgt);
		DWORD ans = lft + rgt + carry;
		carry = (ans >= 0x100000000LL ? 1 : 0);
		ans = ans & 0xffffffff;
		sprintf(z_[i], "%08x", ans);
	}
	for(int i = 0;i < 8;i++)
		memcpy(z+(i<<3), z_[i], 8);
}
void merkle_demo() {
	const char* A = "6c54014a99a1ab9a1ff14a9914a9930d94ab6c54014a99a1ab9a1ff14a9914a9930d94ab6c54014a99a1ab9a1ff14a9914a9930d94ab6c54014a99a1ab9a1ff14a9914a9930d94ab6c54014a99a1ab9a1ff14a9914a9930d94ab";
	const char* B = "c5ff55e68b5ff55e68b5ff55e68b5ff55e68b5ff55e68b5ff55e68b5ff55e68b5ff55e68b5ff55e68b5ff55e68";
	const char* C = "c9ada08a78f5e2a15b8f5e2a15bc9ada08a78f5e2a15b8f5e2a15bc9ada08a78f5e2a15b8f5e2a15bc9ada08a78f5e2a15b8f5e2a15b";
	char HA[100], HB[100], HC[100], HD[100], HAB[100], HCD[100], HABCD[100];
	sha256((BYTE*)A, strlen(A), (BYTE*)HA); sha256((BYTE*)HA, strlen(HA), (BYTE*)HA);
	sha256((BYTE*)B, strlen(B), (BYTE*)HB); sha256((BYTE*)HB, strlen(HB), (BYTE*)HB);
	sha256((BYTE*)C, strlen(C), (BYTE*)HC); sha256((BYTE*)HC, strlen(HC), (BYTE*)HC);
	sha256((BYTE*)C, strlen(C), (BYTE*)HD); sha256((BYTE*)HD, strlen(HD), (BYTE*)HD);
	printf("HA=%s\n", HA);
	printf("HB=%s\n", HB);
	printf("HC=%s\n", HC);
	printf("HD=%s\n", HD);
	printf("\n");

	add(HA, HB, HAB); sha256((BYTE*)HAB, strlen(HAB), (BYTE*)HAB); sha256((BYTE*)HAB, strlen(HAB), (BYTE*)HAB);
	add(HC, HD, HCD); sha256((BYTE*)HCD, strlen(HCD), (BYTE*)HCD); sha256((BYTE*)HCD, strlen(HCD), (BYTE*)HCD);
	printf("HAB=%s\n", HAB);
	printf("HCD=%s\n", HCD);
	printf("\n");

	add(HAB, HCD, HABCD); sha256((BYTE*)HABCD, strlen(HABCD), (BYTE*)HABCD); sha256((BYTE*)HABCD, strlen(HABCD), (BYTE*)HABCD);
	printf("HABCD=%s\n", HABCD);
}

struct DemoHeader {
	WORD a;
	WORD nonce;
};
typedef struct DemoHeader DemoHeader;
void pow_demo() {
	DemoHeader demoHeader = (DemoHeader){0xdeadbeef, 0};
	char digest[100];
	for(WORD nonce = 0;;nonce++) {
		demoHeader.nonce = nonce;
		sha256((BYTE*)&demoHeader, sizeof(DemoHeader), (BYTE*)digest);
		printf("sha256(%08x%08x)=%s\n", demoHeader.a, demoHeader.nonce, digest);
		if(digest[0] == '0') {
			printf("[!]nonce=%08x\n", nonce);
			break;
		}
	}
}

int main() {
	const char* test_string[] = {
		"8",
		"bb6638",
		"0630d94f9",
		"2fc6cc2f22fc2",
		"3a911f40d3a911f",
		"b5ff55e68b5ff55e68",
		"8f5e2a15bv8f5e2a15bs",
		"c9ada08a78f5e2a15b8f5e2a15b",
		"6f29de1fe8f5e2a15b8f5e2a15b12",
		"9ab7ab9a18f5e2a15bab9a18fab9a18f",
		"83ce97c8cab9a1ab9a1ab9a1ff55eff55e",
		"6c54014a99a1ab9a1ff14a9914a9930d94ab",
	};
	char digest[100];
	for(int i = 0;i < 12;i++) {
		sha256((BYTE*)test_string[i], strlen(test_string[i]), (BYTE*)digest);
		printf("sha256(%36s)=%s\n", test_string[i], digest);
	}

	// merkle_demo();
	// pow_demo();
	return 0;
}