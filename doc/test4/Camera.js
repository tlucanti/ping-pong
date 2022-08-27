
import {RotateMatrix} from "./Matrix.js"

export class Camera
{
	constructor(...args)
	{
		if (args.length == 1)
			this.__init_json__(...args);
		else if (args.length == 2)
			this.__init_args__(...args);
		else
			throw 'invalid constructor';
	}

	__init_json__(json)
	{
		this.__init_args__(
			new Point(json['position']),
			new Point(json['direction'])
		);
	}

	__init_args__(pos, dir)
	{
		this.position = pos;
		this.alpha = Math.atan2(dir._x, dir._z);
		if (!isFinite(this.alpha) || isNaN(this.alpha))
			this.alpha = 0;
		this.theta = -Math.atan2(dir._y, dir._z * dir._z + dir._x * dir._x);
		if (!isFinite(this.theta) || isNaN(this.theta))
			this.theta = 0;
		this.gamma = 0;
		this.matrix = new RotateMatrix(this.alpha, this.theta, this.gamma);
	}
}
