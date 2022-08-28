
import {not_undef} from "./utils.js"

export class Color
{
	constructor(...args)
	{
		if (args.length == 1)
			this.__init_json__(...args);
		else if (args.length == 3)
			this.__init_args__(...args);
		else
			throw 'invalid Color constructor';
	}

	__init_json__(json)
	{
		if (typeof(json) === 'string')
		{
			switch(json)
			{
				case 'red':
					this.__init_args__(255, 0, 0);
					break ;
				case 'green':
					this.__init_args__(0, 255, 0);
					break ;
				case 'blue':
					this.__init_args__(0, 0, 255);
					break ;
				case 'yellow':
					this.__init_args__(255, 255, 0);
					break ;
				case 'cyan':
					this.__init_args__(0, 255, 255);
					break ;
				case 'purple':
				case 'magneta':
					this.__init_args__(255, 0, 255);
					break ;
				case 'black':
					this.__init_args__(0, 0, 0);
					break ;
				case 'white':
					this.__init_args__(255, 255, 255);
					break ;
				default:
					throw `unknown color (${json})`;
			}
			return ;
		}
		this.__init_args__(
			not_undef(json[0]),
			not_undef(json[1]),
			not_undef(json[2])
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
