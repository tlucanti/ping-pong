
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
		this.x = x;
		this.y = y;
		this.z = z;
	}
	
	add(p)
	{
		return new Point(p.x + this.x, p.y + this.y, p.z + this.z);
	}

	iadd(p)
	{
		this.x += p.x;
		this.y += p.y;
		this.z += p.z;
		return this;
	}

	sub(p)
	{
		return new Point(this.x - p.x, this.y - p.y, this.z - p.z);
	}

	isub(p)
	{
		this.x -= p.x;
		this.y -= p.y;
		this.z -= p.z;
		return this;
	}

	abs()
	{
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	dot(p)
	{
		return this.x * p.x + this.y * p.y + this.z * p.z;
	}

	normalize()
	{
		let len = Math.sqrt(this.abs());
		this.x /= len;
		this.y /= len;
		this.z /= len;
	}

	str()
	{
		return `(${this.x}, ${this.y}, ${this.z})`;
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

	str()
	{
		return `Sphere{center: ${this.center.str()}, r: ${this.radius}}`;
	}
}

class Light
{
	AMBIENT_LIGHT = 0;
	POINT_LIGHT = 1;
	DIRECT_LIGHT = 2;

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
		this.direct = direct;
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
	new AmbientLight(0.2, new Color(255, 255, 255)),
	new PointLight(new Point(0, 0, 0), 0.2, new Color(255, 255, 255))
]

function trace_ray(start, vec)
{
	let dist = Infinity;
	let col = Color.Black;
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
		}
	}
	return col;
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

