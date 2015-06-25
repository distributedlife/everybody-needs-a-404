# Everybody needs a 404

A simple web proxy that lets you either return a status code for all requests or alter the response.

I use when testing out specific scenarios on mobile applications. I point the mobile app at this proxy, the proxy forwards the request, the proxy modifies the response before responding itself.

## How to return a status code.

```text
/setMode/404
```

Now all responses return 404.

```text
/setMode/200
```

Behaviour returns to normal

## How to alter the response

```javascript
var _  = require('lodash');
function filterOutASpecificRecord (body) {
  var json = JSON.parse(body);

  json.records = _.reject(json.records, {id: 37});

  return json;
}

var proxy = require('everybody-needs-a-404');
proxy.modify('/records', filterOutASpecificRecord);
proxy.go();
```

Now set the mode to altered and we are away.

```text
/setMode/altered
```