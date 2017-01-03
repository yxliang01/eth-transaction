'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var DEFAULT_MIN_GAS = 21000;
var DEFAULT_ADDITIONAL_GAS = 10000;

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

    var args = Array.from(arguments);

    var remainingArg = args.slice(4); // Have to change this when change the number of arguments
    var transactionOptionPos = void 0;

    if (typeof remainingArg[remainingArg.length - 1] === 'function') {
        transactionOptionPos = remainingArg.length - 2;
    } else {
        transactionOptionPos = remainingArg.length - 1;
    }

    remainingArg[transactionOptionPos].gas = undefined; // Manually remove the gas to avoid if there's any

    var estimatedGas = obj.estimateGas.apply(this, typeof remainingArg[remainingArg.length - 1] === 'function' ? remainingArg.slice(0, remainingArg.length - 1) : remainingArg);

    remainingArg[transactionOptionPos].gas = web3.toHex(Math.max(estimatedGas + additionalGas, minGas));

    obj.sendTransaction.apply(this, remainingArg);
}

exports.autoGas = autoGas;
//# sourceMappingURL=index.js.map