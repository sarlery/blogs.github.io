// 6 + 4 * 3 / 2
// 中缀表达式运算（不支持括号）

const calculator = {
    numStack: [], // 存储数值
    operStack: [], // 存储操作符
    handle(expression) {
        this.expression = expression;
        var prevValue = undefined; // 上一次扫描的值
        var num1, num2, result, oper, len = expression.length;
        var {
            operStack,
            numStack
        } = this;
        for (let i = 0; i < len; i++) {
            var item = expression[i];
            if (this.isOperator(item)) { // 当是操作数时
                var oStackLen = operStack.length;
                if (!oStackLen) { // 如果运算符栈是空的，直接 push 进去
                    operStack.push(item);
                } else { // 如果不是空值，就要判断运算符栈顶的操作符与表达式传来的优先级
                    if (this.isAllOper(item, prevValue)) { // 输入了两个连续的运算符
                        throw new Error('表达式不正确', prevValue, item);
                    }
                    if (this.priority(operStack[oStackLen - 1]) < this.priority(item)) {
                        // 栈里的优先级比表达式优先级小，就把表达式运算符入栈
                        operStack.push(item);
                    } else { // 否则（栈顶的优先级更高），就弹出栈中的运算符进行运算
                        // 先要判断数值栈的个数有没有两个，只有一个不能运算，就要抛出异常
                        if (numStack.length < 2) {
                            throw new Error('表达式不正确');
                        }
                        num1 = numStack.pop();
                        num2 = numStack.pop();
                        oper = operStack.pop();
                        result = this.calc(num1, num2, oper);
                        numStack.push(result);
                        operStack.push(item); // 把表达式的运算符存入栈中
                    }
                }
            } else if (this.isNumber(item)) { // 当是数字时
                // 如果是数字就要判断数字的位数
                // 就判断当前的值与前一个值是不是都是数字
                if (prevValue && this.isAllNum(item, prevValue)) {
                    var top = this.numStack.pop();
                    this.numStack.push(Number(top + item));
                } else {
                    this.numStack.push(Number(item));
                }
            } else {
                throw Error('表达式的值不合法！', item);
            }
            prevValue = item;
        }

        // 循环完毕后，最最后的运算
        while (true) {
            if (numStack.length < 2) {
                break;
            }
            num1 = numStack.pop();
            num2 = numStack.pop();
            oper = operStack.pop();
            result = this.calc(num1, num2, oper);
            numStack.push(result);
        }
        return this.numStack[0];
    },
    isAllNum(nowVal, prevVal) {
        // 上一个值和现在的值是不是都是数字
        return calculator.isNumber(nowVal) && calculator.isNumber(prevVal);
    },
    isAllOper(nowVal, prevVal) {
        return calculator.isOperator(nowVal) && calculator.isOperator(prevVal);
    },
    isNumber(value) { // 判断是不是数字，数字的 ASCII 在 48 ~ 57 之间
        return value.charCodeAt() > 47 && value.charCodeAt() < 58;
    },
    isOperator(value) { // 判断是不是运算符
        return value === '/' ||
            value === '-' ||
            value === '+' ||
            value === '*';
    },
    calc(num1, num2, operator) {
        switch (operator) {
            case '+':
                return num1 + num2;
            case '*':
                return num1 * num2;
            case '-':
                return num2 - num1;
            case '/':
                return num2 / num1;
            default:
                throw Error('表达式不正确：', num1 + operator + num2);
        }
    },
    priority(operator) {
        switch (operator) {
            case "/":
            case "*":
                return 2;
            case "-":
            case "+":
                return 1;
            default:
                return -1;
        }
    },
};

// 逆波兰表达式
/**
 * 思路
 * 1. 初始化两个栈，s1 存储运算符；s2 存储中间结果
 * 2. 从左至右扫描中缀表达式
 * 3. 遇到操作数时，将其压入 s2
 * 4. 遇到运算符时，比较其与 s1 栈顶运算符的优先级
 *      4-1. 如果 s1 为空，或栈顶运算符为左括号，则直接将此运算符入栈；
 *      4-2. 否则，若优先级比栈顶运算符的高，也将运算符压入 s1；
 *      4-3. 否则，将 s1 栈顶的运算符弹出并压入 s2 中，再次转到 4-1 与 s1 中新的栈顶运算符相比较；
 * 5. 遇到括号时：
 *      5-1. 如果是左括号，则直接压入 s1；
 *      5-2. 如果是右括号，则依次弹出 s1 栈顶的运算符，并压入 s2，直到遇到左括号为止，此时将这一对括号丢弃；
 * 6. 重复步骤 2~5，直到表达式的最右边
 */
