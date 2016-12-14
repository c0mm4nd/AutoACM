var program = require('commander');
var packageInfo = require("./package");
var hdu = require("./schools/hdu")
var globalCookie = undefined;

// var username = undefined , userpw = undefined;

// 做纯粹的Terminal应用 2016-12-14


var fork = require('child_process').fork; // 任务执行器
// var child = fork('./test/1.js');
var username,password
function get_user_name(u_n){
	username = u_n
}
function get_password(p_w){
	password = p_w
}

function login(){
	// console.log(username + password)
	if (username && password){

	}
}

program
	.version(packageInfo.version)
	.usage('[options]' )
	.option('-u, --user [username]', 'Input your user name', get_user_name)
	.option('-p, --password [password]', 'Input your password',get_password)
	.option('-b, --bbq-sauce', 'Add bbq sauce', test)
	.option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
	.parse(process.argv);

var args=[];
// if (argv[2] == undefined){
//     console.log(help)
// }else{
// 	try{
// 		process.argv.forEach((val, index) => {
// 			if (index >=2 && !(index % 2) ){ 
// 				if 
// 				args[val] = argv[(index + 1)]}
// 		});
// 		console.log(args)
// 	}catch(e){console.log(e)}
// }
