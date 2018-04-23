// cuon-matrix.js (c) 2012 kanda and matsuda
/** 
 * 4x4ã?®è¡Œåˆ—ã‚’å®Ÿè£…ã?—ã?Ÿã‚¯ãƒ©ã‚¹ã€‚
 * OpenGLã?®è¡Œåˆ—ã‚¹ã‚¿ãƒƒã‚¯ã?¨å?Œç­‰ã?®æ©Ÿèƒ½ã‚’å‚™ã?ˆã?¦ã?„ã‚‹ã€‚
 * å¤‰æ?›å¾Œã?®è¡Œåˆ—ã?¯ã€?å¤‰æ?›è¡Œåˆ—ã‚’å?³ã?‹ã‚‰ã?‹ã?‘ã‚‹ã?“ã?¨ã?§è¨ˆç®—ã?•ã‚Œã‚‹ã€‚
 * è¨ˆç®—ã?—ã?Ÿçµ?æžœã?§ã€?è¡Œåˆ—ã?®å†…å®¹ã?Œç½®ã??æ?›ã?ˆã‚‰ã‚Œã‚‹ã€‚
 */

/**
 * Matrix4ã?®ã‚³ãƒ³ã‚¹ãƒˆãƒ©ã‚¯ã‚¿ã€‚
 * æ–°ã?—ã??ç”Ÿæˆ?ã?•ã‚Œã‚‹è¡Œåˆ—ã?¯ã€?opt_srcã?«Matrix4ã?®ã‚¤ãƒ³ã‚¹ã‚¿ãƒ³ã‚¹ã?Œæ¸¡ã?•ã‚Œã?Ÿå ´å?ˆã€?ã??ã?®è¦?ç´ ã?Œã‚³ãƒ”ãƒ¼ã?•ã‚Œã?¦åˆ?æœŸåŒ–ã?•ã‚Œã‚‹ã€‚
 * ã??ã‚Œä»¥å¤–ã?®å ´å?ˆã€?å?˜ä½?è¡Œåˆ—ã?«åˆ?æœŸåŒ–ã?•ã‚Œã‚‹ã€‚
 * @param opt_src è¦?ç´ ã‚’ã‚³ãƒ”ãƒ¼ã?—ã?¦ã??ã‚‹è¡Œåˆ—ï¼ˆã‚ªãƒ—ã‚·ãƒ§ãƒ³ï¼‰
 */
var Matrix4 = function(opt_src) {
  var i, s, d;
  if (opt_src && typeof opt_src === 'object' && opt_src.hasOwnProperty('elements')) {
    s = opt_src.elements;
    d = new Float32Array(16);
    for (i = 0; i < 16; ++i) {
      d[i] = s[i];
    }
    this.elements = d;
  } else {
    this.elements = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
  }
};

/**
 * å?˜ä½?è¡Œåˆ—ã?«è¨­å®šã?™ã‚‹ã€‚
 * @return this
 */
Matrix4.prototype.setIdentity = function() {
  var e = this.elements;
  e[0] = 1;   e[4] = 0;   e[8]  = 0;   e[12] = 0;
  e[1] = 0;   e[5] = 1;   e[9]  = 0;   e[13] = 0;
  e[2] = 0;   e[6] = 0;   e[10] = 1;   e[14] = 0;
  e[3] = 0;   e[7] = 0;   e[11] = 0;   e[15] = 1;
  return this;
};

/**
 * æ¸¡ã?•ã‚Œã?Ÿè¡Œåˆ—ã?®è¦?ç´ ã‚’ã‚³ãƒ”ãƒ¼ã?™ã‚‹ã€‚
 * @param src è¦?ç´ ã‚’ã‚³ãƒ”ãƒ¼ã?—ã?¦ã??ã‚‹è¡Œåˆ—
 * @return this
 */
Matrix4.prototype.set = function(src) {
  var i, s, d;

  s = src.elements;
  d = this.elements;

  if (s === d) {
    return;
  }
    
  for (i = 0; i < 16; ++i) {
    d[i] = s[i];
  }

  return this;
};

/**
 * æ¸¡ã?•ã‚Œã?Ÿè¡Œåˆ—ã‚’å?³ã?‹ã‚‰ã?‹ã?‘ã‚‹ã€‚
 * @param other ã?‹ã?‘ã‚‹è¡Œåˆ—
 * @return this
 */
