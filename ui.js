function updateRegister(event, register, byte) {
    console.log(register, byte, event.target.value);
    // registers[register] = Number("0x" + event.target.value);
    switch (byte) {
        case 'H':
            simulation.registers[register].high = "0x" + event.target.value;
            break;
        case 'L':
            simulation.registers[register].low = "0x" + event.target.value;
            break;
    }
}

function renderRegisters() {
    const registersTable = document.getElementById('registers');
    const registersTableBody = registersTable.getElementsByTagName('tbody')[0];
    registersTableBody.innerHTML = "";

    Object.keys(simulation.registers).forEach((register) => {
        const registerRow = document.createElement('tr');
        registerRow.classList.add('register');
        registerRow.innerHTML = `
        <th class="register-name">${register}</th>
        <td><input class="register-value" type="text" value="${simulation.registers[register].high.toString(16).toUpperCase().padStart(2, "0")}" /></td>
        <td><input class="register-value" type="text" value="${simulation.registers[register].low.toString(16).toUpperCase().padStart(2, "0")}" /></td>
    `;
        registerRow.children[1].children[0].addEventListener('change', (event) => updateRegister(event, register, 'H'));
        registerRow.children[2].children[0].addEventListener('change', (event) => updateRegister(event, register, 'L'));
        registersTableBody.appendChild(registerRow);
    });
}

function renderMemory() {
    const memoryTable = document.getElementById('memory');
    const memoryTableBody = memoryTable.getElementsByTagName('tbody')[0];
    memoryTableBody.innerHTML = "";
    for (let address = 0; address < simulation.memory.size(); address += 0x10) {
        const memoryRow = document.createElement('tr');
        memoryRow.innerHTML = `
                <th class="memory-address">0x${address.toString(16).toUpperCase().padStart(4, "0")}</th>
<!--                <td>${simulation.memory.data[address].toString(16).toUpperCase().padStart(2, "0")}</td>-->
            `;
        for (let i = 0; i < 0x10; i++) {
            const newAddress = address + i;
            memoryRow.innerHTML += `<td>${simulation.memory.data[newAddress].toString(16).toUpperCase().padStart(2, "0")}</td>`;
        }
        memoryTableBody.appendChild(memoryRow);
        // }
    }

}

const commands = ["MOV", "XCHG", "ADD", "SUB", "MUL", "DIV", "INC", "DEC", "AND", "OR", "XOR", "NOT"];

function renderCommands() {
    const commandsSection = document.getElementsByClassName("commands-container")
    commandsSection[0].innerHTML = "";
    commands.forEach((command) => {
        const commandSpan = document.createElement("span");
        commandSpan.innerHTML = command + (command === commands[commands.length - 1] ? "" : " | ");
        commandsSection[0].appendChild(commandSpan);
    });
}

function executeCommand() {
    const command = document.getElementById("command").value;
    const commandParts = command.split(/\s(.*)/s);
    const commandName = commandParts[0];
    const commandArgs = commandParts[1];

    const destination = commandArgs.split(",")[0].trim();
    const source = commandArgs.split(",")[1]?.trim() || null;

    simulation.compute(commandName, destination, source);
}

document.addEventListener("DOMContentLoaded", function () {
    renderRegisters();
    renderMemory();
    renderCommands();
    document.getElementById("command").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            executeCommand();
        }
    });
    document.getElementById("execute").addEventListener("click", executeCommand);
});