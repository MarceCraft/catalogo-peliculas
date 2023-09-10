"use strict";
class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}
class Stack {
    constructor() {
        this.top = null;
        this.bottom = null;     
        this.length = 0;   
    }
    push(value) {
        const newNode = new Node(value);
        if (this.length === 0) {
            this.bottom = newNode;
            this.top = newNode;
        }
        else {
            const topNode = this.top;
            this.top = newNode;
            this.top.next = topNode;
        }
        this.length++;
        return this;
    }
    pop() {
        if (this.length === 1) {
            this.length--;
            this.top = null;
            this.bottom = null;
            return this;
        }
        else if(this.length > 1){
            this.length--;
            const holdingPointer = this.top.next;
            this.top = holdingPointer;
            return this;
        }
        return undefined;
    }
    peek() {
        return this.top;
    }
}








































