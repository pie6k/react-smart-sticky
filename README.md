# React Smart Sticky

![alt tag](https://timpler.github.io/react-smart-sticky/examples/src/animation.gif)

[Online Demo](https://timpler.github.io/react-smart-sticky/examples/dist/)


## Features

* Works like topbars in native applications (Facebook, Medium.com, Instagram etc.)
* Works on mobile devices
* Topbar dissappears 'with the flow' of scrolling - if you'll stop scrolling - sticky element will stop it's movement too.


## Usage

```sh
npm install react-smart-sticky --save
```

```js
import SmartSticky from 'react-smart-sticky';

...

<SmartSticky>
  <div>Some topbar content or whatever you need</div>
</SmartSticky>
```

## Additional options

```js
<SmartSticky tolerance={50}>
  <div>Some topbar content or whatever you need</div>
</SmartSticky>
```

`tolerance` is ammount of pixels needed to be scrolled before sticky element will start to show/hide.

## Licence

MIT
