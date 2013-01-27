function Texture(names, opts) {
  if (!(this instanceof Texture)) return new Texture(names, opts);
  opts = opts || {};
  if (!isArray(name)) {
    opts = names;
    names = null;
  }
  this.THREE = opts.THREE || require('three');
  this.texturePath = opts.texturePath || '/textures/';
  this.materialParams = opts.materialParams || false;
  this.materialType = opts.materialType || this.THREE.MeshLambertMaterial;
  if (names) this.loadTexture(names);
}
module.exports = Texture;

Texture.prototype.loadTexture = function(data, opts) {
  var self = this;

  opts = opts || {};
  opts.materialType = opts.materialType || this.materialType;
  opts.materialParams = opts.materialParams || this.materialParams;

  if (typeof data === 'string') data = [data];
  if (!isArray(data)) {
    data = [data.back, data.front, data.top, data.bottom, data.left, data.right];
  }
  // load the 0 texture to all
  if (data.length === 1) data = [data[0],data[0],data[0],data[0],data[0],data[0]];
  // 0 is top/bottom, 1 is sides
  if (data.length === 2) data = [data[1],data[1],data[0],data[0],data[1],data[1]];
  // 0 is top, 1 is bottom, 2 is sides
  if (data.length === 3) data = [data[2],data[2],data[0],data[1],data[2],data[2]];
  // 0 is top, 1 is bottom, 2 is front/back, 3 is left/right
  if (data.length === 4) data = [data[2],data[2],data[0],data[1],data[3],data[3]];
  data = data.map(function(name, i) {
    var tex = self.THREE.ImageUtils.loadTexture(self.texturePath + ext(name));
    var params = {
      map: tex,
      ambient: 0xbbbbbb
    };
    if (opts.materialParams) Object.keys(opts.materialParams).forEach(function(key) {
      params[key] = opts.materialParams[key]
    })
    self._applyTextureSettings(tex);
    var mat = new opts.materialType(params);
    // rotate front and left 90 degs
    if (self._loadingMesh === true && (i === 1 || i === 4)) self.rotate(mat, 90);
    return mat;
  });
  return (self._loadingMesh !== true) ? new self.THREE.MeshFaceMaterial(data) : data;
};

Texture.prototype.loadTextures = function(names, opts) {
  var self = this;
  self._loadingMesh = true;
  self.material = new self.THREE.MeshFaceMaterial(
    [].concat.apply([], names.map(function(name) {
      return self.loadTexture(name, opts);
    }))
  );
  self._loadingMesh = false;
  return self.material;
};

Texture.prototype.applyTextures = function(geom) {
  var self = this;
  if (!self.material) return;
  var textures = self.material.materials;
  geom.faces.forEach(function(face) {
    var c = face.vertexColors[0];
    var index = Math.floor(c.b*255 + c.g*255*255 + c.r*255*255*255);
    index = (Math.max(0, index - 1) % (textures.length / 6)) * 6;

    // BACK, FRONT, TOP, BOTTOM, LEFT, RIGHT
    if      (face.normal.z === 1)  index += 1;
    else if (face.normal.y === 1)  index += 2;
    else if (face.normal.y === -1) index += 3;
    else if (face.normal.x === -1) index += 4;
    else if (face.normal.x === 1)  index += 5;

    face.materialIndex = index;
  });
};

Texture.prototype.rotate = function(material, deg) {
  var self = this;
  deg = deg || 90;
  if (material.map && material.map.image) material.map.image.onload = function() {
    var canvas    = document.createElement('canvas');
    canvas.width  = this.width;
    canvas.height = this.height;
    var ctx       = canvas.getContext('2d');

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(Math.PI / 180 * deg);
    ctx.drawImage(this, -(canvas.width / 2), -(canvas.height / 2));

    material.map = new self.THREE.Texture(canvas);
    self._applyTextureSettings(material.map);
    material.map.needsUpdate = true;
  };
};

Texture.prototype._applyTextureSettings = function(tex) {
  tex.magFilter = this.THREE.NearestFilter;
  tex.minFilter = this.THREE.LinearMipMapLinearFilter;
  tex.wrapT     = this.THREE.RepeatWrapping;
  tex.wrapS     = this.THREE.RepeatWrapping;
};

function ext(name) {
  return (name.indexOf('.') !== -1) ? name : name + '.png';
}

// copied from https://github.com/joyent/node/blob/master/lib/util.js#L433
function isArray(ar) {
  return Array.isArray(ar) || (typeof ar === 'object' && Object.prototype.toString.call(ar) === '[object Array]');
}
