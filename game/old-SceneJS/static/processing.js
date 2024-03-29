/*

    P R O C E S S I N G . J S - 1.0.0
    a port of the Processing visualization language

    License       : MIT
    Developer     : John Resig: http://ejohn.org
    Web Site      : http://processingjs.org
    Java Version  : http://processing.org
    Github Repo.  : http://github.com/jeresig/processing-js
    Bug Tracking  : http://processing-js.lighthouseapp.com
    Mozilla POW!  : http://wiki.Mozilla.org/Education/Projects/ProcessingForTheWeb
    Maintained by : Seneca: http://zenit.senecac.on.ca/wiki/index.php/Processing.js
                    Hyper-Metrix: http://hyper-metrix.com/#Processing
                    BuildingSky: http://weare.buildingsky.net/pages/processing-js

	Excerpted by Alex Trujillo for use within Nanoblok, an open-source, MIT-licensed sprite engine.
	Later forked to Auxons.
 */

/* Processing */
var undef = "undefined";

function random() {
  if(arguments.length === 0) {
    return currentRandom();
  } else if(arguments.length === 1) {
    return currentRandom() * arguments[0];
  } else {
    var aMin = arguments[0], aMax = arguments[1];
    return currentRandom() * (aMax - aMin) + aMin;
  }
};

// Pseudo-random generator
function Marsaglia(i1, i2) {
  // from http://www.math.uni-bielefeld.de/~sillke/ALGORITHMS/random/marsaglia-c
  var z=i1 || 362436069, w= i2 || 521288629;
  var nextInt = function() {
    z=(36969*(z&65535)+(z>>>16)) & 0xFFFFFFFF;
    w=(18000*(w&65535)+(w>>>16)) & 0xFFFFFFFF;
    return (((z&0xFFFF)<<16) | (w&0xFFFF)) & 0xFFFFFFFF;
  };

  this.nextDouble = function() {
    var i = nextInt() / 4294967296;
    return i < 0 ? 1 + i : i;
  };
  this.nextInt = nextInt;
}
Marsaglia.createRandomized = function() {
  var now = new Date();
  return new Marsaglia((now / 60000) & 0xFFFFFFFF, now & 0xFFFFFFFF);
};

/**
* Sets the seed value for random(). By default, random() produces different results each time the
* program is run. Set the value parameter to a constant to return the same pseudo-random numbers
* each time the software is run.
*
* @param {int|float} seed         int
*
* @see random
* @see noise
* @see noiseSeed
*/
function randomSeed (seed) {
  currentRandom = (new Marsaglia(seed)).nextDouble;
};

// Random
// We have two random()'s in the code... what does this do ? and which one is current ?
function Random (seed) {
  var haveNextNextGaussian = false, nextNextGaussian, random;

  this.nextGaussian = function() {
    if (haveNextNextGaussian) {
      haveNextNextGaussian = false;
      return nextNextGaussian;
    } else {
      var v1, v2, s;
      do {
        v1 = 2 * random() - 1; // between -1.0 and 1.0
        v2 = 2 * random() - 1; // between -1.0 and 1.0
        s = v1 * v1 + v2 * v2;
      }
      while (s >= 1 || s === 0);

      var multiplier = Math.sqrt(-2 * Math.log(s) / s);
      nextNextGaussian = v2 * multiplier;
      haveNextNextGaussian = true;

      return v1 * multiplier;
    }
  };

  // by default use standard random, otherwise seeded
  random = (seed === undef) ? Math.random : (new Marsaglia(seed)).nextDouble;
};

// Noise functions and helpers
function PerlinNoise(seed) {
  var rnd = seed !== undef ? new Marsaglia(seed) : Marsaglia.createRandomized();
  var i, j;
  // http://www.noisemachine.com/talk1/17b.html
  // http://mrl.nyu.edu/~perlin/noise/
  // generate permutation
  var perm = new Array(512);
  for(i=0;i<256;++i) { perm[i] = i; }
  for(i=0;i<256;++i) { var t = perm[j = rnd.nextInt() & 0xFF]; perm[j] = perm[i]; perm[i] = t; }
  // copy to avoid taking mod in perm[0];
  for(i=0;i<256;++i) { perm[i + 256] = perm[i]; }

  function grad3d(i,x,y,z) {
    var h = i & 15; // convert into 12 gradient directions
    var u = h<8 ? x : y,
        v = h<4 ? y : h===12||h===14 ? x : z;
    return ((h&1) === 0 ? u : -u) + ((h&2) === 0 ? v : -v);
  }

  function grad2d(i,x,y) {
    var v = (i & 1) === 0 ? x : y;
    return (i&2) === 0 ? -v : v;
  }

  function grad1d(i,x) {
    return (i&1) === 0 ? -x : x;
  }

  function lerp(t,a,b) { return a + t * (b - a); }

  this.noise3d = function(x, y, z) {
    var X = Math.floor(x)&255, Y = Math.floor(y)&255, Z = Math.floor(z)&255;
    x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
    var fx = (3-2*x)*x*x, fy = (3-2*y)*y*y, fz = (3-2*z)*z*z;
    var p0 = perm[X]+Y, p00 = perm[p0] + Z, p01 = perm[p0 + 1] + Z,
        p1 = perm[X + 1] + Y, p10 = perm[p1] + Z, p11 = perm[p1 + 1] + Z;
    return lerp(fz,
      lerp(fy, lerp(fx, grad3d(perm[p00], x, y, z), grad3d(perm[p10], x-1, y, z)),
               lerp(fx, grad3d(perm[p01], x, y-1, z), grad3d(perm[p11], x-1, y-1,z))),
      lerp(fy, lerp(fx, grad3d(perm[p00 + 1], x, y, z-1), grad3d(perm[p10 + 1], x-1, y, z-1)),
               lerp(fx, grad3d(perm[p01 + 1], x, y-1, z-1), grad3d(perm[p11 + 1], x-1, y-1,z-1))));
  };

  this.noise2d = function(x, y) {
    var X = Math.floor(x)&255, Y = Math.floor(y)&255;
    x -= Math.floor(x); y -= Math.floor(y);
    var fx = (3-2*x)*x*x, fy = (3-2*y)*y*y;
    var p0 = perm[X]+Y, p1 = perm[X + 1] + Y;
    return lerp(fy,
      lerp(fx, grad2d(perm[p0], x, y), grad2d(perm[p1], x-1, y)),
      lerp(fx, grad2d(perm[p0 + 1], x, y-1), grad2d(perm[p1 + 1], x-1, y-1)));
  };

  this.noise1d = function(x) {
    var X = Math.floor(x)&255;
    x -= Math.floor(x);
    var fx = (3-2*x)*x*x;
    return lerp(fx, grad1d(perm[X], x), grad1d(perm[X+1], x-1));
  };
}