const reversePolish = {
    s1: [],
    s2: [],
    /**
     * 把中缀表达式转成逆波兰表达式
     * @param {string} expression 中缀表达式
     */
    transform(expression) {
        let len = expression.length;
        let prevVal = undefined;
        let reg = /\s/;
        const {
            isNumber,
            isOperator,
            isLeftBracket,
            isRightBracket,
            isEmpty,
            stackTopIsLeftBracket,
            isHigherPriority,
            updateNumStackTop,
            isPoint,
            getStackTopItem,
            s1,
            s2
        } = this;
        for (let i = 0; i < len; i++) {
            var item = expression[i];
            if(reg.test(item))  continue;   // 当是空格时就忽略它
            if (isNumber(item)) { // 如果是数字，看看前一个输入是不是也是数字或者小数点，是的话就拼接
                prevVal && (isNumber(prevVal) || isPoint(prevVal)) ? updateNumStackTop(s2, item) : s2.push(Number(item));
            } else if(isPoint(item)){    // 如果是小数点
                // prevVal 是数字，那么就检查栈顶元素是不是已经有了小数点
                if(isNumber(prevVal)){      // 前一个是数字
                    let top = getStackTopItem(s2);
                    if(String(top).includes(item))  throw new Error("表达式书写有误！");
                    updateNumStackTop(s2, item);    // 没有小数点就更新栈顶元素（字符拼接）
                }else   throw new Error("表达式书写有误！");        // 前一个不是数字时就直接抛出异常
            } else if (isOperator(item)) {      // 是操作数
                if(prevVal && isOperator(prevVal))     throw new Error('表达式书写有误！');    // 前一个也是操作数时报错
                while (true) {
                    if (isEmpty(s1) || stackTopIsLeftBracket(s1)) {
                        s1.push(item);
                        break;
                    } else if (isHigherPriority(s1, item)) {
                        s1.push(item);
                        break; // item 比 s1 栈顶优先级高时，就直接往 s1 中 push（优先级相同不 push）
                    } else {
                        var top = s1.pop();
                        s2.push(top);
                    }
                }
            } else if (isLeftBracket(item)) {
                s1.push(item);
            } else if (isRightBracket(item)) {
                var hasLeftBracket = false;     // 可能没有左括号，直接输入的是右括号！
                while (s1.length) {
                    var elm = s1.pop();
                    if (isLeftBracket(elm)){
                        hasLeftBracket = true;
                        break;
                    };
                    s2.push(elm);
                }
                if(!hasLeftBracket)     throw new Error('表达式不正确！');
            } else {
                throw new Error("输入的表达式有非法字符：", item);
            }
            prevVal = item;     // 更新前一个值
        }
        while (s1.length) {
            s2.push(s1.pop());
        }
        return s2;  // 返回数组
    },

    /**
     * 将生成的逆波兰式进行运算，得到运算结果。过程：
     * 1. 从左至右扫描表达式
     * 2. 遇到数字压入堆栈，遇到运算符，弹出栈顶的两个数
     * 3. 用运算符对它们做相应的计算（次顶元素和栈顶元素）
     * 4. 运算结果存入栈中，重复上述过程
     * 5. 直到表达式最右端，最后运算出得出的值就是表达式的结果
     */
    calc(expression) {      // expression 应是一个数组或字符串
        let stack = [], len = expression.length;
        let reg = /\s/;
        for(let i = 0;i < len;i ++){
            var item = expression[i];
            if(typeof item === 'number' && item === item){
                stack.push(item);
            }else if(typeof item === 'string' && this.isNumber(item)){
                if(reg.test(item))  continue;   // 是空格时就忽略掉
                stack.push(Number(item));
            }else if(this.isOperator(item)){
                if(stack.length > 1){
                    var result = this.getCalcRes(stack, item);
                    stack.push(result);
                }else{
                    // 如果 stack 中没有两个数值，表明这个表达式不合法
                    throw new Error('表达式不合法！');
                }
            }else{
                throw new Error("表达式不合法~");
            }
        }
        return stack[0];
    },

    getCalcRes(stack, oper){
        var top = stack.pop();
        var second = stack.pop();
        return reversePolish.getResult(top, second, oper);
    },

    isNumber(value) { // 判断是不是数字，数字的 ASCII 在 48 ~ 57 之间
        return value.charCodeAt() > 47 && value.charCodeAt() < 58;
    },
    isOperator(value) { // 判断是不是运算符
        return value === '/' ||
            value === '-' ||
            value === '+' ||
            value === '*';
    },
    isPoint(value){     // 是不是小数点
        return value === '.';
    },
    isLeftBracket(value) {
        return value === '(';
    },
    isRightBracket(value) {
        return value === ')';
    },
    isEmpty(stack) {
        return stack.length === 0;
    },
    getStackTopItem(stack) {
        var len = stack.length;
        return stack[len - 1];
    },
    stackTopIsLeftBracket(stack) { // 栈顶元素是不是左括号
        var item = reversePolish.getStackTopItem(stack);
        return reversePolish.isLeftBracket(item);
    },
    isHigherPriority(stack, operator) { // 判断传入的 operator 是不是比 stack 顶部优先级高
        var top = reversePolish.getStackTopItem(stack);
        return reversePolish.priority(top) < reversePolish.priority(operator);
    },
    updateNumStackTop(stack, value) {
        let top = stack.pop();
        top += value;
        stack.push(top);
    },
    priority(operator) {
        switch (operator) {
            case "/":
            case "*":
                return 2;
            case "-":
            case "+":
                return 1;
            default:
                return -1;
        }
    },
    getResult(num1, num2, operator) {
        switch (operator) {
            case '+':
                return num1 + num2;
            case '*':
                return num1 * num2;
            case '-':
                return num2 - num1;
            case '/':
                return num2 / num1;
            default:
                throw Error('表达式不正确：', num1 + operator + num2);
        }
    },
};


// test:

var expression = '1.8+((2-3.5)*4)-5.8';   // -10
// var expression = '(3+4)*5-6';
var result = reversePolish.transform(expression);
console.log(result);
// var result = '34+5*6-'; // (3+4)*5-6 --> 29
console.log(reversePolish.calc(result));
