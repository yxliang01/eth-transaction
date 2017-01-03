const DEFAULT_MIN_GAS = 21000;
const DEFAULT_ADDITIONAL_GAS = 10000;
const DEFAULT_WAIT_CHECK_INTERVAL = 1200;
const DEFAULT_TIMEOUT = undefined;

class Transaction {

    constructor(web3, obj) {
        this.web3 = web3;
        this.obj = obj;
    }

    /**
     * Send transaction with a likely-to-be correct gas value *Automatically*
     *
     * @param additionalGas amount of additional gas to avoid underestimating the amount of gas
     * @param minGas the minimum gas for the transaction
     */
    autoGas(minGas, additionalGas) {
        minGas = minGas || DEFAULT_MIN_GAS;
        additionalGas = additionalGas || DEFAULT_ADDITIONAL_GAS;
        this.prop_autoGas = new AutoGas(minGas, additionalGas);

        return this;
    }

    // TODO: Test this
    waitForConfirmation(callback, timeout, checkInterval) {
        this.prop_waitForConfirmation = new WaitConfirmation.apply(arguments);
        return this;
    }

    send() {

        const args = Array.from(arguments);

        let transactionOptionPos;


        if (typeof args[args.length - 1] === 'function') {
            transactionOptionPos = args.length - 2;
        } else {
            transactionOptionPos = args.length - 1;
        }

        console.log(args);

        if (typeof this.prop_autoGas !== 'undefined') {
            args[transactionOptionPos].gas = undefined; // Manually remove the gas to avoid if there's any

            //noinspection JSUnresolvedVariable
            const estimatedGas = this.obj.estimateGas.apply(this, eliminateCallback(args));

            //noinspection JSUnresolvedFunction
            args[transactionOptionPos].gas = this.web3.toHex(Math.max(estimatedGas + this.prop_autoGas.additionalGas, this.prop_autoGas.minGas));
        }


        if(typeof this.prop_testFunction !== 'undefined') {
            this.testFunction.apply(this, [this.prop_testFunction.expectValue].concat(args));
        }

        //noinspection JSUnresolvedVariable
        const transactionHash = this.obj.sendTransaction.apply(this, args);

        if(typeof this.prop_waitForConfirmation !== 'undefined') {

            var intervalId;

            const timeoutCheckId = setTimeout(()=>{
                throw 'Transaction wait timed out';
            }, this.prop_waitForConfirmation.timeout);

            intervalId = setInterval(()=>{
                if(this.web3.getTransaction(transactionHash) !== null) {
                    clearTimeout(timeoutCheckId);
                    clearInterval(intervalId);
                    this.prop_waitForConfirmation.callback.apply(undefined, transactionHash,this.prop_waitForConfirmation.callArgs);
                }
            }, this.prop_waitForConfirmation.interval);


        }

        return transactionHash;
    }

    /**
     * Test to see whether the function will return the result we want locally
     * @param expectValue the value we expect function to return
     */
    testFunction(expectValue) {
        if(this.obj.call.apply(this,eliminateCallback(Array.from(arguments).slice(1))) !== expectValue) {
            console.log(eliminateCallback(Array.from(arguments).slice(1)));
            throw 'Contract function call fails when testing the function';
        }
        return this;
    }

    testFunctionBeforeSend(expectValue) {
        this.prop_testFunction = new TestFunction(expectValue);
        return this;
    }

}

function eliminateCallback(args) {
    return typeof args[args.length - 1] === 'function' ? args.slice(0, args.length - 1) : args;
}

class TestFunction {
    constructor(expectValue) {
        this.expectValue = expectValue;
    }
}

class AutoGas {
    constructor(minGas, additionalGas) {
        this.minGas = minGas;
        this.additionalGas = additionalGas;
    }
}

class WaitConfirmation {
    constructor(callback, timeout, checkInterval) {
        this.callback = callback;
        this.timeout = timeout || DEFAULT_TIMEOUT;
        this.interval = checkInterval || DEFAULT_WAIT_CHECK_INTERVAL;
        this.callArgs = Array.from(arguments).slice(3);
    }
}

export {Transaction, DEFAULT_MIN_GAS, DEFAULT_ADDITIONAL_GAS};