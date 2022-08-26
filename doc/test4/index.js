
function min(a, b)
{
	return a > b ? b : a;
}

function max(a, b)
{
	return a > b ? a : b;
}

class Canvas
{
	constructor(canvas)
	{
		this._canvas = canvas;
		this._context = canvas.getContext('2d');
		
		this.width = canvas.width;
		this.height = canvas.height;
		
		this._image = this._context.getImageData(0, 0, canvas.width, canvas.height);
		this._data = this._image.data;

		this._smooth = true;
	}

	put_pixel(x, y, r, g, b)
	{
		let base = y * this.width + x;
		base *= 4;
		this._data[base] = r;
		this._data[base + 1] = g;
		this._data[base + 2] = b;
		this._data[base + 3] = 255;
	}
	
	update()
	{
		this._context.putImageData(this._image, 0, 0);
	}

	get smooth()
	{
		return this._smooth;
	}

	set smooth(val)
	{
		if (val != true && val != false)
			throw 'smooth value can be only `false` or `true`';
		this._context.imageSmoothingEnabled = val;
		this._context.mozImageSmoothingEnabled = val;
		this._context.webkitImageSmoothingEnabled = val;
		this._context.msImageSmoothingEnabled = val;
		this._smooth = val;
	}
}

class Point
{
	constructor(x, y, z)
	{
		this._x = x;
		this._y = y;
		this._z = z;
		this._abs = null;
		this._len = null;
	}
	
	add(p)
	{
		return new Point(p._x + this._x, p._y + this._y, p._z + this._z);
	}

	iadd(p)
	{
		this._x += p._x;
		this._y += p._y;
		this._z += p._z;
		this._abs = null;
		this._len = null;
		return this;
	}

	sub(p)
	{
		return new Point(this._x - p._x, this._y - p._y, this._z - p._z);
	}

	isub(p)
	{
		this._x -= p._x;
		this._y -= p._y;
		this._z -= p._z;
		this._abs = null;
		this._len = null;
		return this;
	}

	mul(factor)
	{
		return new Point(this._x * factor, this._y * factor, this._z * factor);
	}

	imul(factor)
	{
		this._x *= factor;
		this._y *= factor;
		this._z *= factor;
		this._abs = null;
		this._len = null;
		return this;
	}

	get abs()
	{
		if (this._abs == null)
			this._abs = this.__get_abs();
		return this._abs;
	}

	get len()
	{
		if (this._len == null)
			this._len = Math.sqrt(this.abs);
		return this._len;
	}

	dot(p)
	{
		return this._x * p._x + this._y * p._y + this._z * p._z;
	}

	normalize()
	{
		let l = this.len;
		this._x /= l;
		this._y /= l;
		this._z /= l;
		this._abs = null;
		this._len = null;
		return this;
	}

	clone()
	{
		let ret = new Point(this._x, this._y, this._z);
		ret._abs = this._abs;
		ret._len = this._len;
		return ret;
	}

	str()
	{
		return `(${this._x}, ${this._y}, ${this._z})`;
	}

	__get_abs()
	{
		return this._x * this._x + this._y * this._y + this._z * this._z;
	}
}

class Color
{
	constructor(red, green, blue)
	{
		this.red = red;
		this.green = green;
		this.blue = blue;
	}

	mul(factor)
	{
		return new Color(this.red * factor, this.green * factor, this.blue * factor);
	}

	static Black = new Color(0, 0, 0);
}

class Sphere
{
	constructor(center, radius, color)
	{
		this.center = center;
		this.radius = radius;
		this.color = color;

		this._r2 = radius * radius;
		this._1r = 1 / radius;
	}

	intersect(start, vec)
	{
		let co = start.sub(this.center);
		
		let a = vec.dot(vec);
		let b = 2 * vec.dot(co);
		let c = co.dot(co) - this._r2;

		let D = b * b - 4 * a * c;
		if (D < 0)
			return Infinity;
		D = Math.sqrt(D);
		let x1 = (-b + D) / 2 / a;
		let x2 = (-b - D) / 2 / a;
		let mn = min(x1, x2);
		
		//console.log(start, vec, a, b, c, D, x1, x2, mn);
		if (mn < 0)
			return max(x1, x2);
		return mn;
	}