Matrix4.prototype.concat = function(other) {
  var i, e, a, b, ai0, ai1, ai2, ai3;
  
  // e = a * b ã‚’è¨ˆç®—ã?™ã‚‹
  e = this.elements;
  a = this.elements;
  b = other.elements;
  
  // eã?¨bã?Œå?Œã?˜å ´å?ˆã€?bã?®å†…å®¹ã‚’ä¸€æ™‚çš„ã?ªé…?åˆ—ã?«ã‚³ãƒ”ãƒ¼ã?™ã‚‹
  if (e === b) {
    b = new Float32Array(16);
    for (i = 0; i < 16; ++i) {
      b[i] = e[i];
    }
  }
  
  for (i = 0; i < 4; i++) {
    ai0=a[i];  ai1=a[i+4];  ai2=a[i+8];  ai3=a[i+12];
    e[i]    = ai0 * b[0]  + ai1 * b[1]  + ai2 * b[2]  + ai3 * b[3];
    e[i+4]  = ai0 * b[4]  + ai1 * b[5]  + ai2 * b[6]  + ai3 * b[7];
    e[i+8]  = ai0 * b[8]  + ai1 * b[9]  + ai2 * b[10] + ai3 * b[11];
    e[i+12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
  }
  
  return this;
};
Matrix4.prototype.multiply = Matrix4.prototype.concat;

/**
 * æ¸¡ã?•ã‚Œã?Ÿãƒ™ã‚¯ãƒˆãƒ«ã‚’ã?‹ã?‘ã‚‹ã€‚
 * @param pos ã?‹ã?‘ã‚‹è¡Œåˆ—
 * @return ã?“ã?®è¡Œåˆ—ã‚’æŽ›ã?‘ã?Ÿçµ?æžœ(Float32Array)
 */
Matrix4.prototype.multiplyVector3 = function(pos) {
  var e = this.elements;
  var p = pos.elements;
  var v = new Vector3();
  var result = v.elements;

  result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[ 8] + e[11];
  result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[ 9] + e[12];
  result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + e[13];

  return v;
};

/**
 * æ¸¡ã?•ã‚Œã?Ÿãƒ™ã‚¯ãƒˆãƒ«ã‚’ã?‹ã?‘ã‚‹ã€‚
 * @param pos ã?‹ã?‘ã‚‹è¡Œåˆ—
 * @return ã?“ã?®è¡Œåˆ—ã‚’æŽ›ã?‘ã?Ÿçµ?æžœ(Float32Array)
 */
Matrix4.prototype.multiplyVector4 = function(pos) {
  var e = this.elements;
  var p = pos.elements;
  var v = new Vector4();
  var result = v.elements;

  result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[ 8] + p[3] * e[12];
  result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[ 9] + p[3] * e[13];
  result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + p[3] * e[14];
  result[3] = p[0] * e[3] + p[1] * e[7] + p[2] * e[11] + p[3] * e[15];

  return v;
};

/**
 * è¡Œåˆ—ã‚’è»¢ç½®ã?™ã‚‹ã€‚
 * @return this
 */
Matrix4.prototype.transpose = function() {
  var e, t;

  e = this.elements;

  t = e[ 1];  e[ 1] = e[ 4];  e[ 4] = t;
  t = e[ 2];  e[ 2] = e[ 8];  e[ 8] = t;
  t = e[ 3];  e[ 3] = e[12];  e[12] = t;
  t = e[ 6];  e[ 6] = e[ 9];  e[ 9] = t;
  t = e[ 7];  e[ 7] = e[13];  e[13] = t;
  t = e[11];  e[11] = e[14];  e[14] = t;

  return this;
};

/**
 * æ¸¡ã?•ã‚Œã?Ÿè¡Œåˆ—ã?®é€†è¡Œåˆ—ã‚’è¨ˆç®—ã?—ã?¦ã€?ã?“ã?®è¡Œåˆ—ã?«ä»£å…¥ã?™ã‚‹ã€‚
 * @param other é€†è¡Œåˆ—ã‚’è¨ˆç®—ã?™ã‚‹è¡Œåˆ—
 * @return this
 */
Matrix4.prototype.setInverseOf = function(other) {
  var i, s, d, inv, det;

  s = other.elements;
  d = this.elements;
  inv = new Float32Array(16);

  inv[0]  =   s[5]*s[10]*s[15] - s[5] *s[11]*s[14] - s[9] *s[6]*s[15]
            + s[9]*s[7] *s[14] + s[13]*s[6] *s[11] - s[13]*s[7]*s[10];
  inv[4]  = - s[4]*s[10]*s[15] + s[4] *s[11]*s[14] + s[8] *s[6]*s[15]
            - s[8]*s[7] *s[14] - s[12]*s[6] *s[11] + s[12]*s[7]*s[10];
  inv[8]  =   s[4]*s[9] *s[15] - s[4] *s[11]*s[13] - s[8] *s[5]*s[15]
            + s[8]*s[7] *s[13] + s[12]*s[5] *s[11] - s[12]*s[7]*s[9];
  inv[12] = - s[4]*s[9] *s[14] + s[4] *s[10]*s[13] + s[8] *s[5]*s[14]
            - s[8]*s[6] *s[13] - s[12]*s[5] *s[10] + s[12]*s[6]*s[9];

  inv[1]  = - s[1]*s[10]*s[15] + s[1] *s[11]*s[14] + s[9] *s[2]*s[15]
            - s[9]*s[3] *s[14] - s[13]*s[2] *s[11] + s[13]*s[3]*s[10];
  inv[5]  =   s[0]*s[10]*s[15] - s[0] *s[11]*s[14] - s[8] *s[2]*s[15]
            + s[8]*s[3] *s[14] + s[12]*s[2] *s[11] - s[12]*s[3]*s[10];
  inv[9]  = - s[0]*s[9] *s[15] + s[0] *s[11]*s[13] + s[8] *s[1]*s[15]
            - s[8]*s[3] *s[13] - s[12]*s[1] *s[11] + s[12]*s[3]*s[9];
  inv[13] =   s[0]*s[9] *s[14] - s[0] *s[10]*s[13] - s[8] *s[1]*s[14]
            + s[8]*s[2] *s[13] + s[12]*s[1] *s[10] - s[12]*s[2]*s[9];

  inv[2]  =   s[1]*s[6]*s[15] - s[1] *s[7]*s[14] - s[5] *s[2]*s[15]
            + s[5]*s[3]*s[14] + s[13]*s[2]*s[7]  - s[13]*s[3]*s[6];
  inv[6]  = - s[0]*s[6]*s[15] + s[0] *s[7]*s[14] + s[4] *s[2]*s[15]
            - s[4]*s[3]*s[14] - s[12]*s[2]*s[7]  + s[12]*s[3]*s[6];
  inv[10] =   s[0]*s[5]*s[15] - s[0] *s[7]*s[13] - s[4] *s[1]*s[15]
            + s[4]*s[3]*s[13] + s[12]*s[1]*s[7]  - s[12]*s[3]*s[5];
  inv[14] = - s[0]*s[5]*s[14] + s[0] *s[6]*s[13] + s[4] *s[1]*s[14]
            - s[4]*s[2]*s[13] - s[12]*s[1]*s[6]  + s[12]*s[2]*s[5];

  inv[3]  = - s[1]*s[6]*s[11] + s[1]*s[7]*s[10] + s[5]*s[2]*s[11]
            - s[5]*s[3]*s[10] - s[9]*s[2]*s[7]  + s[9]*s[3]*s[6];
  inv[7]  =   s[0]*s[6]*s[11] - s[0]*s[7]*s[10] - s[4]*s[2]*s[11]
            + s[4]*s[3]*s[10] + s[8]*s[2]*s[7]  - s[8]*s[3]*s[6];
  inv[11] = - s[0]*s[5]*s[11] + s[0]*s[7]*s[9]  + s[4]*s[1]*s[11]
            - s[4]*s[3]*s[9]  - s[8]*s[1]*s[7]  + s[8]*s[3]*s[5];
  inv[15] =   s[0]*s[5]*s[10] - s[0]*s[6]*s[9]  - s[4]*s[1]*s[10]
            + s[4]*s[2]*s[9]  + s[8]*s[1]*s[6]  - s[8]*s[2]*s[5];

  det = s[0]*inv[0] + s[1]*inv[4] + s[2]*inv[8] + s[3]*inv[12];
  if (det === 0) {
    return this;
  }

  det = 1 / det;
  for (i = 0; i < 16; i++) {
    d[i] = inv[i] * det;
  }

  return this;
};

/**
 * ã?“ã?®è¡Œåˆ—ã?®é€†è¡Œåˆ—ã‚’è¨ˆç®—ã?—ã?¦ã€?å†…å®¹ã‚’ç½®ã??æ?›ã?ˆã‚‹ã€‚
 * @return this
 */
Matrix4.prototype.invert = function() {
  return this.setInverseOf(this);
};

/**
 * æ­£å°„å½±è¡Œåˆ—ã?«è¨­å®šã?™ã‚‹ã€‚
 * @param left å·¦ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?®Xåº§æ¨™
 * @param right å?³ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?®Xåº§æ¨™
 * @param bottom ä¸‹ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?®Yåº§æ¨™
 * @param top ä¸Šã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?®Yåº§æ¨™
 * @param near è¿‘ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?¾ã?§ã?®è·?é›¢ã€‚å¹³é?¢ã?Œè¦–ç‚¹ã?®å¾Œæ–¹ã?«ã?‚ã‚‹å ´å?ˆã?¯è² æ•°
 * @param far é? ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?¾ã?§ã?®è·?é›¢ã€‚å¹³é?¢ã?Œè¦–ç‚¹ã?®å¾Œæ–¹ã?«ã?‚ã‚‹å ´å?ˆã?¯è² æ•°
 * @return this
 */
Matrix4.prototype.setOrtho = function(left, right, bottom, top, near, far) {
  var e, rw, rh, rd;

  if (left === right || bottom === top || near === far) {
    throw 'null frustum';
  }

  rw = 1 / (right - left);
  rh = 1 / (top - bottom);
  rd = 1 / (far - near);

  e = this.elements;

  e[0]  = 2 * rw;
  e[1]  = 0;
  e[2]  = 0;
  e[3]  = 0;

  e[4]  = 0;
  e[5]  = 2 * rh;
  e[6]  = 0;
  e[7]  = 0;

  e[8]  = 0;
  e[9]  = 0;
  e[10] = -2 * rd;
  e[11] = 0;

  e[12] = -(right + left) * rw;
  e[13] = -(top + bottom) * rh;
  e[14] = -(far + near) * rd;
  e[15] = 1;

  return this;
};

/**
 * æ­£å°„å½±è¡Œåˆ—ã‚’å?³ã?‹ã‚‰ã?‹ã?‘ã‚‹ã€‚
 * @param left å·¦ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?®Xåº§æ¨™
 * @param right å?³ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?®Xåº§æ¨™
 * @param bottom ä¸‹ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?®Yåº§æ¨™
 * @param top ä¸Šã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?®Yåº§æ¨™
 * @param near è¿‘ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?¾ã?§ã?®è·?é›¢ã€‚å¹³é?¢ã?Œè¦–ç‚¹ã?®å¾Œæ–¹ã?«ã?‚ã‚‹å ´å?ˆã?¯è² æ•°
 * @param far é? ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?¾ã?§ã?®è·?é›¢ã€‚å¹³é?¢ã?Œè¦–ç‚¹ã?®å¾Œæ–¹ã?«ã?‚ã‚‹å ´å?ˆã?¯è² æ•°
 * @return this
 */
Matrix4.prototype.ortho = function(left, right, bottom, top, near, far) {
  return this.concat(new Matrix4().setOrtho(left, right, bottom, top, near, far));
};

/**
 * é€?è¦–å°„å½±è¡Œåˆ—ã?«è¨­å®šã?™ã‚‹
 * @param left è¿‘ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ä¸Šã?«ã?Šã?‘ã‚‹å·¦ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?®Xåº§æ¨™
 * @param right è¿‘ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ä¸Šã?«ã?Šã?‘ã‚‹å?³ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?®Xåº§æ¨™
 * @param bottom è¿‘ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ä¸Šã?«ã?Šã?‘ã‚‹ä¸‹ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?®Yåº§æ¨™
 * @param top è¿‘ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ä¸Šã?«ã?Šã?‘ã‚‹ä¸Šã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?®Yåº§æ¨™
 * @param near è¿‘ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?¾ã?§ã?®è·?é›¢ã€‚æ­£æ•°ã?§ã?ªã??ã?¦ã?¯ã?ªã‚‰ã?ªã?„
 * @param far é? ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?¾ã?§ã?®è·?é›¢ã€‚æ­£æ•°ã?§ã?ªã??ã?¦ã?¯ã?ªã‚‰ã?ªã?„
 * @return this
 */
Matrix4.prototype.setFrustum = function(left, right, bottom, top, near, far) {
  var e, rw, rh, rd;

  if (left === right || top === bottom || near === far) {
    throw 'null frustum';
  }
  if (near <= 0) {
    throw 'near <= 0';
  }
  if (far <= 0) {
    throw 'far <= 0';
  }

  rw = 1 / (right - left);
  rh = 1 / (top - bottom);
  rd = 1 / (far - near);

  e = this.elements;

  e[ 0] = 2 * near * rw;
  e[ 1] = 0;
  e[ 2] = 0;
  e[ 3] = 0;

  e[ 4] = 0;
  e[ 5] = 2 * near * rh;
  e[ 6] = 0;
  e[ 7] = 0;

  e[ 8] = (right + left) * rw;
  e[ 9] = (top + bottom) * rh;
  e[10] = -(far + near) * rd;
  e[11] = -1;

  e[12] = 0;
  e[13] = 0;
  e[14] = -2 * near * far * rd;
  e[15] = 0;

  return this;
};

/**
 * é€?è¦–å°„å½±è¡Œåˆ—ã‚’å?³ã?‹ã‚‰ã?‹ã?‘ã‚‹ã€‚
 * @param left è¿‘ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ä¸Šã?«ã?Šã?‘ã‚‹å·¦ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?®Xåº§æ¨™
 * @param right è¿‘ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ä¸Šã?«ã?Šã?‘ã‚‹å?³ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?®Xåº§æ¨™
 * @param bottom è¿‘ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ä¸Šã?«ã?Šã?‘ã‚‹ä¸‹ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?®Yåº§æ¨™
 * @param top è¿‘ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ä¸Šã?«ã?Šã?‘ã‚‹ä¸Šã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?®Yåº§æ¨™
 * @param near è¿‘ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?¾ã?§ã?®è·?é›¢ã€‚æ­£æ•°ã?§ã?ªã??ã?¦ã?¯ã?ªã‚‰ã?ªã?„
 * @param far é? ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?¾ã?§ã?®è·?é›¢ã€‚æ­£æ•°ã?§ã?ªã??ã?¦ã?¯ã?ªã‚‰ã?ªã?„
 * @return this
 */
Matrix4.prototype.frustum = function(left, right, bottom, top, near, far) {
  return this.concat(new Matrix4().setFrustum(left, right, bottom, top, near, far));
};

/**
 * è¦–é‡Žè§’ã€?ã‚¢ã‚¹ãƒšã‚¯ãƒˆæ¯”ã‚’æŒ‡å®šã?—ã?¦é€?è¦–å°„å½±è¡Œåˆ—ã?«è¨­å®šã?™ã‚‹ã€‚
 * @param fovy åž‚ç›´è¦–é‡Žè§’ [åº¦]
 * @param aspect è¦–é‡Žã?®ã‚¢ã‚¹ãƒšã‚¯ãƒˆæ¯”ï¼ˆå¹… / é«˜ã?•ï¼‰
 * @param near è¿‘ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?¾ã?§ã?®è·?é›¢ã€‚æ­£æ•°ã?§ã?ªã??ã?¦ã?¯ã?ªã‚‰ã?ªã?„
 * @param far é? ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?¾ã?§ã?®è·?é›¢ã€‚æ­£æ•°ã?§ã?ªã??ã?¦ã?¯ã?ªã‚‰ã?ªã?„
 * @return this
 */
Matrix4.prototype.setPerspective = function(fovy, aspect, near, far) {
  var e, rd, s, ct;

  if (near === far || aspect === 0) {
    throw 'null frustum';
  }
  if (near <= 0) {
    throw 'near <= 0';
  }
  if (far <= 0) {
    throw 'far <= 0';
  }

  fovy = Math.PI * fovy / 180 / 2;
  s = Math.sin(fovy);
  if (s === 0) {
    throw 'null frustum';
  }

  rd = 1 / (far - near);
  ct = Math.cos(fovy) / s;

  e = this.elements;

  e[0]  = ct / aspect;
  e[1]  = 0;
  e[2]  = 0;
  e[3]  = 0;

  e[4]  = 0;
  e[5]  = ct;
  e[6]  = 0;
  e[7]  = 0;

  e[8]  = 0;
  e[9]  = 0;
  e[10] = -(far + near) * rd;
  e[11] = -1;

  e[12] = 0;
  e[13] = 0;
  e[14] = -2 * near * far * rd;
  e[15] = 0;

  return this;
};

/**
 * é€?è¦–å°„å½±è¡Œåˆ—ã‚’å?³ã?‹ã‚‰ã?‹ã?‘ã‚‹ã€‚
 * @param fovy åž‚ç›´è¦–é‡Žè§’ [åº¦]
 * @param aspect è¦–é‡Žã?®ã‚¢ã‚¹ãƒšã‚¯ãƒˆæ¯”ï¼ˆå¹… / é«˜ã?•ï¼‰
 * @param near è¿‘ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?¾ã?§ã?®è·?é›¢ã€‚æ­£æ•°ã?§ã?ªã??ã?¦ã?¯ã?ªã‚‰ã?ªã?„
 * @param far é? ã‚¯ãƒªãƒƒãƒ—å¹³é?¢ã?¾ã?§ã?®è·?é›¢ã€‚æ­£æ•°ã?§ã?ªã??ã?¦ã?¯ã?ªã‚‰ã?ªã?„
 * @return this
 */
Matrix4.prototype.perspective = function(fovy, aspect, near, far) {
  return this.concat(new Matrix4().setPerspective(fovy, aspect, near, far));
};

/**
 * ã‚¹ã‚±ãƒ¼ãƒªãƒ³ã‚°è¡Œåˆ—ã?«è¨­å®šã?™ã‚‹ã€‚
 * @param x Xæ–¹å?‘ã?®å€?çŽ‡
 * @param y Yæ–¹å?‘ã?®å€?çŽ‡
 * @param z Zæ–¹å?‘ã?®å€?çŽ‡
 * @return this
 */
Matrix4.prototype.setScale = function(x, y, z) {
  var e = this.elements;
  e[0] = x;  e[4] = 0;  e[8]  = 0;  e[12] = 0;
  e[1] = 0;  e[5] = y;  e[9]  = 0;  e[13] = 0;
  e[2] = 0;  e[6] = 0;  e[10] = z;  e[14] = 0;
  e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;
  return this;
};

/**
 * ã‚¹ã‚±ãƒ¼ãƒªãƒ³ã‚°è¡Œåˆ—ã‚’å?³ã?‹ã‚‰ã?‹ã?‘ã‚‹ã€‚
 * @param x Xæ–¹å?‘ã?®å€?çŽ‡
 * @param y Yæ–¹å?‘ã?®å€?çŽ‡
 * @param z Zæ–¹å?‘ã?®å€?çŽ‡
 * @return this
 */
Matrix4.prototype.scale = function(x, y, z) {
  var e = this.elements;
  e[0] *= x;  e[4] *= y;  e[8]  *= z;
  e[1] *= x;  e[5] *= y;  e[9]  *= z;
  e[2] *= x;  e[6] *= y;  e[10] *= z;
  e[3] *= x;  e[7] *= y;  e[11] *= z;
  return this;
};

/**
 * å¹³è¡Œç§»å‹•è¡Œåˆ—ã?«è¨­å®šã?™ã‚‹ã€‚
 * @param x Xæ–¹å?‘ã?®ç§»å‹•é‡?
 * @param y Yæ–¹å?‘ã?®ç§»å‹•é‡?
 * @param z Zæ–¹å?‘ã?®ç§»å‹•é‡?
 * @return this
 */
Matrix4.prototype.setTranslate = function(x, y, z) {
  var e = this.elements;
  e[0] = 1;  e[4] = 0;  e[8]  = 0;  e[12] = x;
  e[1] = 0;  e[5] = 1;  e[9]  = 0;  e[13] = y;
  e[2] = 0;  e[6] = 0;  e[10] = 1;  e[14] = z;
  e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;
  return this;
};

/**
 * å¹³è¡Œç§»å‹•è¡Œåˆ—ã‚’å?³ã?‹ã‚‰ã?‹ã?‘ã‚‹ã€‚
 * @param x Xæ–¹å?‘ã?®ç§»å‹•é‡?
 * @param y Yæ–¹å?‘ã?®ç§»å‹•é‡?
 * @param z Zæ–¹å?‘ã?®ç§»å‹•é‡?
 * @return this
 */
Matrix4.prototype.translate = function(x, y, z) {
  var e = this.elements;
  e[12] += e[0] * x + e[4] * y + e[8]  * z;
  e[13] += e[1] * x + e[5] * y + e[9]  * z;
  e[14] += e[2] * x + e[6] * y + e[10] * z;
  e[15] += e[3] * x + e[7] * y + e[11] * z;
  return this;
};

/**
 * å›žè»¢è¡Œåˆ—ã?«è¨­å®šã?™ã‚‹ã€‚
 * å›žè»¢è»¸ã?®æ–¹å?‘ãƒ™ã‚¯ãƒˆãƒ«ã?¯æ­£è¦?åŒ–ã?•ã‚Œã?¦ã?„ã?ªã??ã?¦ã‚‚æ§‹ã‚?ã?ªã?„ã€‚
 * @param angle å›žè»¢è§’ [åº¦]
 * @param x å›žè»¢è»¸ã?®æ–¹å?‘ãƒ™ã‚¯ãƒˆãƒ«ã?®Xæˆ?åˆ†
 * @param y å›žè»¢è»¸ã?®æ–¹å?‘ãƒ™ã‚¯ãƒˆãƒ«ã?®Yæˆ?åˆ†
 * @param z å›žè»¢è»¸ã?®æ–¹å?‘ãƒ™ã‚¯ãƒˆãƒ«ã?®Zæˆ?åˆ†
 * @return this
 */
Matrix4.prototype.setRotate = function(angle, x, y, z) {
  var e, s, c, len, rlen, nc, xy, yz, zx, xs, ys, zs;

  angle = Math.PI * angle / 180;
  e = this.elements;

  s = Math.sin(angle);
  c = Math.cos(angle);

  if (0 !== x && 0 === y && 0 === z) {
    // Xè»¸ã?¾ã‚?ã‚Šã?®å›žè»¢
    if (x < 0) {
      s = -s;
    }
    e[0] = 1;  e[4] = 0;  e[ 8] = 0;  e[12] = 0;
    e[1] = 0;  e[5] = c;  e[ 9] =-s;  e[13] = 0;
    e[2] = 0;  e[6] = s;  e[10] = c;  e[14] = 0;
    e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;
  } else if (0 === x && 0 !== y && 0 === z) {
    // Yè»¸ã?¾ã‚?ã‚Šã?®å›žè»¢
    if (y < 0) {
      s = -s;
    }
    e[0] = c;  e[4] = 0;  e[ 8] = s;  e[12] = 0;
    e[1] = 0;  e[5] = 1;  e[ 9] = 0;  e[13] = 0;
    e[2] =-s;  e[6] = 0;  e[10] = c;  e[14] = 0;
    e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;
  } else if (0 === x && 0 === y && 0 !== z) {
    // Zè»¸ã?¾ã‚?ã‚Šã?®å›žè»¢
    if (z < 0) {
      s = -s;
    }
    e[0] = c;  e[4] =-s;  e[ 8] = 0;  e[12] = 0;
    e[1] = s;  e[5] = c;  e[ 9] = 0;  e[13] = 0;
    e[2] = 0;  e[6] = 0;  e[10] = 1;  e[14] = 0;
    e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;
  } else {
    // ã??ã?®ä»–ã?®ä»»æ„?è»¸ã?¾ã‚?ã‚Šã?®å›žè»¢
    len = Math.sqrt(x*x + y*y + z*z);
    if (len !== 1) {
      rlen = 1 / len;
      x *= rlen;
      y *= rlen;
      z *= rlen;
    }
    nc = 1 - c;
    xy = x * y;
    yz = y * z;
    zx = z * x;
    xs = x * s;
    ys = y * s;
    zs = z * s;

    e[ 0] = x*x*nc +  c;
    e[ 1] = xy *nc + zs;
    e[ 2] = zx *nc - ys;
    e[ 3] = 0;

    e[ 4] = xy *nc - zs;
    e[ 5] = y*y*nc +  c;
    e[ 6] = yz *nc + xs;
    e[ 7] = 0;

    e[ 8] = zx *nc + ys;
    e[ 9] = yz *nc - xs;
    e[10] = z*z*nc +  c;
    e[11] = 0;

    e[12] = 0;
    e[13] = 0;
    e[14] = 0;
    e[15] = 1;
  }

  return this;
};

/**
 * å›žè»¢è¡Œåˆ—ã‚’å?³ã?‹ã‚‰ã?‹ã?‘ã‚‹ã€‚
 * å›žè»¢è»¸ã?®æ–¹å?‘ãƒ™ã‚¯ãƒˆãƒ«ã?¯æ­£è¦?åŒ–ã?•ã‚Œã?¦ã?„ã?ªã??ã?¦ã‚‚æ§‹ã‚?ã?ªã?„ã€‚
 * @param angle å›žè»¢è§’ [åº¦]
 * @param x å›žè»¢è»¸ã?®æ–¹å?‘ãƒ™ã‚¯ãƒˆãƒ«ã?®Xæˆ?åˆ†
 * @param y å›žè»¢è»¸ã?®æ–¹å?‘ãƒ™ã‚¯ãƒˆãƒ«ã?®Yæˆ?åˆ†
 * @param z å›žè»¢è»¸ã?®æ–¹å?‘ãƒ™ã‚¯ãƒˆãƒ«ã?®Zæˆ?åˆ†
 * @return this
 */
Matrix4.prototype.rotate = function(angle, x, y, z) {
  return this.concat(new Matrix4().setRotate(angle, x, y, z));
};

/**
 * è¦–é‡Žå¤‰æ?›è¡Œåˆ—ã‚’è¨­å®šã?™ã‚‹ã€‚
 * @param eyeX, eyeY, eyeZ è¦–ç‚¹ã?®ä½?ç½®
 * @param centerX, centerY, centerZ æ¨™ç‚¹ã?®ä½?ç½®
 * @param upX, upY, upZ ã‚«ãƒ¡ãƒ©ã?®ä¸Šæ–¹å?‘ã‚’è¡¨ã?™æ–¹å?‘ãƒ™ã‚¯ãƒˆãƒ«
 * @return this
 */
Matrix4.prototype.setLookAt = function(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
  var e, fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz;

  fx = centerX - eyeX;
  fy = centerY - eyeY;
  fz = centerZ - eyeZ;

  // fã‚’æ­£è¦?åŒ–ã?™ã‚‹
  rlf = 1 / Math.sqrt(fx*fx + fy*fy + fz*fz);
  fx *= rlf;
  fy *= rlf;
  fz *= rlf;

  // fã?¨upã?®å¤–ç©?ã‚’æ±‚ã‚?ã‚‹
  sx = fy * upZ - fz * upY;
  sy = fz * upX - fx * upZ;
  sz = fx * upY - fy * upX;

  // sã‚’æ­£è¦?åŒ–ã?™ã‚‹
  rls = 1 / Math.sqrt(sx*sx + sy*sy + sz*sz);
  sx *= rls;
  sy *= rls;
  sz *= rls;

  // sã?¨fã?®å¤–ç©?ã‚’æ±‚ã‚?ã‚‹
  ux = sy * fz - sz * fy;
  uy = sz * fx - sx * fz;
  uz = sx * fy - sy * fx;

  // ä»£å…¥ã?™ã‚‹
  e = this.elements;
  e[0] = sx;
  e[1] = ux;
  e[2] = -fx;
  e[3] = 0;

  e[4] = sy;
  e[5] = uy;
  e[6] = -fy;
  e[7] = 0;

  e[8] = sz;
  e[9] = uz;
  e[10] = -fz;
  e[11] = 0;

  e[12] = 0;
  e[13] = 0;
  e[14] = 0;
  e[15] = 1;

  // å¹³è¡Œç§»å‹•ã?™ã‚‹
  return this.translate(-eyeX, -eyeY, -eyeZ);
};

/**
 * è¦–é‡Žå¤‰æ?›è¡Œåˆ—ã‚’å?³ã?‹ã‚‰ã?‹ã?‘ã‚‹ã€‚
 * @param eyeX, eyeY, eyeZ è¦–ç‚¹ã?®ä½?ç½®
 * @param centerX, centerY, centerZ æ¨™ç‚¹ã?®ä½?ç½®
 * @param upX, upY, upZ ã‚«ãƒ¡ãƒ©ã?®ä¸Šæ–¹å?‘ã‚’è¡¨ã?™æ–¹å?‘ãƒ™ã‚¯ãƒˆãƒ«
 * @return this
 */
Matrix4.prototype.lookAt = function(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
  return this.concat(new Matrix4().setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ));
};

