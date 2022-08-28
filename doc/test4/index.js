
import {min} from "./utils.js"
import {Canvas} from "./Canvas.js"
import {Point} from "./Point.js"
import {Color} from "./Color.js"
import {Sphere} from "./Sphere.js"
import {Light} from "./Light.js"
import {Camera} from "./Camera.js"

// let objects = [
// 	//new Sphere(new Point(-4, 0, 0), 2, new Color(250, 200, 100)),
// 	new Sphere(new Point(0, -1, 3), 1, new Color(255, 0, 0), 500, 0.2),
// 	new Sphere(new Point(2, 0, 4),  1, new Color(0, 0, 255), 500, 0.3),
// 	new Sphere(new Point(-2, 0, 4), 1, new Color(0, 255, 0), 10,  0.4),

// 	new Sphere(new Point(0, -5001, 0), 5000, new Color(255, 255, 0), 1000, 0.5),
// ];

// let lights = [
// 	new AmbientLight(0.1, new Color(255, 255, 255)),
// 	new PointLight(new Point(2, 1, 0), 0.6, new Color(255, 255, 255)),
// 	new DirectLight(new Point(1, 4, 4), 0.1, new Color(255, 255, 255))
// ]

// let camera = new Camera(new Point(0, 0, -1), new Point(0, 0, 1).normalize());

let objects = [];
let lights = [];
let cameras = [];

let camera;

async function get_file(fname)
{
	const response = await fetch(fname);
	const scene = await response.json();

	return scene;
}

async function parse_scene(fname)
{
	const scene = await get_file(fname);
	// console.log('gg scene', scene);

	for (let _camera of scene['camera'])
		cameras.push(new Camera(_camera));

	for (let _sphere of scene['sphere'])
		objects.push(new Sphere(_sphere));

	for (let _light of scene['light'])
		lights.push(new Light(_light));

	if (cameras.length == 0)
		throw 'there are no cameras in scene';
	console.log('parsed ok');
}

function closest_intersection(start, vec, t_min, t_max)
{
	let dist = Infinity;
	let closest_obj = null;

	for (let obj of objects)
	{
		let t = obj.intersect(start, vec);
		//console.log(`intersected with ${obj.str()} with distance ${t}`);
		if (t <= t_min || t >= t_max)
			continue ;
		if (t < dist)
		{
			dist = t;
			closest_obj = obj;
		}
	}
	return {obj: closest_obj, dist: dist};
}

function reflect_ray(ray, normal)
{
	let dot = normal.dot(ray);
	return normal.mul(dot * 2).isub(ray);
}

function compute_lightning(point, normal, vec, specular)
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
			let t_max;
			if (light.type == Light.POINT_LIGHT)
			{
				L = light.point.sub(point).normalize();
				t_max = 1;
			}
			else if (light.type == Light.DIRECT_LIGHT)
			{
				L = light.direct;
				t_max = Infinity;
			}
			else
				throw 'unknown light type';
			
			// shadows
			let ret = closest_intersection(point, L, 0.0001, t_max);
			if (ret.obj != null)
				continue ;

			// diffuse color
			let normal_angle = normal.dot(L);
			if (normal_angle > 0)
				lt += light.intencity * normal_angle;

			// specular color
			if (specular > 0)
			{
				let R = reflect_ray(L, normal).normalize();
				let specular_angle = R.dot(vec);
				if (specular_angle < 0)
					lt += light.intencity * Math.pow(specular_angle, specular);
			}
		}
	}
	return min(1, lt);
}

function trace_ray(start, vec, t_min, t_max, req_depth)
{
	let col = Color.Black;
	let ret = closest_intersection(start, vec, t_min, t_max);
	let closest_obj = ret.obj;
	let dist = ret.dist;

	if (closest_obj == null)
		return col;
	let point = vec.mul(dist).iadd(start);
	let normal = closest_obj.normal(point);

	col = closest_obj.color;
	let local_color = col.mul(
		compute_lightning(point, normal, vec, closest_obj.specular)
	);

	let reflective = closest_obj.reflective;
	if (req_depth <= 0 || reflective <= 0)
		return local_color;

	let R = reflect_ray(vec, normal).imul(-1);
	let reflected_color = trace_ray(point, R, 0.001, Infinity, req_depth - 1);

	return local_color.imul(1 - reflective).iadd(
		reflected_color.imul(reflective)
	);
}

function draw()
{
	camera = cameras[0];
	console.log('obj', objects);
	console.log('lig', lights);
	console.log('cam', cameras);
	console.log('cur cam', camera);

	let c = document.getElementById('canvas');
	let W = c.width;
	let H = c.height;
	let _1H = 1 / H;
	let _1W = 1 / W;
	let canvas = new Canvas(c);
	canvas.smooth = false;

	console.log(camera);
	for (let z=0; z < W; ++z)
	{
		for (let y=0; y < H; ++y)
		{
			let vec = new Point(
				(z - W / 2) * _1W,
				(y - H / 2) * _1H,
				1
			).normalize();
			camera.matrix.irotate(vec);
			//console.log(`tracing ray ${vec.str()} from ${camera.str()}`);
			let px = trace_ray(camera.position, vec, 0, Infinity, 4);
			canvas.put_pixel(z, H - y, px.red, px.green, px.blue);
		}
	}
	canvas.update();
}

async function start(fname)
{
	const scene = await parse_scene(fname);
	console.log('parsed?');
	draw(scene);
}

start('scene.json', draw);
console.log('ok');
