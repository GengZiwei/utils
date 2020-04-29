自己在开发过程中遇到一些方法跟封装的库

## axios

### axios的请求

```javascript
import http "@/axios/index"

http.request({
  url: "HttpURL"
})
.then(() =>{})
.catch((e) => {
  if(e.cancel) {return ;} // 当前请求为重复请求自动取消
})

```

### axios清空请求

```javascript

import http "@/axios/index"

http.clearPending()

```

### 时间格式化

```javascript

import Format "@/format/index"

Format(Date.now()., 'yyyy/MM/dd hh:mm:ss') // 2020/04/29 16:50:00

```

### 本地存储

```javascript

import { setStorage } "@/storage/index"

setStorage("key", {a: 1}) //        localStorage    key '{"a": 1}'
setStorage("key", {a: 1}, false) // sessionStorage  key '{"a": 1}'

```