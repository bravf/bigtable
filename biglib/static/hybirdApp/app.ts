// 公共配置
import devTool from './dev-tools/webViewSimulator';

if ('@{FEDOG.ENV}' == 'LOCAL') {
    devTool();
}
