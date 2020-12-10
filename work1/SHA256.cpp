#include <sstream>
#include <iomanip>

#include "SHA256.h"

constexpr uint32_t SHA256::const_k[64];
constexpr uint32_t SHA256::hash_init[8];

SHA256::SHA256(std::string t) : text(t)
{
    length = t.size();
    block_num = (length + 8) / 64 + 1;
    for(int i = 0; i < 8; ++i)
    {
        h_values[i] = hash_init[i];
    }
}

std::string SHA256::hash()
{
    uint8_t hash[32];
    for(int i = 0; i < text.size(); ++i)
    {
        data[i] = text[i];
    }
    pad();
    calculate();

    for (uint8_t i = 0 ; i < 4 ; i++) 
    {
		for(uint8_t j = 0 ; j < 8 ; j++) 
        {
			hash[i + (j * 4)] = (h_values[j] >> (24 - i * 8)) & 0x000000ff;
		}
	}

    std::stringstream s;
	s << std::setfill('0') << std::hex;

	for(uint8_t i = 0 ; i < 32 ; i++) {
		s << std::setw(2) << (unsigned int) hash[i];
	}

	return s.str();
}

void SHA256::pad()
{
    unsigned char pad_bits = (64 + 56 - length % 64) % 64;
    data[length] = 0x80;
    int pos;
    for(pos = length + 1; pos < length + 1 + (pad_bits + 63) % 64; ++pos)
    {
        data[pos] = 0x00;
    }
    uint64_t length_bits = length * 8;
    for(int i = 7; i >= 0; --i)
    {
        data[pos++] = length_bits >> (i * 8);
    }
}

void SHA256::calculate()
{
    uint32_t tmp_data[64];
    uint32_t tmp_hash[8];
    uint32_t maj, S0, ch, S1, temp1;

    for(int i = 0; i < block_num; ++i)
    {
        for (uint8_t i = 0, j = 0; i < 16; i++, j += 4) 
        {
            tmp_data[i] = (data[j] << 24) | (data[j + 1] << 16) | (data[j + 2] << 8) | (data[j + 3]);
        }

        for (uint8_t k = 16 ; k < 64; k++) 
        {
            tmp_data[k] = SHA256::sigma1(tmp_data[k - 2]) + tmp_data[k - 7] + SHA256::sigma0(tmp_data[k - 15]) + tmp_data[k - 16];
        }

        for(uint8_t i = 0 ; i < 8 ; i++)
        { 
            tmp_hash[i] = h_values[i];  
        }

        for (uint8_t i = 0; i < 64; i++)
        {
            maj = SHA256::majority(tmp_hash[0], tmp_hash[1], tmp_hash[2]);
            S0 = SHA256::rotate(tmp_hash[0], 2) ^ SHA256::rotate(tmp_hash[0], 13) ^ SHA256::rotate(tmp_hash[0], 22);
            ch = choose(tmp_hash[4], tmp_hash[5], tmp_hash[6]);
            S1 = SHA256::rotate(tmp_hash[4], 6) ^ SHA256::rotate(tmp_hash[4], 11) ^ SHA256::rotate(tmp_hash[4], 25);
            temp1 = tmp_data[i] + const_k[i] + tmp_hash[7] + ch + S1;

            tmp_hash[7] = tmp_hash[6];
            tmp_hash[6] = tmp_hash[5];
            tmp_hash[5] = tmp_hash[4];
            tmp_hash[4] = tmp_hash[3] + temp1;
            tmp_hash[3] = tmp_hash[2];
            tmp_hash[2] = tmp_hash[1];
            tmp_hash[1] = tmp_hash[0];
            tmp_hash[0] = S0 + maj + temp1;
        }

        for(uint8_t i = 0 ; i < 8 ; i++)
        {
            h_values[i] += tmp_hash[i];
        }
    }
}

uint32_t SHA256::rotate(uint32_t x, uint32_t n)
{
	return (x >> n) | (x << (32 - n));
}

uint32_t SHA256::choose(uint32_t e, uint32_t f, uint32_t g)
{
	return (e & f) ^ (~e & g);
}

uint32_t SHA256::majority(uint32_t a, uint32_t b, uint32_t c)
{
    return (a & b) ^ (a & c) ^ (b & c);
}

uint32_t SHA256::sigma0(uint32_t x)
{
	return SHA256::rotate(x, 7) ^ SHA256::rotate(x, 18) ^ (x >> 3);
}

uint32_t SHA256::sigma1(uint32_t x)
{
	return SHA256::rotate(x, 17) ^ SHA256::rotate(x, 19) ^ (x >> 10);
}