/**
 * é ‚ç‚¹ã‚’å¹³é?¢ä¸Šã?«å°„å½±ã?™ã‚‹ã‚ˆã?†ã?ªè¡Œåˆ—ã‚’å?³ã?‹ã‚‰ã?‹ã?‘ã‚‹ã€‚
 * @param plane å¹³é?¢æ–¹ç¨‹å¼? Ax + By + Cz + D = 0 ã?®ä¿‚æ•°[A, B, C, D]ã‚’æ ¼ç´?ã?—ã?Ÿé…?åˆ—
 * @param light å…‰æº?ã?®å?Œæ¬¡åº§æ¨™ã‚’æ ¼ç´?ã?—ã?Ÿé…?åˆ—ã€‚light[3]=0ã?®å ´å?ˆã€?å¹³è¡Œå…‰æº?ã‚’è¡¨ã?™
 * @return this
 */
Matrix4.prototype.dropShadow = function(plane, light) {
  var mat = new Matrix4();
  var e = mat.elements;

  var dot = plane[0] * light[0] + plane[1] * light[1] + plane[2] * light[2] + plane[3] * light[3];

  e[ 0] = dot - light[0] * plane[0];
  e[ 1] =     - light[1] * plane[0];
  e[ 2] =     - light[2] * plane[0];
  e[ 3] =     - light[3] * plane[0];

  e[ 4] =     - light[0] * plane[1];
  e[ 5] = dot - light[1] * plane[1];
  e[ 6] =     - light[2] * plane[1];
  e[ 7] =     - light[3] * plane[1];

  e[ 8] =     - light[0] * plane[2];
  e[ 9] =     - light[1] * plane[2];
  e[10] = dot - light[2] * plane[2];
  e[11] =     - light[3] * plane[2];

  e[12] =     - light[0] * plane[3];
  e[13] =     - light[1] * plane[3];
  e[14] =     - light[2] * plane[3];
  e[15] = dot - light[3] * plane[3];

  return this.concat(mat);
}

