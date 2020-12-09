from sha256 import sha256

# init a merkel tree with depth of 3
merkel = [0,
          [0,
           [0, [], []],
           [0, [], []]
           ],
          [0,
           [0, [], []],
           [0, [], []]
           ]
          ]

merkel[1][1][0] = sha256(sha256("a"))
merkel[1][2][0] = sha256(sha256("b"))
merkel[2][1][0] = sha256(sha256("c"))
merkel[2][2][0] = sha256(sha256("d"))

merkel[1][0] = sha256(merkel[1][1][0] + merkel[1][2][0])
merkel[2][0] = sha256(merkel[2][1][0] + merkel[2][2][0])

merkel[0] = sha256(merkel[1][0] + merkel[2][0])

# verification
hash_merkel_root = merkel[0]
header_data = "a"
position = (1, 1)

root = sha256(sha256(sha256(sha256(header_data)) +
       merkel[position[0]][1 if position[1] != 1 else 2][0]) +
       merkel[1 if position[0] != 1 else 2][0])
if root == hash_merkel_root:
    print("valid")
else:
    print("invalid")
