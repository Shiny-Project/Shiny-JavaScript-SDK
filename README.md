# Shiny JavaScript SDK

## 安装

`npm install shiny-sdk`


## 初始化

```JavaScript
var Shiny = require('shiny-sdk');
var shiny = new Shiny(API_KEY, API_SECRET_KEY, API_HOST='https://shiny.kotori.moe')
```

注意，`API_HOST`有默认值，如果需要手工指定，最后请勿带上斜杠。

## 方法

`shiny.add(spiderName, level, data)`

向Shiny提交新的事件。

参数说明：

| 参数名 | 参数类型 | 参数说明 | 
|-----|------|-----|
|spiderName| string| spider标识符|
|level| int | 事件等级 |
|data|object| 事件内容，包括title、content、cover、link|

会返回一个`Promise`对象，你懂得。


`shiny.recent`

查询最新事件。

会返回一个`Promise`对象，如果成功的话，`resolve`将会接受到一个数组。