/**
 * å¹³è¡Œå…‰æº?ã?«ã‚ˆã‚Šé ‚ç‚¹ã‚’å¹³é?¢ä¸Šã?«å°„å½±ã?™ã‚‹ã‚ˆã?†ã?ªè¡Œåˆ—ã‚’å?³ã?‹ã‚‰ã?‹ã?‘ã‚‹ã€‚
 * @param normX, normY, normZ å¹³é?¢ã?®æ³•ç·šãƒ™ã‚¯ãƒˆãƒ«ï¼ˆæ­£è¦?åŒ–ã?•ã‚Œã?¦ã?„ã‚‹å¿…è¦?ã?¯ã?ªã?„ï¼‰
 * @param planeX, planeY, planeZ å¹³é?¢ä¸Šã?®ç‚¹
 * @param lightX, lightY, lightZ ãƒ©ã‚¤ãƒˆã?®æ–¹å?‘ï¼ˆæ­£è¦?åŒ–ã?•ã‚Œã?¦ã?„ã‚‹å¿…è¦?ã?¯ã?ªã?„ï¼‰
 * @return this
 */
Matrix4.prototype.dropShadowDirectionally = function(normX, normY, normZ, planeX, planeY, planeZ, lightX, lightY, lightZ) {
  var a = planeX * normX + planeY * normY + planeZ * normZ;
  return this.dropShadow([normX, normY, normZ, -a], [lightX, lightY, lightZ, 0]);
};

