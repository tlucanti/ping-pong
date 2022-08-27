
export class Light
{
	static AMBIENT_LIGHT = 0;
	static POINT_LIGHT = 1;
	static DIRECT_LIGHT = 3;

	constructor(type, intencity, color)
	{
		this.type = type;
		this.intencity = intencity;
		this.color = color;
	}
}

export class AmbientLight extends Light
{
	constructor(intencity, color)
	{
		super(Light.AMBIENT_LIGHT, intencity, color);
	}
}

export class PointLight extends Light
{
	constructor(point, intencity, color)
	{
		super(Light.POINT_LIGHT, intencity, color);
		this.point = point;
	}
}

export class DirectLight extends Light
{
	constructor(direct, intencity, color)
	{
		super(Light.DIRECT_LIGHT, intencity, color);
		this.direct = direct.normalize();
	}
}
