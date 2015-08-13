# Everybody needs a 404

A simple web proxy that lets you either return a status code for all requests or alter the response.

I use when testing out specific scenarios on mobile applications. I point the mobile app at this proxy, the proxy forwards the request, the proxy modifies the response before responding itself.

## How to return a status code.

```text
http://localhost:3000/setMode/404
```

Now all responses return 404.

```text
http://localhost:3000/setMode/200
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
proxy.go('http://the-original-service.com:23423');
```

Now set the mode to altered and we are away.

```text
http://localhost:3000/setMode/altered
```

## How to rewrite a url

```javascript
var _  = require('lodash');
function newUrl (req) {
  return "/newPath";
}

var proxy = require('everybody-needs-a-404');
proxy.rewriteUrl('/records/:id', newUrl);
proxy.go('http://the-original-service.com:23423');
```

Now set the mode to altered and we are away.

```text
http://localhost:3000/setMode/altered
```


## How to rewrite a url AND change the respond

```javascript
var _  = require('lodash');
function newUrl (req) {
  return "/newPath";
}

function filterOutASpecificRecord (body) {
  var json = JSON.parse(body);

  json.records = _.reject(json.records, {id: 37});

  return json;
}

var proxy = require('everybody-needs-a-404');
proxy.rewriteUrl('/records/:id', newUrl, filterOutASpecificRecord);
proxy.go('http://the-original-service.com:23423');
```

Now set the mode to altered and we are away.

```text
http://localhost:3000/setMode/altered
```


## How to slow down responses

```text
http://localhost:3000/setDelay/1000
```

Now all requests will pause for a second before responding

```text
http://localhost:3000/setDelay/0
```

Behaviour returns to normal.


## What's with the name
[Everybody Needs a 303](https://www.youtube.com/watch?v=o6eIBE7Bo3U). If the link doesn't work. Google it.
