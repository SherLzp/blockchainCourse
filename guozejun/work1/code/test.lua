local sha = require("homework1")

-- normal treade
local a1 = sha.sha256("trade1")
local a2 = sha.sha256("trade2")
local a3 = sha.sha256("trade3")
local a4 = sha.sha256("trade4")

local b1 = sha.sha256(a1 .. a2)
local b2 = sha.sha256(a3 .. a4)

local merkle = sha.sha256(b1 .. b2)

-- output: 6aafa9d924a1782b638449c6f3fc3283eb44bf28579512b00999e0f100d3674b
print(merkle)

-- edit trade value
a1 = sha.sha256("trade1")
a2 = sha.sha256("faketrade")
a3 = sha.sha256("trade3")
a4 = sha.sha256("trade4")
b1 = sha.sha256(a1 .. a2)
b2 = sha.sha256(a3 .. a4)
merkle = sha.sha256(b1 .. b2)

-- output: 8570c33becafdb08b7462101b257122e3f763b682a9dfcf8143fa9f3a5a421a1
print(merkle)

-- edit trade order
a1 = sha.sha256("trade1")
a2 = sha.sha256("trade3")
a3 = sha.sha256("trade2")
a4 = sha.sha256("trade4")
b1 = sha.sha256(a1 .. a2)
b2 = sha.sha256(a3 .. a4)
merkle = sha.sha256(b1 .. b2)

-- output: 6132794d6f8c62254322259b52b2543db83ec0509e0c3110ff8f91403955d649
print(merkle)
