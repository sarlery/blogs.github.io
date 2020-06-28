// 加权图

const Graph = (function(){
    enum Color { WHITE, GRAY, BLACK };

    return class Graph<T>{
        isDirected: boolean;
        vertex: Array<T>;
        // 里面的 map 是存放临点和加权值
        neighbor: Map<T, Map<T, number>>

        constructor(isDirected = false){
            this.isDirected = isDirected;
            this.vertex = [];
            this.neighbor = new Map();
        }

        addVertex(...vertex: T[]){
            const v = this.vertex;
            vertex.forEach(item => {
                if(!v.includes(item)){
                    v.push(item);
                    this.neighbor.set(item, new Map());
                }
            });
        }

        /**
         * 添加边和加权值
         * @param vertex 顶点
         * @param neighbor 临点
         * @param forwardLevel 正向的加权值 vertex ---> neighbor
         * @param reverseLevel 返乡的加权值 neighbor ---> vertex（只有 isDirected = true 时才会设置）
         */
        addEdge(vertex: T, neighbor: T, forwardLevel: number = 0, reverseLevel: number = forwardLevel){
            let n = this.neighbor;
            if(!n.get(vertex)){
                this.addVertex(vertex);
            }
            if(!n.get(neighbor)){
                this.addVertex(neighbor);
            }
            // 设置林边和加权值
            n.get(vertex)?.set(neighbor, forwardLevel);

            if(!this.isDirected){
                // 设置反向的加权值
                n.get(neighbor)?.set(vertex, reverseLevel);
            }
        }

        toString(){
            const v = this.vertex;
            const n = this.neighbor;

            v.forEach(vertex => {
                let neighbor = n.get(vertex)?.keys();
                if(neighbor){
                    console.log(`${vertex} => ${Array.from(neighbor).join(" ")}\n`);
                }
            });
        }

        /**
         * 返回顶点与边的加权值，如果返回值是 -1 表示 vertex 没有 neighbor 这个临点
         * @param vertex 顶点
         * @param neighbor 边
         */
        getLevel(vertex: T, neighbor: T): number{
            const n = this.neighbor;
            const neighborMap = n.get(vertex);
            if(!neighborMap)  return -1;
            let level = neighborMap.get(neighbor);
            return typeof level === "number" ? level : -1;
        }

        initColor(){
            let color = new Map<T, Color>();
            this.vertex.forEach(v => {
                color.set(v, Color.WHITE);
            });
            return color;
        }

        bfs(startVertex: T, callback: (node: T) => any){
            const v = this.vertex;
            const n = this.neighbor;
            if(!n.get(startVertex))     throw Error("图中没有这个顶点");
            const colorMap = this.initColor();
            const queue = [startVertex];
            while(queue.length){
                const now = queue.shift() as T;
                colorMap.set(now, Color.GRAY);
                
                const neighbors = n.get(now) as Map<T, number>
                Array.from(neighbors.keys()).forEach(i => {
                    // 拿到所有的临边
                    if(colorMap.get(i) === Color.WHITE){
                        colorMap.set(i, Color.GRAY);
                        queue.push(i);
                    }
                });
                colorMap.set(now, Color.BLACK);
                if(typeof callback === "function"){
                    callback(now);
                }
            }

            // 最后把没有探索到的孤立顶点（没有临点的）传给回调函数
            colorMap.forEach((value, key) => {
                if(value === Color.WHITE){
                    callback(key);
                }
            });
        }

        dfs(startVertex: T, callback: (node: T) => any){
            const v = this.vertex;
            const n = this.neighbor;
            if(!n.get(startVertex))     throw Error("图中没有这个顶点");

            const colorMap = this.initColor();

            function deepVisit(now: T, colorMap: Map<T, Color>, cb: (node: T) => any){
                colorMap.set(now, Color.GRAY);
                cb(now);
                const neighbors = n.get(now) as Map<T, number>;
                Array.from(neighbors.keys()).forEach(vertex => {
                    if(colorMap.get(vertex) === Color.WHITE){
                        colorMap.set(vertex, Color.GRAY);
                        deepVisit(vertex, colorMap, cb);
                    }
                });
                colorMap.set(now, Color.BLACK);
            };

            for(let i = 0;i < v.length;i ++){
                if(colorMap.get(v[i]) === Color.WHITE){
                    deepVisit(v[i], colorMap, callback);
                }   
            }
        }
    }

})();

// test

// const graph = new Graph<string>();

// graph.addVertex("A", "B", "C", "D");
// graph.addVertex("H");

// graph.addEdge("A", "B", 2);
// graph.addEdge("B", "D", 3);
// graph.addEdge("B", "E", 1);
// graph.addEdge("C", "F", 4);
// graph.addEdge("D", "F", 1);
// graph.addEdge("D", "E", 2, 3);

// graph.toString();

// let arr:string[] = [];
// let ary:string[] = [];

// graph.bfs("A", (node) => {
//     arr.push(node);
// });
// console.log("BFS === ", arr);

// graph.dfs('A', (node) => {
//     ary.push(node);
// });
// console.log("DFS === ", ary);

