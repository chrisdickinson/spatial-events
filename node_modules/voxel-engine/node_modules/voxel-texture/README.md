# voxel-texture

> A texture helper for [voxeljs](http://voxeljs.com).

View [the demo](http://shama.github.com/voxel-texture).

## example
```js
// Create a texture engine
var createMaterials = require('voxel-texture');

// Create 6 sided material, all sides same texture
var materials = createMaterials('grass');
```

This will load `'/textures/grass.png'`. Change the texture path with:
```js
var textureEngine = require('voxel-texture')({texturePath: '/textures/'});
var materials = textureEngine.loadTexture('grass');
```

Then you can use the materials like such:
```js
var cube = new game.THREE.Mesh(
  new game.THREE.CubeGeometry(game.cubeSize, game.cubeSize, game.cubeSize),
  materials
);
```

OR specify each side of the material:
```js
var materials = createMaterials([
  'grass',      // BACK
  'dirt',       // FRONT
  'brick',      // TOP
  'bedrock',    // BOTTOM
  'glowstone',  // LEFT
  'obsidian'    // RIGHT
]);
```

OR just the top and sides:
```js
var materials = createMaterials([
  'grass',      // TOP/BOTTOM
  'grass_dirt', // SIDES
]);
```

OR the top, bottom and sides:
```js
var materials = createMaterials([
  'grass',      // TOP
  'dirt',       // BOTTOM
  'grass_dirt', // SIDES
]);
```

OR the top, bottom, front/back and left/right:
```js
var materials = createMaterials([
  'grass',      // TOP
  'dirt',       // BOTTOM
  'grass_dirt', // FRONT/BACK
  'brick',      // LEFT/RIGHT
]);
```

OR if your memory sucks like mine:
```js
var materials = createMaterials({
  top:    'grass',
  bottom: 'dirt',
  left:   'grass_dirt',
  right:  'grass_dirt',
  front:  'grass_dirt',
  back:   'grass_dirt'
});
```
_Just be sure to include all the keys_

### Alternate File Extension

If your texture isn't a `.png`, just specify the extension:
```js
var materials = createMaterials([
  'diamond',
  'crate.gif',
]);
```

### voxel meshes

To load up multiple texture sets onto a voxel mesh:
```js
var textureEngine = require('voxel-texture');

// load up each block type / texture
textureEngine.loadTextures([
  // grass on top
  // dirt on bottom
  // grass_dirt on sides
  ['grass', 'dirt', 'grass_dirt'],

  // all brick
  'brick',

  // all obsidian
  'obsidian'
]);

// var mesh = ... build your voxel mesh

// apply textures to the mesh
textureEngine.applyTextures(mesh.geometery);
```

### rotate textures
Sometimes the orientation of the textures needs adjusting:

```js
var textureEngine = require('voxel-texture')

var materials = textureEngine.loadTexture(['grass', 'dirt', 'grass_dirt']);
materials.forEach(function(material) {
  // rotate texture 90 degrees
  textureEngine.rotate(material, 90);
});
```

## install
With [npm](http://npmjs.org) do:

```
npm install voxel-texture
```

## release history
* 0.2.2 - ability to set material type and params. thanks @hughsk!
* 0.2.1 - fix rotation of front and left textures when loading mesh
* 0.2.0 - ability to set multiple textures on voxel meshes
* 0.1.1 - fix texture sharpness
* 0.1.0 - initial release

## license
Copyright (c) 2013 Kyle Robinson Young  
Licensed under the MIT license.
