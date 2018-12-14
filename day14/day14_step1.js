let data = 320851;

function Node(value, next) {
    this.value = value;
    this.next = next;
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
    list.tail.next = newNode;
    list.tail = newNode;
    list.length++;
}

var initRecipes = () => {
    let nodeB = new Node(7, null);
    let nodeA = new Node(3, nodeB);
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

var getTenNext = (list, countNeeded) => {
    let current = list.head;
    for (let i = 0; i < countNeeded; i++) {
        current = current.next;
    }
    let str = "";
    for (let i = 0; i < 10; i++) {
        str = str.concat(current.value);
        current = current.next;
    }
    return str;
}

var createRecipesUntilTheEnd = (nbRecipesNeeded) => {
    let list = initRecipes();
    while (list.length <= nbRecipesNeeded + 10) {
        createNewRecipes(list);
        rotate(list, 1);
        rotate(list, 2);
    }
    return getTenNext(list, nbRecipesNeeded);
}

console.log(createRecipesUntilTheEnd(data));

