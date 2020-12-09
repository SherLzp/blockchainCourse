from sha256 import hash
from copy import deepcopy
class Node:
    def __init__(self, data):
        self.child1 = None
        self.child2 = None
        self.hash = None
        self.data = None
        if data != None:
            self.change_data(data)

    def clear_child(self):
        self.child1 = None
        self.child2 = None

    def change_data(self, data):
        self.data = data
        self.hash = hash(hash(data))

class MerkelTree:
    def __init__(self, _itemList):
        self.root = None
        self.itemList = []
        self.itemList = deepcopy(_itemList)
        self.build_tree()

    def add(self, item):  
        self.itemList.append(item)
        self.build_tree()

    def pad(self, q):
        if len(q) % 2 == 1:
            node = Node(q[len(q) - 1].data)
            q.append(node)
 
        
    def build_tree(self):
        q = []
        for item in self.itemList:
            q.append(Node(item))

        self.pad(q)
        current = len(q)

        while len(q) > 1:
            if current == 0:
                self.pad(q)
                current = len(q)

            pop_node1 = q.pop(0)
            pop_node2 = q.pop(0)
            current -= 2
            node = Node("")
            node.child1 = pop_node1
            node.child2 = pop_node2
            node.change_data(pop_node1.hash + pop_node2.hash)
            q.append(node)
        
        self.root = q[0]
             
    def traverse(self):  
        if self.root is None:
            return None
        q = [self.root]
        ans = [self.root.hash]
        while q != []:
            pop_node = q.pop(0)
            if pop_node.child1 is not None:
                q.append(pop_node.child1)
                ans.append(pop_node.child1.hash)

            if pop_node.child2 is not None:
                q.append(pop_node.child2)
                ans.append(pop_node.child2.hash)

        return ans