/**
 * Vector3ã?®ã‚³ãƒ³ã‚¹ãƒˆãƒ©ã‚¯ã‚¿
 * å¼•æ•°ã‚’æŒ‡å®šã?™ã‚‹ã?¨ã??ã?®å†…å®¹ã?Œã‚³ãƒ”ãƒ¼ã?•ã‚Œã‚‹
 * @param opt_src è¦?ç´ ã‚’ã‚³ãƒ”ãƒ¼ã?—ã?¦ã??ã‚‹ãƒ™ã‚¯ãƒˆãƒ«ï¼ˆã‚ªãƒ—ã‚·ãƒ§ãƒ³ï¼‰
 */
var Vector3 = function(opt_src) {
  var v = new Float32Array(3);
  if (opt_src && typeof opt_src === 'object') {
    v[0] = opt_src[0]; v[1] = opt_src[1]; v[2] = opt_src[2];
  } 
  this.elements = v;
}

/**
  * æ­£è¦?åŒ–ã?™ã‚‹ã€‚
  * @return this
  */
Vector3.prototype.normalize = function() {
  var v = this.elements;
  var c = v[0], d = v[1], e = v[2], g = Math.sqrt(c*c+d*d+e*e);
  if(g){
    if(g == 1)
        return this;
   } else {
     v[0] = 0; v[1] = 0; v[2] = 0;
     return this;
   }
   g = 1/g;
   v[0] = c*g; v[1] = d*g; v[2] = e*g;
   return this;
};

/**
 * Vector4ã?®ã‚³ãƒ³ã‚¹ãƒˆãƒ©ã‚¯ã‚¿
 * å¼•æ•°ã‚’æŒ‡å®šã?™ã‚‹ã?¨ã??ã?®å†…å®¹ã?Œã‚³ãƒ”ãƒ¼ã?•ã‚Œã‚‹
 * @param opt_src è¦?ç´ ã‚’ã‚³ãƒ”ãƒ¼ã?—ã?¦ã??ã‚‹ãƒ™ã‚¯ãƒˆãƒ«ï¼ˆã‚ªãƒ—ã‚·ãƒ§ãƒ³ï¼‰
 */
var Vector4 = function(opt_src) {
  var v = new Float32Array(4);
  if (opt_src && typeof opt_src === 'object') {
    v[0] = opt_src[0]; v[1] = opt_src[1]; v[2] = opt_src[2]; v[3] = opt_src[3];
  } 
  this.elements = v;
}