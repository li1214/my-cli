
const figlet = require('figlet');
const lolcatjs = require('lolcatjs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const json2ts = require("json2ts");
const ora = require('ora');
const fs = require("fs");
const shell= require('shelljs');
const gitDownload = require('download-git-repo');
const { Command } = require('commander');

const templateUrl = "direct:https://github.com/li1214/VueComponents.git";
const version = 'v0.0.1';
const _rootPath = shell.pwd();

function getJson(url) {
  const text = fs.readFileSync("./data.json",'utf-8');
  return text
}
// 打印logo
function printLogo() {
  const logo = figlet.textSync('VXI-CLI', {
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
  }) + '\n' + " Vxi脚手架 " + version

  lolcatjs.options.seed = Math.round(Math.random() * 1000);
  lolcatjs.options.colors = true;

  console.log(lolcatjs.fromString(logo))

}
const bindHandler = {
  version (){
    printLogo()
  },
  init() {
    printLogo()
    inquirer.prompt([
      {
        type: "text",
        message: "请输入文件夹名称",
        name: "dirname"
      },
      {
        type: 'list',
        message: '请选择项目使用语言',
        name:'jskind',
        choices: ["ES6","ES5","TypeScript"]
      },
      {
        type: ["list"],
        name: 'vueVersion',
        message: '请选择Vue版本',
        choices:["vue2","vue3"]
      }
    ])
      .then(({dirname}) => {
        if(dirname){
          const spinner = ora('⏰ 正在帮您初始化项目，请稍后...').start();
          shell.rm("-rf",dirname);
          shell.mkdir(dirname);
          gitDownload(templateUrl,shell.pwd() + '/' + dirname,{clone:true},(err)=>{
            spinner.stop()
            if(err){
              console.log(chalk.red("🤮 vxi-cli启动异常", err))
            } else {
              shell.sed("-i","NOTES",dirname,_rootPath +'/'+dirname+"/package.json")
            }
          })
        }
      })
      .catch((error) => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
        } else {
          // Something else went wrong
        }
      });
  },
  json2ts(url) {
    const spinner = ora('⏰ 正在帮您生成TypeScript代码中，请稍后...').start();
    const json = getJson(url)
    const result = json2ts.convert(json);
    // console.log(result)

    setTimeout(() => {
      spinner.stop()
    }, 3000);
  }
}
// 处理用户参数
function dealParms(argv) {
  const program = new Command();
  program.version(version)
  program
  .option("init", "💜初始化项目项目")
  .option("json2ts","👽JSON数据生成TS接口")
  

  program.usage("<cmd> [env]")
    .arguments("<cmd> [env]")
    .action((cmd, parms) => {
      const handler = bindHandler[cmd]
      if(handler) {
        handler(parms)
      }else {
        console.log(chalk.yellow(`😿非常遗憾[${chalk.red(cmd)}]暂未实现!`))
      }
    })
  program.parse(argv);
}


export async function cli(argv) {
  dealParms(argv)

}

