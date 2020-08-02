// 迷宫问题

function createMaze(){
    var map = [];
    for(let i = 0;i < 8;i ++){
        map[i] = [];
        for(let j = 0;j < 8;j ++){
            if(i === 0 || i === 7){
                map[i].push(1);
            } else {
                j === 0 || j === 7 ? map[i].push(1) : map[i].push(0);
            }
        }
    }
    map[3][2] = 1;
    map[4][4] = 1;
    map[2][6] = 1;
    map[2][2] = 1;
    return map;
}

function getWay(map, i, j) {
    if(map[6][6] === 2){
        return true;
    }else if(map[i][j] === 0){
        map[i][j] = 2;  // 没有探测就设置成 2，表示已探测
        if(getWay(map, i + 1, j)){      // 向下探测
            return true;
        }
        if(getWay(map, i, j + 1)){      // 向右探测
            return true;
        }
        if(getWay(map, i - 1, j)){      // 向上探测
            return true;
        }
        if(getWay(map, i, j - 1)){      // 向左探测
            return true;
        }
        map[i][j] = 3;      // 3 表示探测的路径是死路
        return false;
    }else{
        return false;
    }
}


var map = createMaze();
var result = getWay(map, 1, 1);

for(let i = 0;i < 8;i ++){
    console.log(map[i].join(' '));
}

