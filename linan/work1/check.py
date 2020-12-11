# python3
from hashlib import sha256
test_string = ["8","bb6638","0630d94f9","2fc6cc2f22fc2","3a911f40d3a911f","b5ff55e68b5ff55e68","8f5e2a15bv8f5e2a15bs","c9ada08a78f5e2a15b8f5e2a15b","6f29de1fe8f5e2a15b8f5e2a15b12","9ab7ab9a18f5e2a15bab9a18fab9a18f","83ce97c8cab9a1ab9a1ab9a1ff55eff55e","6c54014a99a1ab9a1ff14a9914a9930d94ab"]
[print(sha256(each.encode()).hexdigest()) for each in test_string]