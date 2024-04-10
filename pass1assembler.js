const fs = require('fs');

function pass1Assembler(opFilePath, inputFilePath) {
    try {
        // Read operational table and input file
        const opTable = readOpTable(opFilePath);
        const inputFileData = fs.readFileSync(inputFilePath, 'utf-8').split('\n');

        // Initialize symbol table and output lines
        const symTable = {};
        const outputLines = [];

        // Initialize location counter and start address
        let locctr = 0;
        let start = 0;

        // Loop through input file lines
        for (let i = 0; i < inputFileData.length; i++) {
            const [label, opcode, operand] = inputFileData[i].split('\t');

            // Handle START directive
            if (opcode === "START") {
                start = parseInt(operand);
                locctr = start;
                outputLines.push(`\t${label}\t${opcode}\t${operand}`);
                continue;
            }

            // Increment location counter
            outputLines.push(`${locctr}\t`);

            // Add label to symbol table if present
            if (label !== "**") {
                symTable[label] = locctr;
                outputSymTable(label, locctr);
            }

            // Determine mnemonic for opcode and update locctr accordingly
            const mnemonic = opTable[opcode];
            if (mnemonic) {
                locctr += 3;
            } else if (opcode === "WORD") {
                locctr += 3;
            } else if (opcode === "RESW") {
                locctr += (3 * parseInt(operand));
            } else if (opcode === "RESB") {
                locctr += parseInt(operand);
            } else if (opcode === "BYTE") {
                locctr += 1;
            }

            // Push output line
            outputLines.push(`${label}\t${opcode}\t${operand}\t\n`);
        }

        // Calculate code length
        const length = locctr - start;
        console.log(`The length of the code: ${length-3}`);

        // Write output lines to file
        fs.writeFileSync("Out.txt", outputLines.join('\n'));

        // Return output lines and symbol table
        return { outputLines, symTable };
    } catch (error) {
        // Handle any errors that occur during assembly
        console.error("Error during Pass 1 assembly:", error);
        return { outputLines: [], symTable: {} }; // Return empty objects in case of error
    }
}

// Function to read operational table
function readOpTable(filename) {
    const opTable = {};
    const opTableData = fs.readFileSync(filename, 'utf-8').split('\n');

    for (let i = 0; i < opTableData.length; i++) {
        const [code, mnemonic] = opTableData[i].split('\t');
        opTable[code] = mnemonic;
    }

    return opTable;
}

// Function to output symbol table to file
function outputSymTable(label, locctr) {
    const data = `${label}\t${locctr}\n`;
    fs.appendFileSync("Symtabl.txt", data);
}

module.exports = pass1Assembler;