// processing defaults
var noiseProfile = { generator: undef, octaves: 4, fallout: 0.5, seed: undef};

/**
* Returns the Perlin noise value at specified coordinates. Perlin noise is a random sequence
* generator producing a more natural ordered, harmonic succession of numbers compared to the
* standard random() function. It was invented by Ken Perlin in the 1980s and been used since
* in graphical applications to produce procedural textures, natural motion, shapes, terrains etc.
* The main difference to the random() function is that Perlin noise is defined in an infinite
* n-dimensional space where each pair of coordinates corresponds to a fixed semi-random value
* (fixed only for the lifespan of the program). The resulting value will always be between 0.0
* and 1.0. Processing can compute 1D, 2D and 3D noise, depending on the number of coordinates
* given. The noise value can be animated by moving through the noise space as demonstrated in
* the example above. The 2nd and 3rd dimension can also be interpreted as time.
* The actual noise is structured similar to an audio signal, in respect to the function's use
* of frequencies. Similar to the concept of harmonics in physics, perlin noise is computed over
* several octaves which are added together for the final result.
* Another way to adjust the character of the resulting sequence is the scale of the input
* coordinates. As the function works within an infinite space the value of the coordinates
* doesn't matter as such, only the distance between successive coordinates does (eg. when using
* noise() within a loop). As a general rule the smaller the difference between coordinates, the
* smoother the resulting noise sequence will be. Steps of 0.005-0.03 work best for most applications,
* but this will differ depending on use.
*
* @param {float} x          x coordinate in noise space
* @param {float} y          y coordinate in noise space
* @param {float} z          z coordinate in noise space
*
* @returns {float}
*
* @see random
* @see noiseDetail
*/
function noise (x, y, z) {
  if(noiseProfile.generator === undef) {
    // caching
    noiseProfile.generator = new PerlinNoise(noiseProfile.seed);
  }
  var generator = noiseProfile.generator;
  var effect = 1, k = 1, sum = 0;
  for(var i=0; i<noiseProfile.octaves; ++i) {
    effect *= noiseProfile.fallout;
    switch (arguments.length) {
    case 1:
      sum += effect * (1 + generator.noise1d(k*x))/2; break;
    case 2:
      sum += effect * (1 + generator.noise2d(k*x, k*y))/2; break;
    case 3:
      sum += effect * (1 + generator.noise3d(k*x, k*y, k*z))/2; break;
    }
    k *= 2;
  }
  return sum;
};

/**
* Adjusts the character and level of detail produced by the Perlin noise function.
* Similar to harmonics in physics, noise is computed over several octaves. Lower octaves
* contribute more to the output signal and as such define the overal intensity of the noise,
* whereas higher octaves create finer grained details in the noise sequence. By default,
* noise is computed over 4 octaves with each octave contributing exactly half than its
* predecessor, starting at 50% strength for the 1st octave. This falloff amount can be
* changed by adding an additional function parameter. Eg. a falloff factor of 0.75 means
* each octave will now have 75% impact (25% less) of the previous lower octave. Any value
* between 0.0 and 1.0 is valid, however note that values greater than 0.5 might result in
* greater than 1.0 values returned by noise(). By changing these parameters, the signal
* created by the noise() function can be adapted to fit very specific needs and characteristics.
*
* @param {int} octaves          number of octaves to be used by the noise() function
* @param {float} falloff        falloff factor for each octave
*
* @see noise
*/
function noiseDetail (octaves, fallout) {
  noiseProfile.octaves = octaves;
  if(fallout !== undef) {
    noiseProfile.fallout = fallout;
  }
};

/**
* Sets the seed value for noise(). By default, noise() produces different results each
* time the program is run. Set the value parameter to a constant to return the same
* pseudo-random numbers each time the software is run.
*
* @param {int} seed         int
*
* @returns {float}
*
* @see random
* @see radomSeed
* @see noise
* @see noiseDetail
*/
function noiseSeed (seed) {
  noiseProfile.seed = seed;
  noiseProfile.generator = undef;
};