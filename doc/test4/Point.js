
export class Point
{
	constructor(...args)
	{
		if (args.length == 1)
			this.__init_json__(...args);
		else if (args.length == 3)
			this.__init_args__(...args);
		else
			throw 'invalid constructor';
	}

	__init_json__(json)
	{
		this.__init_args__(
			json[0],
			json[1],
			json[2]
		);
	}

	__init_args__(x, y, z)
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
