# x-www-form-urlencode

### javascript api

```javascript
var xform = require('x-www-form-urlencode')

xform.encode(' %&+£€')
// "+%25%26%2B%C2%A3%E2%82%AC"

xform.decode('+%25%26%2B%C2%A3%E2%82%AC')
// " %&+£€"

xform.encode('\n');
// "%0D%0A"

xform.encode('\r')
// "%0D%0A"

xform.encode('\r\n')
// "%0D%0A"

xform.decode('%0D%0A')
// "\n"
```
