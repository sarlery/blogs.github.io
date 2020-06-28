// 加权图
var Graph = (function () {
    var Color;
    (function (Color) {
        Color[Color["WHITE"] = 0] = "WHITE";
        Color[Color["GRAY"] = 1] = "GRAY";
        Color[Color["BLACK"] = 2] = "BLACK";
    })(Color || (Color = {}));
    ;
    return /** @class */ (function () {
        function Graph(isDirected) {
            if (isDirected === void 0) { isDirected = false; }
            this.isDirected = isDirected;
            this.vertex = [];
            this.neighbor = new Map();
        }
        Graph.prototype.addVertex = function () {
            var _this = this;
            var vertex = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                vertex[_i] = arguments[_i];
            }
            var v = this.vertex;
            vertex.forEach(function (item) {
                if (!v.includes(item)) {
                    v.push(item);
                    _this.neighbor.set(item, new Map());
                }
            });
        };
        /**
         * 添加边和加权值
         * @param vertex 顶点
         * @param neighbor 临点
         * @param forwardLevel 正向的加权值 vertex ---> neighbor
         * @param reverseLevel 返乡的加权值 neighbor ---> vertex（只有 isDirected = true 时才会设置）
         */
        Graph.prototype.addEdge = function (vertex, neighbor, forwardLevel, reverseLevel) {
            if (forwardLevel === void 0) { forwardLevel = 0; }
            if (reverseLevel === void 0) { reverseLevel = forwardLevel; }
            var _a, _b;
            var n = this.neighbor;
            if (!n.get(vertex)) {
                this.addVertex(vertex);
            }
            if (!n.get(neighbor)) {
                this.addVertex(neighbor);
            }
            // 设置林边和加权值
            (_a = n.get(vertex)) === null || _a === void 0 ? void 0 : _a.set(neighbor, forwardLevel);
            if (!this.isDirected) {
                // 设置反向的加权值
                (_b = n.get(neighbor)) === null || _b === void 0 ? void 0 : _b.set(vertex, reverseLevel);
            }
        };
        Graph.prototype.toString = function () {
            var v = this.vertex;
            var n = this.neighbor;
            v.forEach(function (vertex) {
                var _a;
                var neighbor = (_a = n.get(vertex)) === null || _a === void 0 ? void 0 : _a.keys();
                if (neighbor) {
                    console.log(vertex + " => " + Array.from(neighbor).join(" ") + "\n");
                }
            });
        };
        /**
         * 返回顶点与边的加权值，如果返回值是 -1 表示 vertex 没有 neighbor 这个临点
         * @param vertex 顶点
         * @param neighbor 边
         */
        Graph.prototype.getLevel = function (vertex, neighbor) {
            var n = this.neighbor;
            var neighborMap = n.get(vertex);
            if (!neighborMap)
                return -1;
            var level = neighborMap.get(neighbor);
            return typeof level === "number" ? level : -1;
        };
        Graph.prototype.initColor = function () {
            var color = new Map();
            this.vertex.forEach(function (v) {
                color.set(v, Color.WHITE);
            });
            return color;
        };
        Graph.prototype.bfs = function (startVertex, callback) {
            var v = this.vertex;
            var n = this.neighbor;
            if (!n.get(startVertex))
                throw Error("图中没有这个顶点");
            var colorMap = this.initColor();
            var queue = [startVertex];
            while (queue.length) {
                var now = queue.shift();
                colorMap.set(now, Color.GRAY);
                var neighbors = n.get(now);
                Array.from(neighbors.keys()).forEach(function (i) {
                    // 拿到所有的临边
                    if (colorMap.get(i) === Color.WHITE) {
                        colorMap.set(i, Color.GRAY);
                        queue.push(i);
                    }
                });
                colorMap.set(now, Color.BLACK);
                if (typeof callback === "function") {
                    callback(now);
                }
            }
            // 最后把没有探索到的孤立顶点（没有临点的）传给回调函数
            colorMap.forEach(function (value, key) {
                if (value === Color.WHITE) {
                    callback(key);
                }
            });
        };
        Graph.prototype.findSortestPath = function (start, end) {
            var n = this.neighbor;
            if (!n.get(start) || !n.get(end))
                return -1;
            if (start === end)
                return 0;
            var colorMap = this.initColor();
            var queue = [start];
            var prevVertex = new Map(); // 这个是用来追踪顶点
            var distance = 1; // 距离
            while (queue.length) {
                var now = queue.shift();
                colorMap.set(now, Color.GRAY);
                var neighbors = n.get(now);
                var vertices = Array.from(neighbors.keys());
                for (var i = 0; i < vertices.length; i++) {
                    var vertex = vertices[i];
                    if (colorMap.get(vertex) === Color.WHITE) {
                        prevVertex.set(vertex, now); // vertex 是由 now 节点得到
                        if (vertex === end) {
                            var node = prevVertex.get(vertex);
                            while (node && node !== start) {
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
        };
        Graph.prototype.dfs = function (startVertex, callback) {
            var v = this.vertex;
            var n = this.neighbor;
            if (!n.get(startVertex))
                throw Error("图中没有这个顶点");
            var colorMap = this.initColor();
            function deepVisit(now, colorMap, cb) {
                colorMap.set(now, Color.GRAY);
                cb(now);
                var neighbors = n.get(now);
                Array.from(neighbors.keys()).forEach(function (vertex) {
                    if (colorMap.get(vertex) === Color.WHITE) {
                        colorMap.set(vertex, Color.GRAY);
                        deepVisit(vertex, colorMap, cb);
                    }
                });
                colorMap.set(now, Color.BLACK);
            }
            ;
            for (var i = 0; i < v.length; i++) {
                if (colorMap.get(v[i]) === Color.WHITE) {
                    deepVisit(v[i], colorMap, callback);
                }
            }
        };
        return Graph;
    }());
})();
// test
var graph = new Graph();
graph.addVertex("A", "B", "C", "D");
graph.addVertex("H");
graph.addEdge("A", "B", 2);
graph.addEdge("B", "D", 3);
graph.addEdge("B", "E", 1);
graph.addEdge("C", "F", 4);
graph.addEdge("D", "F", 1);
graph.addEdge("D", "E", 2, 3);
graph.toString();
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
