
export class Light
{
	static AMBIENT_LIGHT = 0;
	static POINT_LIGHT = 1;
	static DIRECT_LIGHT = 3;

	constructor(...args)
	{
		if (args.length == 1)
			this.__init_json__(args);
		else if (args.length == 3 || args.length == 4)
			this.__init_args__(...args);
		else
			throw 'invalid constructor';
	}

	__init_json__(json)
	{
		switch (json['type'])
		{
			case 'ambient':
				__init_ambient__(
					json['intencity'],
					new Color(json['color'])
				);
				break ;
			case 'point':
				__init_point__(
					new Point(json['position']),
					json['intencity'],
					new Color(json['color'])
				);
				break ;
			case 'direct':
				__init_direct__(
					new Point(json['direction']),
					json['intencity'],
					new Color(json['color'])
				);
				break ;
			default:
				throw 'invalid light type';
		}
	}

	__init_args__(...args)
	{
		switch (args[0])
		{
			case Light.AMBIENT_LIGHT:
				this.__init_ambient__(args[1], args[2]);
				break ;
			case Light.POINT_LIGHT:
				this.__init_point__(args[1], args[2], args[3]);
				break ;
			case Light.DIRECT_LIGHT:
				this.__init_direct__(args[1], args[2], args[3]);
				break ;
			default:
				throw 'invalid light type';
		}
	}

	__init_ambient__(intencity, color)
	{
		this.type = Light.AMBIENT_LIGHT;
		this.intencity = intencity;
		this.color = color;
	}

	__init_point__(point, intencity, color)
	{
		this.type = Light.POINT_LIGHT;
		this.point = point;
		this.intencity = intencity;
		this.color = color;
	}

	__init_direct__(direct, intencity, color)
	{
		this.type = Light.DIRECT_LIGHT;
		this.direct = direct;
		this.intencity = intencity;
		this.color = color;
	}
}
