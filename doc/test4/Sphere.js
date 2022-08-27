
import {min, max} from "./utils.js"

export class Sphere
{
	constructor(center, radius, color, specular)
	{
		this.center = center;
		this.radius = radius;
		this.color = color;
		this.specular = specular;

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
