
const DEFAULT_MIN_GAS = 21000;
const DEFAULT_ADDITIONAL_GAS = 10000;

/**
 * Send transaction with a likely-to-be correct gas value *Automatically*
 *
 * @param obj The object we send transaction to
 * @param additionalGas amount of additional gas to avoid underestimating the amount of gas
 * @param minGas the minimum gas for the transaction
 */
function autoGas(web3, obj, minGas, additionalGas) {

    minGas = minGas || DEFAULT_MIN_GAS;
    additionalGas = additionalGas || DEFAULT_ADDITIONAL_GAS;

    const args = Array.from(arguments);

    let remainingArg = args.slice(4); // Have to change this when change the number of arguments
    let transactionOptionPos;

    if(typeof remainingArg[remainingArg.length-1] === 'function') {
        transactionOptionPos = remainingArg.length-2;
    } else {
        transactionOptionPos = remainingArg.length-1;
    }

    remainingArg[transactionOptionPos].gas = undefined; // Manually remove the gas to avoid if there's any

    const estimatedGas = obj.estimateGas.apply(this, (typeof remainingArg[remainingArg.length-1] === 'function' ? remainingArg.slice(0,remainingArg.length-1) : remainingArg));

    remainingArg[transactionOptionPos].gas = web3.toHex(Math.max(estimatedGas + additionalGas, minGas));

    obj.sendTransaction.apply(this, remainingArg);

}

export {autoGas};