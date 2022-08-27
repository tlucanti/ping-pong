
export class Color
{
	constructor(red, green, blue)
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
