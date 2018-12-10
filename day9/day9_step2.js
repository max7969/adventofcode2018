const fs = require('fs');

let data = JSON.parse(fs.readFileSync('./data.json'));

var readRules = (data) => {
    let regexp = /([0-9]*)\ players\;\ last\ marble\ is\ worth\ ([0-9]*)\ points/;
    let extract = data.match(regexp);
    return { "players": parseInt(extract[1]), "lastMarble": parseInt(extract[2]) };
}

function Node(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
};

function ChainedList(node) {
    this.length = 1;
    this.head = node;
    this.tail = node;
    this.current = node;
}

var rotate = (list, n) => {
    let current = list.current;
    if (n > 0) {
        for (let i = 0; i < n; i++) {
            current = current.next ? current.next : list.head;
        }
    } else {
        for (let i = 0; i < Math.abs(n); i++) {
            current = current.prev ? current.prev : list.tail;
        }
    }
    list.current = current;
}

var deleteNode = (list) => {
    if (list.current == list.head) {
        list.head = list.current.next;
        list.head.prev = null;
        list.current = list.current.next;
    } else if (list.current == list.tail) {
        list.tail = list.current.prev;
        list.tail.next = null;
        list.current = list.head;
    } else {
        list.current.prev.next = list.current.next;
        list.current.next.prev = list.current.prev;
        list.current = list.current.next;
    }
    list.length--;
}

var addNode = (list, value) => {
    let newNode = new Node(value);
    newNode.next = list.current.next;
    newNode.prev = list.current;
    if (list.current == list.tail) {
        list.tail = newNode;
    } else {
        list.current.next.prev = newNode;
    }
    list.current.next = newNode;
    list.current = list.current.next;
    list.length++;
}

var playMarbleUntilTheEnd = (playersCount, lastMarble) => {
    let players = new Array(playersCount).fill(0);
    let list = new ChainedList(new Node(0));
    for (let i = 1; i <= lastMarble; i++) {
        if (i % 23 === 0) {
            players[(i - 1) % playersCount] += i;
            rotate(list, -7);
            players[(i - 1) % playersCount] += list.current.value;
            deleteNode(list);
        } else {
            rotate(list, 1);
            addNode(list, i);
        }
    }

    return players;
}

let rules = readRules(data);
console.log(Math.max(...playMarbleUntilTheEnd(rules.players, rules.lastMarble * 100)));