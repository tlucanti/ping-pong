
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
		return new Color(this.red * factor, this.green * factor, this.blue * factor);
	}

	static Black = new Color(0, 0, 0);
}
