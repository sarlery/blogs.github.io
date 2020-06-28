const G = (function(){

    enum Color { WHITE, GRAY, BLACK };

    return class Graph<T> {
        vertex: T[];
        neighbor: Map<T, Set<T>>;
        isDirected: boolean;


        constructor(isDirected = false){        // 默认是无向图
            this.isDirected = isDirected;
            this.vertex = [];
            this.neighbor = new Map();
        }

        addVertex(...vertex: T[]): void{
            vertex.forEach(item => {
                if(!this.vertex.includes(item)){
                    this.vertex.push(item);
                    this.neighbor.set(item, new Set());
                }
            });
        }

        addEdge(vertex: T, ...neighbor: T[]): void{
            const n = this.neighbor;
            if(!n.get(vertex)){
                this.addVertex(vertex);
            }
            neighbor.forEach(item => {
                if(!n.get(item)){
                    this.addVertex(item);
                }
            });
            neighbor.forEach(item => n.get(vertex)?.add(item));
            if(!this.isDirected){
                neighbor.forEach(item => {
                    n.get(item)?.add(vertex);
                }); 
            }
        }

        toString(): void{
            var neighbor = this.neighbor;
            var vertex = this.vertex;
            for(let i = 0;i < vertex.length;i ++){
                const nSet = neighbor.get(vertex[i]) as Set<T>;
                var str = Array.from(nSet.values()).join(" ");
                console.log(`${vertex[i]} --> ${str}\n`);
            }
        }

        protected initColor(){
            let color = new Map<T, Color>();
            this.vertex.forEach(item => {
                color.set(item, Color.WHITE);
            });
            return color;
        }

        bfs(startVertex: T, callback: (node: T) => any){
            const vertex = this.vertex;
            const neighbor = this.neighbor;
            // 数组中没有传入的顶点
            if(!vertex.includes(startVertex))   return;
            let queue:T[] = [startVertex];     // 设置一个队列，用来存放顶点
            let colorMap = this.initColor();    // 拿到初始化的顶点状态
            // 遍历顶点
            while(queue.length){
                let now = queue.shift() as T;    // 出队
                // 当还没有遍历整个顶点时
                colorMap.set(now, Color.GRAY);
                // 获取到顶点的 临点，添加到队列里
                const neighbors = neighbor.get(now) as Set<T>;
                neighbors.forEach(n => {
                    if(colorMap.get(n) === Color.WHITE){
                        colorMap.set(n, Color.GRAY);
                        queue.push(n);
                    }
                });
                // 别忘了设置状态，表示该顶点已探索
                colorMap.set(now, Color.BLACK);
                // 把探索到的顶点传给回调函数做进一步的操作
                if(typeof callback === "function")
                    callback(now);
            }
        }

        findSortestPath(start: T, end: T): number{
            const n = this.neighbor;
            if(!n.get(start) || !n.get(end))    return -1;
            if(start === end)   return 0;

            const colorMap = this.initColor();
            const queue = [start];
            const prevVertex = new Map<T, T>();     // 这个是用来追踪顶点
            let distance = 1;       // 距离

            while(queue.length){
                const now = queue.shift() as T;
                colorMap.set(now, Color.GRAY);

                const neighbors = n.get(now) as Set<T>;
                const vertices = Array.from(neighbors.values());

                for(let i = 0;i < vertices.length;i ++){
                    let vertex = vertices[i];
                    if(colorMap.get(vertex) === Color.WHITE){
                        prevVertex.set(vertex, now);        // vertex 是由 now 节点得到
                        if(vertex === end){
                            let node = prevVertex.get(vertex);
                            while(node && node !== start){
                                distance += 1;
                                node = prevVertex.get(node);
                            }
                            return distance;
                        }
                        colorMap.set(vertex, Color.GRAY);
                        queue.push(vertex);
                    }
                }
                colorMap.set(now, Color.BLACK);
            }
            return -1;
        }

        dfs(startVertex: T, callback: (node: T) => any){
            const vertex = this.vertex;
            const neighbor = this.neighbor;

            var deepVisit = function(node: T, colorMap: Map<T, Color>){
                colorMap.set(node, Color.GRAY);
                if(typeof callback === "function")
                    callback(node);

                const neighbors = neighbor.get(node) as Set<T>;

                neighbors.forEach(n => {
                    if(colorMap.get(n) === Color.WHITE){
                        deepVisit(n, colorMap);
                    }
                });
                colorMap.set(node, Color.BLACK);
            }
            
            if(!vertex.includes(startVertex))   return;
            const colorMap = this.initColor();

            for(let i = 0;i < vertex.length;i ++){
                if(colorMap.get(vertex[i]) === Color.WHITE){
                    // 只有是白色时才遍历，这说明这个顶点还没有被访问
                    deepVisit(vertex[i], colorMap);
                }
            }
        }
    }    

})();

const graph = new G<string>();

graph.addVertex("A", "B", "C", "D");
graph.addVertex("H");

graph.addEdge("A", "B");
graph.addEdge("B", "D");
graph.addEdge("B", "E");
graph.addEdge("C", "F");
graph.addEdge("D", "F");
graph.addEdge("D", "E");

graph.toString();