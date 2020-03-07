/**
 * 实现一个简易的 Redux 库
 * createStore、applyMiddleware、compose、combinReducers
 * dispatch、subscribe、getState、enhancer
 * 中间件：redux-logger、redux-thunk、redux-promise
 */

/**
 * 创建一个 store 仓库，返回一个对象
 * 这个对象中包含四个方法：
 * dispatch：用于派发 action
 * getState：用于获得 store 中的数据
 * subscribe：订阅函数，当 state 数据改变后，就会触发监听函数
 * replaceReducer：reducer 增强器
 * @param {Function} reducer - 我们自己写的 reducer 函数
 * @param {Object} preloadedState - 可选参数，表示总的默认 state
 * @param {Function} enhancer - 可选参数，reducer 增强器，比如 applyMiddleware 就是一个 enhancer
 * 
 * 需要一个 state 作为数据存储容器，其他几个方法用于操作数据
 */
function createStore(reducer, preloadedState, enhancer) {
    let state;
    if (preloadedState && typeof preloadedState !== 'function') {
        state = preloadedState;
    }

    if (typeof preloadedState === "function" && typeof enhancer === 'undefined') {
        enhancer = preloadedState;
        preloadedState = undefined;
    }

    if (typeof enhancer !== "undefined") {
        if (typeof enhancer !== "function") {
            throw new Error("Expected the enhancer to be a function.");
        }
        // 执行 enhancer 函数
        enhancer(createStore)(reducer, preloadedState);
    }

    // getState 方法很简单，就是获取到 state
    const getState = () => state;

    let listeners = []; // 用于存储监听函数
    /**
     * dispatch 函数接收 action 参数
     * action 的一般格式：{ type: string, payload: xxx }
     * type 表示派发类型，payload 表示派发的数据
     * @param {Object} action 
     */
    function dispatch(action) {
        // reducer 返回新的 state
        state = reducer(state, action);
        // 每一次状态更新后，都需要调用 listeners 数组中的每一个监听函数
        listeners.forEach(listener => listener());
    }

    /**
     * 订阅函数
     * @param {Function} listener 将监听函数存入 listeners 数组中
     * @returns {Function}
     * subscribe 还会返回一个函数，该函数调用时会取消当前订阅的监听函数
     */
    function subscribe(listener) {
        listeners.push(listener);

        return () => {
            listeners = listeners.filter(item => item !== listener);
        }
    }

    return {
        dispatch,
        subscribe,
        getState
    }
}

/**
 * combineReducers 可以将多个小的 reducer 合并成一个大的 reducer 函数
 * @param {Object} reducers reducer 对象
 * @returns {Function}
 * 思路：我们使用 combineReducers 时，reducers 参数是一个对象
 * 对象的值是对应的 reducer 函数，比如：var rootReducer = combineReducers({appReducer: appReducer});
 * 然后把 rootReducer 传给 createStore 的第一个参数
 */
function combineReducers(reducers) {
    /**
     * reducers 是一个对象，键是字符串，值是 reducer 函数
     * currentKey 是当前遍历的键
     * 
     */
    return (state = {}, action) => {
        // 返回的是一个对象，reducer 就是返回的对象
        return Object.keys(reducers).reduce(
            (accum, currentKey) => {
                /**
                 * 执行 reducers[currentKey] 函数，把相应的 state、action 传入，得到新的 state
                 * 注意，为什么 state 对象中可以有 currentKey 键
                 * accum[currentKey] 是更新后的 state（也可以说是合并后的 state），
                 * 而传入的 state 是默认的 state，即 createStore 的第二个参数
                 * 如果没有传第二个参数（或者第二个参数是一个函数），那么 state[currentKey] 就是 undefined
                 * undefined 传入 reducer 函数里后，如果该函数的 state 函数有默认值就是用默认值
                 */
                accum[currentKey] = reducers[currentKey](state[currentKey], action);
                return accum;
            }, {} // accum 初始值是空对象
        );
    }
}

function applyMiddleware(...middlewares) {
    return function (createStore) {
        return function (reducer, initialState) {
            var store = createStore(reducer, initialState);
            var dispatch = store.dispatch;
            var chain = [];

            var middlewareAPI = {
                getState: store.getState,
                dispatch: (action) => dispatch(action)
            };

            // 每个中间件执行后都会返回增强后的 dispatch 函数，chain 数组的每一项都是一个函数
            chain = middlewares.map(middleware => middleware(middlewareAPI));
            // 然后把增强后的 dispatch 函数和原始的 dispatch 函数传给 compose 函数
            // compose 函数会把全部的 dispatch 函数嵌套执行
            dispatch = compose(...chain, store.dispatch);
            return {
                ...store,
                dispatch
            };
        }
    }
}

function compose(...funcs) {
    if (funcs.length === 0) {
        // 当没有 dispatch 增强函数时，就返回一个函数
        return arg => arg;
    }
    if (funcs.length === 1) {
        // 当只有一个 dispatch 函数时，就直接返回，说明这个函数是原始的 dispatch 函数
        return funcs[0];
    }
    // 当 reduce 函数没有指定初始值时，accum 会使用数组的第一个元素作为初始值
    // currentFn 会从数组第二项开始
    // 最终返回一个函数
    // 如果一个数组是这样的：[a,b,c,d]
    // (...args) => a(b(c(d())))
    return funcs.reduce((accum, currentFn) => {
        return (...args) => {
            return accum(currentFn(...args));
        }
    });
}

