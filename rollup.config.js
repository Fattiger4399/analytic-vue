import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default{
    input:'./src/index.js',//入口文件
    output:{
        file:'dist/vue.js',
        format:'umd', //在window上Vue
        name:'Vue',
        sourcemap:true
    },
    plugins:[
        babel({
            exclude:'node_modules/**'
        }),
        serve({ //3000
            port:3000,
            contentBase:'',//当前目录为基准
            openPage:'/watch.html'
        })
    ]
}