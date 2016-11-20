var express = require('express');
var bodyParser = require('body-parser'); // fucking express

var cheerio = require('cheerio');
var superagent = require('superagent');

var globalCookie = undefined;

var username = undefined , userpw = undefined;

var app = express();
app.use(bodyParser());// fucking express
app.use(bodyParser.urlencoded({ extended: false })) // I just wanna use post & get ...

var server = app.listen(3000, function (){
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});

app.all('/hduoj',function(req,res){
    res.send('正在后台为您解题');
    console.log(req)
    username = req.body.n;
    userpw = req.body.p;
        console.log("UserName: " + username + "\nUserPassword: " + userpw)
    if (username != "" && userpw != "") {
        login(username,userpw);
    }
    else{
        console.log('kong');
    }
});

app.get('/', function (req, res) {
    res.send("<form action='hduoj' method='post' accept-charset='utf-8'><input type='text' name='n' placeholder='Your StudentID'><input type='password' name='p' placeholder='Your Password'><input type='submit' name='' value='OK'></form>");
});

// 模拟代码提交 
function post(code, problemId) { 
    superagent
    // 代码 post 的 url 
    .post('http://acm.hdu.edu.cn/submit.php?action=submit') 
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('user-agent', 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36') 
    .set("Cookie", globalCookie) 
    .send({"check": 0})
    .send({"language": 0})
    .send({"problemid": problemId}) 
    .send({"usercode": code}) 
    .end(function (err, sres) {
        if (err){console.log(err)}
    });
} 
 
// 从 csdn 题解详情页获取代码 
function getCode(solutionUrl, problemId) { 
    superagent.get(solutionUrl, function(err, sres) { 
        // 为防止该 solutionUrl 可能不是题解详情页 
        // 可能会没有 class 为 cpp 的 dom 元素 
        try{
            var $ = cheerio.load(sres.text); 
            // C++ 情况
            if ($('.cpp').eq(0).text()){
                var code = $('.cpp').eq(0).text();
            }
            // java 
            // var code = $('.java').eq(0).text();
            if ($('.java').eq(0).text()){
                var code = $('.cpp').eq(0).text();   
            }  

            // pre code 【markdown生成
            // 需过滤
            if (!code){return;} 
            post(code, problemId); 

        } catch(e) { 
            console.log(e)

        } 
  }); 
} 




// 模拟百度搜索题解 
function bdSearch(problemId) { 
    var searchUrl = 'https://www.baidu.com/s?ie=UTF-8&wd=hdu' + problemId; 
    superagent
    .get(searchUrl) 
    // 必带的请求头 
    .set("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36") 
    .end(function(err, sres) { 
        var $ = cheerio.load(sres.text); 
        var lis = $('.t a'); 
        for (var i = 0; i < 10; i++) { 
            var node = lis.eq(i); 
     
            // 获取那个小的 url 地址 
            var text = node.parent().next().next().children("a").text(); 
     
            // 如果 url 不带有 csdn 字样，则返回 
            if (text.toLowerCase().indexOf("csdn") === -1){continue;}

            // 题解详情页 url 
            var solutionUrl = node.attr('href'); 
            getCode(solutionUrl, problemId); 
        } 
    }); 
} 
 

 
 
 // 模拟登录 
function login() { 
    superagent
     // get 请求任意 acm.hdu.edu.cn 域名下的一个 url 
     // 获取 key 为 PHPSESSID 这个 Cookie 
    .get('http://acm.hdu.edu.cn/status.php') 
    .end(function(err, sres) { 
        // 提取 Cookie 
        var str = sres.header['set-cookie'][0]; 
        // 过滤响应头 Cookie 中的 path 字段 
        var pos = str.indexOf(';'); 
 

        // 全局变量存储 Cookie，post 代码提交时候用 
        globalCookie = str.substr(0, pos); 
 

        // 模拟登录 
        superagent 
        // 登录 url 
        .post('http://acm.hdu.edu.cn/userloginex.php?action=login') 
        // post 用户名 & 密码 
        .send({"username": username}) 
        .send({"userpass": userpw}) 
        // 这个请求头是必须的 
        .set("Content-Type", "application/x-www-form-urlencoded") 
        // 请求携带 Cookie 
        .set("Cookie", globalCookie) 
        .end(function(err, sres) { 
            // 登录完成后，启动程序 
            console.log("Successful Login : " + username);
            if (err != null){
                console.log(err) 
            } 
            // console.log(sres)
            start(); 
        });
    }); 
} 
 

 

 // 程序启动 
function start() {
    for (var i = 0; i <= 5600; i++) { 
        var problemId = i , delay = (i - 1000)*10000; 
        (function(delay, problemId) { 
            setTimeout(function() { 
                bdSearch(problemId);   
            }, delay);
        }(delay, problemId)); 
    } 
} 

// OOP
// Brain(Main) - CodeFinder - Submitter
// var CodeFinder = {}
// var Submitter = {}

// CodeFinder.bdSearch = function (problemId) { 
//  var searchUrl = 'https://www.baidu.com/s?ie=UTF-8&wd=hdu' + problemId; 

//      superagent 
//     .get(searchUrl) 
//     // 必带的请求头 
//     .set("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36") 
//     .end(function(err, sres) { 
//      var $ = cheerio.load(sres.text); 
//          var lis = $('.t a'); 
//          for (var i = 0; i < 10; i++) { 
//          var node = lis.eq(i)
     
//          // 获取那个小的 url 地址 
//          var text = node.parent().next().next().children("a").text()
     

//          // 如果 url 不带有 csdn 字样，则返回 
//          if (text.toLowerCase().indexOf("csdn") === -1){continue}

//          // 题解详情页 url 
//          var solutionUrl = node.attr('href')
//          getCode(solutionUrl, problemId)
//          } 
//     })
// } 
//  