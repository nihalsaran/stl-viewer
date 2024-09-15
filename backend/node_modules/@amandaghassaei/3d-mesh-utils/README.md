# @amandaghassaei/3d-mesh-utils
[![NPM Package](https://img.shields.io/npm/v/@amandaghassaei/3d-mesh-utils)](https://www.npmjs.com/package/@amandaghassaei/3d-mesh-utils)
[![Build Size](https://img.shields.io/bundlephobia/min/@amandaghassaei/3d-mesh-utils)](https://bundlephobia.com/result?p=@amandaghassaei/3d-mesh-utils)
[![NPM Downloads](https://img.shields.io/npm/dw/@amandaghassaei/3d-mesh-utils)](https://www.npmtrends.com/@amandaghassaei/3d-mesh-utils)
[![License](https://img.shields.io/npm/l/@amandaghassaei/3d-mesh-utils)](https://github.com/amandaghassaei/3d-mesh-utils/blob/main/LICENSE.txt)
![](https://img.shields.io/badge/Coverage-88%25-83A603.svg?prefix=$coverage$)

Geometry processing utility functions for 3D meshes – unit tested and written in TypeScript.

Used by the following libraries:
- [@amandaghassaei/stl-parser](https://www.npmjs.com/package/@amandaghassaei/stl-parser) - binary or ASCII .stl format parser
<!-- - [@amandaghassaei/obj-parser](https://www.npmjs.com/package/@amandaghassaei/obj-parser) - binary or ASCII .obj format parser -->
- [msh-parser](https://www.npmjs.com/package/msh-parser) - finite element .msh format parser


## Installation

### Install via npm

```sh
npm install @amandaghassaei/3d-mesh-utils
```

and import into your project:

```js
import {
  calcBoundingBox,
  mergeVertices,
} from '@amandaghassaei/3d-mesh-utils';
```

### Import into HTML

Import [bundle/3d-mesh-utils.min.js](https://github.com/amandaghassaei/3d-mesh-utils/blob/main/bundle/3d-mesh-utils.min.js) directly into your html:

```html
<html>
  <head>
    <script src="3d-mesh-utils.min.js"></script>
  </head>
  <body>
  </body>
</html>
```

`MESH_UTILS` will be accessible globally:

```js
const { calcBoundingBox, mergeVertices } = MESH_UTILS;
```


## Use

Full API documentation in [docs](https://github.com/amandaghassaei/3d-mesh-utils/tree/main/docs).


## License

This work is licensed under an [MIT License](https://github.com/amandaghassaei/3d-mesh-utils/blob/main/LICENSE.txt).


## Related Libraries

- [@amandaghassaei/stl-parser](https://www.npmjs.com/package/@amandaghassaei/stl-parser) - binary or ASCII .stl format parser
- [msh-parser](https://www.npmjs.com/package/msh-parser) - finite element .msh format parser


## Development

I don't have any plans to continue developing this package, but I'm happy to review pull requests if you would like to add a new feature / fix a bug.

To install dev dependencies:

```sh
npm install
```

To compile `src` to `dist`:

```sh
npm run build
```

### Testing

To run tests:

```sh
npm run test
```
