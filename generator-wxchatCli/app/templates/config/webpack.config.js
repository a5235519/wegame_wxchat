// 基本配置环境
var webpack = require('webpack');
var path = require('path');
var fs = require('fs')
var argv = require('yargs').argv;
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

var utils = require('./utils');

var isProd = process.env.NODE_ENV === 'production';

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

// 读取入口
function getEntry(dir, entryFile) {
	const files = fs.readdirSync(dir)
	return files.reduce((res, k) => {
		const page = path.resolve(dir, k, entryFile)
		if (fs.existsSync(page)) {
			res[k] = page
		}
		return res
	}, {})
}

// CSS加载器
const cssUse = [
	{
    	loader: 'css-loader',
    	options: {
    		minimize: true
    	}
    },
    {
    	loader: 'sass-loader',
    	options: {
    		minimize: true
    	}
    },
    {
    	loader: 'px2rpx-loader',
	    options: {
	      baseDpr: 1,
	      rpxUnit: 1
	    }
    },
    {
    	loader: 'postcss-loader',
	    options: {
	      sourceMap: true
	    }
    }
];

const appEntry = { app: resolve('./src/main.js') }
const pagesEntry = getEntry(resolve('./src/pages'), 'main.js')
const entry = Object.assign({}, appEntry, pagesEntry)

module.exports = {
	// 多入口配置
	entry: entry,

	// 构建目标
	target: require('mpvue-webpack-target'),

	// 输出
	output: {
		path: resolve('dist'),
		filename: 'static/js/[name].js',
		chunkFilename: 'static/js/[id].js',
		publicPath: '/'
	},

	// 解析
	resolve: {
		extensions: ['.js', '.vue', '.json'],	// 自动解析确定的扩展
		// 模块的快速引用
		alias: {
			'vue': 'mpvue',
			'@': resolve('src'),
			'@css': resolve('src/assets/css')
		},
		symlinks: false
	},

	devtool: (isProd ? false : '#source-map'),

	// 加载器
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
                    fallback: 'vue-style-loader',
                    use: cssUse
                })
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
                    fallback: 'vue-style-loader',
                    use: cssUse
                })
			},
			{
				test: /\.vue$/,
				loader: 'mpvue-loader',
				options: {
					loaders: utils.cssLoaders({
					    sourceMap: false
					})
				}
			},
			{
		        test: /(\.jsx|\.js)$/,
		        include: [resolve('src'), resolve('test')],
		        use: [
		        	'babel-loader',
			        {
				        loader: 'mpvue-loader',
				        options: {
					        checkMPEntry: true
					    }
			        },
		        ],
		    },
		    {
		        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
		        loader: 'url-loader',
		        options: {
		          limit: 25600,
		          name: '[name].[ext]',
		          outputPath: 'static/images/',
		        }
		    },
		    {
		        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
		        loader: 'url-loader',
		        options: {
		          limit: 10000,
		          name: '[name].[ext]',
		          outputPath: 'static/media/',
		        }
		    },
		    {
		        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
		        loader: 'url-loader',
		        options: {
		          limit: 100000,
		          name: '[name].[ext]',
		          outputPath: 'static/fonts/',
		        }
		    }
		]
	},

	plugins: [
		new ExtractTextPlugin({
	      filename: 'static/css/[name].wxss'
	    }),

	    new webpack.optimize.CommonsChunkPlugin({
		  name: 'vendor',
		  minChunks: function (module, count) {
		    // any required modules inside node_modules are extracted to vendor
		    return (
		      module.resource &&
		      /\.js$/.test(module.resource) &&
		      module.resource.indexOf('node_modules') >= 0
		    ) || count >= 2
		  }
		}),

	    new webpack.optimize.CommonsChunkPlugin({
	        name: "manifest",
	        chunks: ['vendor']
	    }),

	    new webpack.NoEmitOnErrorsPlugin(),

	    new FriendlyErrorsPlugin()
	]

}
