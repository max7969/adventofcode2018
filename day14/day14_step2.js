let data = "320851";

function Node(value, next) {
    this.value = value;
    this.next = next;
    this.prev = null;
};

function ChainedList(nodeA, nodeB) {
    this.length = 2;
    this.head = nodeA;
    this.tail = nodeB;
    this.elf1 = nodeA;
    this.elf2 = nodeB;
}

var rotate = (list, elfNumber) => {
    if (elfNumber === 1) {
        let elf1 = list.elf1;
        let count = elf1.value +1;
        for (let i = 0; i < count; i++) {
            elf1 = elf1.next ? elf1.next : list.head;
        }
        list.elf1 = elf1;
    } else {
        let elf2 = list.elf2;
        let count = elf2.value +1;
        for (let i = 0; i < count; i++) {
            elf2 = elf2.next ? elf2.next : list.head;
        }
        list.elf2 = elf2;
    }
}

var addNode = (list, value) => {
    let newNode = new Node(value, null);
    newNode.prev = list.tail;
    list.tail.next = newNode;
    list.tail = newNode;
    list.length++;
}

var initRecipes = () => {
    let nodeB = new Node(7, null);
    let nodeA = new Node(3, nodeB);
    nodeB.prev = nodeA;
    return new ChainedList(nodeA, nodeB);
}

var createNewRecipes = (list) => {
    let count = list.elf1.value + list.elf2.value;
    if (count < 10) {
        addNode(list, count);
    } else {
        addNode(list, Math.floor(count / 10));
        addNode(list, count % 10);
    }
}

var getLastSeven = (list) => {
    let str = "";
    let current = list.tail;
    if (list.length > 7) {
        for (let i = 0; i < 7; i++) {
            str = str.concat(current.value);
            current = current.prev;
        }
    }
    return str.split("").reverse().join("");
}

var getChainStr = (list) => {
    let str = "";
    let node = list.head;
    while (node) {
        str = str.concat("" + node.value);
        node = node.next;
    }
    return str;
}

var createRecipesUntilTheEnd = (pattern) => {
    let list = initRecipes();
    let patternFound = false;
    while (!patternFound) {
        createNewRecipes(list);
        rotate(list, 1);
        rotate(list, 2);
        patternFound = getLastSeven(list).split(pattern).length > 1;
    }
    return getChainStr(list).split(pattern)[0].length;
}

console.log(createRecipesUntilTheEnd("320851"));