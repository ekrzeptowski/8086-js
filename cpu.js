class Register {
    constructor(state) {
        this.value = state || 0x0000;
    }

    get high() {
        return (this.value & 0xff00) >> 8;
    }

    set high(value) {
        this.value = (value << 8) | (this.value & 0x00ff);
    }

    get low() {
        return this.value & 0x00ff;
    }

    set low(value) {
        this.value = (this.value & 0xff00) | value;
    }

    get() {
        return this.value;
    }

    set(value) {
        this.value = value;
    }
}

class Memory {
    constructor() {
        this.data = new Uint16Array(0x10000);
    }

    set(address, value) {
        console.log(address, value);
        this.data[address] = value;
    }

    size() {
        return this.data.length;
    }
}

class Namespace {
    constructor(registers, memory) {
        this.registers = registers;
        this.memory = memory;
    }

    get(address) {
        if (!address) {
            return null;
        }
        if (address.charAt(0) === "[") {
            return this.memory.data[Number("0x" + address.slice(1, -1))];
        } else if (address.charAt(1) === "X") {
            return this.registers[address].get();
        } else if (address.charAt(1) === "H") {
            return this.registers[address.charAt(0) + "X"].high;
        } else if (address.charAt(1) === "L") {
            return this.registers[address.charAt(0) + "X"].low;
        } else if (address.charAt(address.length - 1) === "b") {
            return Number("0b" + address.slice(0, -1));
        } else if (address.charAt(address.length - 1) === "h") {
            return Number("0x" + address.slice(0, -1));
        } else if (Number(address)) {
            return Number(address);
        }

    }

    set(address, value) {
        if (!address || !value) {
            console.log(address, value);
            console.log("Invalid address or value");
            return null;
        }
        if (address.charAt(0) === "[") {
            console.log("set memory", address.slice(1, -1), value);
            this.memory.set(Number("0x" + address.slice(1, -1)), value);
            renderMemory();
        } else if (address.charAt(1) === "X") {
            console.log("set register", address, value);
            this.registers[address].set(value);
            renderRegisters();
        } else if (address.charAt(1) === "H") {
            console.log("set high", address, value);
            this.registers[address.charAt(0) + "X"].high = value;
            renderRegisters();
        } else if (address.charAt(1) === "L") {
            console.log("set low", address, value);
            this.registers[address.charAt(0) + "X"].low = value;
            renderRegisters();
        }
        console.log("set", address, value);

    }
}

class CPU {
    constructor() {
        this.registers = {
            AX: new Register(),
            BX: new Register(),
            CX: new Register(),
            DX: new Register(),
        }
        this.memory = new Memory();
        this.namespace = new Namespace(this.registers, this.memory);
    }

    compute(instruction, destination, source) {
        instruction = instruction.toUpperCase();
        switch (instruction) {
            case "MOV":
                this.namespace.set(destination, this.namespace.get(source));
                break;
            case "XCHG":
                let temp = this.namespace.get(destination);
                this.namespace.set(destination, this.namespace.get(source));
                this.namespace.set(source, temp);
                break;
            case "ADD":
                this.namespace.set(destination, this.namespace.get(destination) + this.namespace.get(source));
                break;
            case "SUB":
                this.namespace.set(destination, this.namespace.get(destination) - this.namespace.get(source));
                break;
            case "MUL":
                this.namespace.set(destination, this.namespace.get(destination) * this.namespace.get(source));
                break;
            case "DIV":
                this.namespace.set(destination, this.namespace.get(destination) / this.namespace.get(source));
                break;
            case "INC":
                this.namespace.set(destination, this.namespace.get(destination) + 1);
                break;
            case "DEC":
                this.namespace.set(destination, this.namespace.get(destination) - 1);
                break;
            case "AND":
                this.namespace.set(destination, this.namespace.get(destination) & this.namespace.get(source));
                break;
            case "OR":
                this.namespace.set(destination, this.namespace.get(destination) | this.namespace.get(source));
                break;
            case "XOR":
                this.namespace.set(destination, this.namespace.get(destination) ^ this.namespace.get(source));
                break;
            case "NOT":
                this.namespace.set(destination, ~this.namespace.get(destination));
                break;
        }
    }

}

const simulation = new CPU();