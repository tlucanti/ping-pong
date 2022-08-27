
import {min} from "./utils.js"
import {Canvas} from "./Canvas.js"
import {Point} from "./Point.js"
import {Color} from "./Color.js"
import {Sphere} from "./Sphere.js"
import {Light, AmbientLight, PointLight, DirectLight} from "./Light.js"

let objects = [
	//new Sphere(new Point(-4, 0, 0), 2, new Color(250, 200, 100)),
	new Sphere(new Point(10, 0, 0), 1, new Color(250, 200, 100)),
	new Sphere(new Point(0, -1, 3), 1, new Color(255, 0, 0)),
	new Sphere(new Point(2, 0, 4),  1, new Color(0, 0, 255)),
	new Sphere(new Point(-2, 0, 4), 1, new Color(0, 255, 0)),

	new Sphere(new Point(0, -5001, 0), 5000, new Color(255, 255, 0)),
];

let lights = [
	new AmbientLight(0.2, new Color(255, 255, 255)),
	new PointLight(new Point(2, 1, 0), 0.6, new Color(255, 255, 255)),
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
			if (dot > 0)
				lt += light.intencity * dot;
			if (lt > 1)
				console.log(dot);
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
	let point = vec.clone().imul(dist).iadd(start);
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

	let camera = new Point(0, 0, -2);

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
