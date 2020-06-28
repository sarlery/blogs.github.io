var G = (function () {
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
            vertex.forEach(function (item) {
                if (!_this.vertex.includes(item)) {
                    _this.vertex.push(item);
                    _this.neighbor.set(item, new Set());
                }
            });
        };
        Graph.prototype.addEdge = function (vertex) {
            var _this = this;
            var neighbor = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                neighbor[_i - 1] = arguments[_i];
            }
            var n = this.neighbor;
            if (!n.get(vertex)) {
                this.addVertex(vertex);
            }
            neighbor.forEach(function (item) {
                if (!n.get(item)) {
                    _this.addVertex(item);
                }
            });
            neighbor.forEach(function (item) { var _a; return (_a = n.get(vertex)) === null || _a === void 0 ? void 0 : _a.add(item); });
            if (!this.isDirected) {
                neighbor.forEach(function (item) {
                    var _a;
                    (_a = n.get(item)) === null || _a === void 0 ? void 0 : _a.add(vertex);
                });
            }
        };
        Graph.prototype.toString = function () {
            var neighbor = this.neighbor;
            var vertex = this.vertex;
            for (var i = 0; i < vertex.length; i++) {
                var nSet = neighbor.get(vertex[i]);
                var str = Array.from(nSet.values()).join(" ");
                console.log(vertex[i] + " --> " + str + "\n");
            }
        };
        Graph.prototype.initColor = function () {
            var color = new Map();
            this.vertex.forEach(function (item) {
                color.set(item, Color.WHITE);
            });
            return color;
        };
        Graph.prototype.bfs = function (startVertex, callback) {
            var vertex = this.vertex;
            var neighbor = this.neighbor;
            // 数组中没有传入的顶点
            if (!vertex.includes(startVertex))
                return;
            var queue = [startVertex]; // 设置一个队列，用来存放顶点
            var colorMap = this.initColor(); // 拿到初始化的顶点状态
            // 遍历顶点
            while (queue.length) {
                var now = queue.shift(); // 出队
                // 当还没有遍历整个顶点时
                colorMap.set(now, Color.GRAY);
                // 获取到顶点的 临点，添加到队列里
                var neighbors = neighbor.get(now);
                neighbors.forEach(function (n) {
                    if (colorMap.get(n) === Color.WHITE) {
                        colorMap.set(n, Color.GRAY);
                        queue.push(n);
                    }
                });
                // 别忘了设置状态，表示该顶点已探索
                colorMap.set(now, Color.BLACK);
                // 把探索到的顶点传给回调函数做进一步的操作
                if (typeof callback === "function")
                    callback(now);
            }
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
                var vertices = Array.from(neighbors.values());
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
            var vertex = this.vertex;
            var neighbor = this.neighbor;
            var deepVisit = function (node, colorMap) {
                colorMap.set(node, Color.GRAY);
                if (typeof callback === "function")
                    callback(node);
                var neighbors = neighbor.get(node);
                neighbors.forEach(function (n) {
                    if (colorMap.get(n) === Color.WHITE) {
                        deepVisit(n, colorMap);
                    }
                });
                colorMap.set(node, Color.BLACK);
            };
            if (!vertex.includes(startVertex))
                return;
            var colorMap = this.initColor();
            for (var i = 0; i < vertex.length; i++) {
                if (colorMap.get(vertex[i]) === Color.WHITE) {
                    // 只有是白色时才遍历，这说明这个顶点还没有被访问
                    deepVisit(vertex[i], colorMap);
                }
            }
        };
        return Graph;
    }());
})();
var graph = new G();
graph.addVertex("A", "B", "C", "D");
graph.addVertex("H");
graph.addEdge("A", "B");
graph.addEdge("B", "D");
graph.addEdge("B", "E");
graph.addEdge("C", "F");
graph.addEdge("D", "F");
graph.addEdge("D", "E");
graph.toString();
