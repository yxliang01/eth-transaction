Eth-Transaction
=====

[![Build Status](https://travis-ci.org/yxliang01/Eth-Transaction.svg?branch=master)](https://travis-ci.org/yxliang01/Eth-Transaction)
[![Dependency Status](https://david-dm.org/yxliang01/Eth-Transaction.svg)]()
[![Code Climate](https://codeclimate.com/github/yxliang01/Eth-Transaction/badges/gpa.svg)](https://codeclimate.com/github/yxliang01/Eth-Transaction)
[![NSP Status](https://nodesecurity.io/orgs/yxliang01/projects/d671ed91-5404-4c9a-91aa-a815510965df/badge)](https://nodesecurity.io/orgs/yxliang01/projects/d671ed91-5404-4c9a-91aa-a815510965df)

A library for creating Web3(Ethereum) transactions easier. However, for now it has only one function which sends transaction with gas estimated automatically. If you have ideas, please feel free to submit an issue at https://github.com/yxliang01/Eth-Transaction/issues .

Functions:
```javascript
autoGas(web3_object, transaction_object, minGas, additionalGas)
```

To install:
```bash
npm install --save Eth-Transaction

# If you have yarn
yarn add Eth-Transaction

```