	normal(point)
	{
		return point.sub(this.center).imul(this._1r);
	}

	str()
	{
		return `Sphere{center: ${this.center.str()}, r: ${this.radius}}`;
	}
}

class Light
{
	static AMBIENT_LIGHT = 0;
	static POINT_LIGHT = 1;
	static DIRECT_LIGHT = 3;

	constructor(type, intencity, color)
	{
		this.type = type;
		this.intencity = intencity;
		this.color = color;
	}
}

class AmbientLight extends Light
{
	constructor(intencity, color)
	{
		super(Light.AMBIENT_LIGHT, intencity, color);
	}
}

class PointLight extends Light
{
	constructor(point, intencity, color)
	{
		super(Light.POINT_LIGHT, intencity, color);
		this.point = point;
	}
}

class DirectLight extends Light
{
	constructor(direct, intencity, color)
	{
		super(Light.DIRECT_LIGHT, intencity, color);
		this.direct = direct.normalize();
	}
}

let objects = [
	//new Sphere(new Point(-4, 0, 0), 2, new Color(250, 200, 100)),
	new Sphere(new Point(10, 0, 0), 0.65, new Color(250, 200, 100)),
	new Sphere(new Point(0, -1, 3), 1, new Color(255, 0, 0)),
	new Sphere(new Point(2, 0, 4), 1, new Color(0, 0, 255)),
	new Sphere(new Point(-2, 0, 4), 1, new Color(0, 255, 0))
];

let lights = [
	//new AmbientLight(0.2, new Color(255, 255, 255)),
	//new PointLight(new Point(2, 1, 0), 0.6, new Color(255, 255, 255)),
	new DirectLight(new Point(1, 4, 4), 0.2, new Color(255, 255, 255))
]

function compute_lightning(point, normal)
{
	let lt = 0;
	for (let light of lights)
	{
		//console.log(light);
		if (light.type == Light.AMBIENT_LIGHT)
			lt += light.intencity;
		else
		{
			let L;
			if (light.type == Light.POINT_LIGHT)
				L = light.point.sub(point).normalize();
			else if (light.type == Light.DIRECT_LIGHT)
				L = light.direct;
			else
				throw 'unknown light type';
			
			let dot = normal.dot(L);
			if (dot < 0)
				dot = -dot;
			if (dot > 0)
				lt += light.intencity * dot;
		}
	}
	return lt;
}

function trace_ray(start, vec)
{
	let dist = Infinity;
	let col = Color.Black;
	let closest_obj = null;

	for (let obj of objects)
	{
		let t = obj.intersect(start, vec);
		//console.log(`intersected with ${obj.str()} with distance ${t}`);
		if (t < 1 || t == Infinity)
			continue ;
		if (t < dist)
		{
			dist = t;
			col = obj.color;
			closest_obj = obj;
		}
	}
	if (closest_obj == null)
		return col;
	let point = vec.clone().imul(dist).iadd(start).normalize();
	let normal = closest_obj.normal(point);

	return col.mul(compute_lightning(point, normal));
}

function draw()
{
	let c = document.getElementById('canvas');
	let W = c.width;
	let H = c.height;
	let canvas = new Canvas(c);
	canvas.smooth = false;

	let camera = new Point(0, 0, 0);

	for (let z=0; z < W; ++z)
	{
		for (let y=0; y < H; ++y)
		{
			let vec = new Point((z - W / 2) / W, (y - H / 2) / H, 1);
			vec.normalize();
			//console.log(`tracing ray ${vec.str()} from ${camera.str()}`);
			let px = trace_ray(camera, vec);
			canvas.put_pixel(z, H - y, px.red, px.green, px.blue);
		}
	}
	canvas.update();
}

draw();
console.log('ok');

/*
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let image = context.getImageData(0, 0, canvas.width, canvas.height);
let data = image.data;

for (let i=0; i < data.length; i += 4)
{
	data[i] = 255;
	data[i + 1] = 200;
	data[i + 2] = 100;
	data[i + 3] = 255;
}
console.log(image);
context.putImageData(image, 0, 0, );
console.log(context.getImageData(0, 0, canvas.width, canvas.height));

console.log('ok');

//  document.getElementById('canvas').getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
*/

