#!/usr/bin/env node

const program = require('commander');
const axios = require('axios');
const querystring = require('querystring');
const colors = require('colors');

const KEY = '534ac7d9d3ef4a16171bc420d823fd4c';

const hotCitys = [
    "北京",
    "上海",
    "广州",
    "深圳"
];

colors.setTheme({
    key: 'cyan',
    value: 'yellow',
    line: 'green'
});

program.version('0.0.1');

function cityList(value) {
    return value.split(',');
}

function getCitys(value, dummyPrevious) {
    return dummyPrevious.concat([value]);
}

program
    .option('-c, --city <city>', 'input a city name', getCitys, [])
    .option('-l, --list <list>', 'input a city list and Each city is separated by commas', cityList)
    .option('-n, --now', 'get where you are now')
    .option('--hot', 'get hot city information')

program.parse(process.argv);


if (program.city.length) {
    getCityListInfo(program.city);
}

if(program.now){
    axios.get(`https://restapi.amap.com/v3/ip?key=${KEY}`)
    .then(res => {
        if (res.data.status) {
            return res.data.city;
        }
    })
    .then(cityName => searchCityCode(cityName))
}

if (program.list) {
    getCityListInfo(program.list);
} else if (program.hot) {
    getCityListInfo(hotCitys);
} else {
    console.log(program.help);
}

// 对多个城市做并发请求
function getCityListInfo(citys) {
    for (let i = 0, len = citys.length; i < len; i++) {
        searchCityCode(citys[i])
    }
}

// 查询城市编码
function searchCityCode(city) {
    // 行政查询
    axios.get(`https://restapi.amap.com/v3/config/district?keywords=${querystring.escape(city)}&subdistrict=0&key=${KEY}`)
        .then(res => {
            if (res.status === 200 && res.data.status == 1) {
                const info = res.data;
                return info.districts[0].adcode;
            }
        }).then(cityCode => getWeatherInfo(cityCode))
}

// 获得天气信息
function getWeatherInfo(cityCode) {
    axios.get(`https://restapi.amap.com/v3/weather/weatherInfo?extensions=all&city=${cityCode}&key=${KEY}`)
        .then(res => {
            return res.data.forecasts[0];
        })
        .then(info => renderInfo(info))
}

// 将天气信息展示出来
function renderInfo(info) {
    var casts = info.casts;
    var arr = ["城市","标注","白天温度","夜间温度","天气","风向","风力","日期"];

    var str = '';
    for(let p of arr){
        str = str + p + '\t\t';
    }
    console.log(str.yellow);
    console.log("--------------------------------------------------------------------------------------------------------------------------------------------".line);

    for(let k = 0;k < 3;k ++){
        var obj = {};
        obj['城市'] = info.city;
        switch(k){
            case 0:
                obj['标注'] = '今天';
                break;
            case 1:
                obj['标注'] = '明天';
                break;
            case 2:
                obj['标注'] = '后天';
                break;
        }
        obj['白天温度'] = casts[k].daytemp + '度';
        obj['夜间温度'] = casts[k].nighttemp + '度';
        obj['天气'] = casts[k].dayweather;
        obj['风向'] = casts[k].daywind + '风';
        obj['风力'] = casts[k].daypower;
        obj['日期'] = casts[k].date;

        showConsole(obj);
    }
    console.log('\n');
}

function showConsole(obj){
    let valStr = '',
        count = 0;

    for (let p in obj) {
        if (count >= 2 && count < 4) {
            valStr = valStr + obj[p] + '\t\t\t';
        } else {
            valStr = valStr + obj[p] + '\t\t';
        }
        count++;
    }

    console.log(valStr.cyan);
    console.log("--------------------------------------------------------------------------------------------------------------------------------------------".line);
}
