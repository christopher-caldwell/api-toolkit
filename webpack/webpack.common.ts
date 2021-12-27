import path from 'path'
import serverlessWebpack from 'serverless-webpack'
import { Configuration } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import nodeExternals from 'webpack-node-externals'
import CopyWebpackPlugin from 'copy-webpack-plugin'

const config: Configuration = {
  stats: 'minimal',
  context: path.resolve(process.cwd()),
  entry: serverlessWebpack.lib.entries,
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'lambdas/'),
      '@generated': path.resolve(process.cwd(), 'generated/')
    },
    extensions: ['.js', '.json', '.ts']
  },
  externals: [nodeExternals()],
  plugins: [new CopyWebpackPlugin({ patterns: ['./prisma/schema.prisma'] })],
  target: 'node',
  module: {
    rules: [
      {
        test: /\.sql/,
        type: 'asset/source'
      },
      {
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        }
      }
    ]
  }
}

if (process.env.ANALYZE) {
  config.plugins?.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static'
    })
  )
}

export default config
