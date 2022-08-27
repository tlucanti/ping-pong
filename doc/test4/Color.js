
export class Color
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

	__init_args__(red, green, blue)
	{
		this.red = red;
		this.green = green;
		this.blue = blue;
	}

	mul(factor)
	{
		return new Color(
			this.red * factor,
			this.green * factor,
			this.blue * factor
		);
	}

	imul(factor)
	{
		this.red *= factor;
		this.green *= factor;
		this.blue *= factor;
		return this;
	}

	add(col)
	{
		return new Color(
			this.red + col.red,
			this.green + col.green,
			this.red + col.red
		);
	}

	iadd(col)
	{
		this.red += col.red;
		this.green += col.green;
		this.blue += col.blue;
		return this;
	}

	static Black = new Color(0, 0, 0);
}
