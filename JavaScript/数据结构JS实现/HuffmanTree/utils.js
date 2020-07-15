const BinaryParser = (function(){
    const ORIGINAL = 1;     // 源码
    const INVERSE = 2;      // 反码
    const COMPLEMENT = 3;   // 补码

    return class BinaryParser{
        /**
         * 
         * @param {string} binStr 传入的二进制字符串类型（默认是原码）
         * @param {number} type 类型 1 是原码；2 是反码；3 是补码
         */
        constructor(binStr, type){
            this.binStr = binStr;
            this.type = type | ORIGINAL;
            this.signBit = this.getSignBit(binStr);     // 符号位
            this.numbericalBit = this.getNumbericalBit(binStr);     // 数值位
            this.size = this.numbericalBit.length;  // 数值位长度
            this.isNegative = this.signBit > 0;     // 是不是负数
        }
        /**
         * 获取数值位
         * @param {string} binStr 二进制字符串
         * @returns {Array<string>} 用数组存储每一位
         */
        getNumbericalBit(binStr){
            return binStr.slice(1).split("");
        }
        /**
         * 获得符号位
         * @param {string} binStr 二进制字符串
         * @returns {number} 符号位
         */
        getSignBit(binStr){
            return Number(binStr[0]);
        }
        toOriginal(){
            switch(this.type){
                // 补码转原码
                case COMPLEMENT:
                    this.complementToOriginal();
                    break;
                // 反码转原码
                case INVERSE:
                    this.inverseToOriginal();
                    break;
                default: void 0;
            }
            return this;
        }
        toInverse(){
            switch(this.type){
                // 原码转反码
                case ORIGINAL:
                    this.originalToInverse();
                    break;
                // 补码转反码
                case COMPLEMENT:
                    this.complementToInverse();
                    break;
                default: void 0;
            }
            return this;
        }
        toComplement(){
            switch(this.type){
                // 原码转补码
                case ORIGINAL:
                    this.originalToComplement();
                    break;
                // 反码转补码
                case INVERSE:
                    this.inverseToComplement();
                    break;
                default: void 0;
            }
            return this;
        }
        toString(){
            return this.signBit + this.numbericalBit.join("");
        }
        // 转成有符号 8 位二进制数
        toInt8Num(binStr = this.binStr){
            // Int8Array: 二进制补码 8 位有符号整数的数组
            return new Int8Array(['0b' + binStr])[0];
        }
        // 转成有符号 16 位二进制数
        toInt16Num(binStr = this.binStr){
            return new Int16Array(['0b' + binStr])[0];
        }
        // 转成有符号 8 位二进制数
        toInt32Num(binStr = this.binStr){
            return new Int32Array(['0b' + binStr])[0];
        }
        // 无符号 8 位二进制数
        toUint8Num(binStr = this.binStr){
            return new Uint8Array(['0b' + binStr])[0];
        }
        // 无符号 16 位二进制数
        toUint16Num(binStr = this.binStr){
            return new Uint16Array(['0b' + binStr])[0];
        }
        // 无符号 32 位二进制数
        toUint32Num(binStr = this.binStr){
            return new Uint32Array(['0b' + binStr])[0];
        }
    
        // 转成十进制数
        toDec(){
            var res = 0;
            var digit = this.size - 1;
            this.numbericalBit.forEach((item, idx) => {
                res += Math.pow(2, digit - idx) * Number(item);
            });
            return this.isNegative ? res * -1 : res;
        }
        // 转成任意的进制数
        /**
         * 
         * @param {number} system 进制
         * @returns {string} 字符串格式的某进制
         */
        toNumber(system){
            var num = this.toDec();
            return (num).toString(system);
        }
    
        // 按位取反
        reverse(){
            if(this.isNegative){
                this.numbericalBit = this.numbericalBit.map(item => {
                    return item === '0' ? '1' : '0';
                });
            }
        }
    
        // 原码转补码
        originalToComplement(){
            this.reverse();   // 先转成反码
            this.inverseToComplement();     // 再转成补码
        }
        
        // 反码转原码（按位取反即可）
        inverseToOriginal(){
            this.reverse();
            this.type = ORIGINAL;
        }
        // 源码转反码（负数时，数值位按位取反）
        originalToInverse(){
            this.reverse();
            this.type = INVERSE;
        }
        // 反码转补码
        inverseToComplement(){
            if(this.isNegative){
                let { size, numbericalBit } = this;
                for(let i = size - 1;i >= 0;i --){
                    if(numbericalBit[i] === '1'){
                        numbericalBit[i] = '0';
                    }else if(numbericalBit[i] === '0'){
                        numbericalBit[i] = '1';
                        break;
                    }
                }
            }
            this.type = COMPLEMENT;
        }
        
        // 补码转反码（负数时，补码减一）
        complementToInverse(){
            if(this.isNegative){
                let { size, numbericalBit } = this;
                for(let i = size - 1;i >= 0;i --){
                    if(numbericalBit[i] === '0'){
                        numbericalBit[i] = '1';
                    }else if(numbericalBit[i] === '1'){
                        numbericalBit[i] = '0';
                        break;
                    }
                }
            }
            this.type = INVERSE;
        }
        // 补码转源码（负数时，先减一，然后按位取反）
        complementToOriginal(){
            this.complementToInverse();
            this.reverse();
            this.type = ORIGINAL;
        }
    }
})();


// test

// var str = "10101100";

// var bin = new BinaryParser(str, 3);

// var res = bin.toOriginal();

// console.log(res.type);