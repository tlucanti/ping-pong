
export class Canvas
{
	constructor(canvas)
	{
		this._canvas = canvas;
		this._context = canvas.getContext('2d');
		
		this.width = canvas.width;
		this.height = canvas.height;
		
		this._image = this._context.getImageData(0, 0, canvas.width, canvas.height);
		this._data = this._image.data;

		this._smooth = true;
	}

	put_pixel(x, y, r, g, b)
	{
		let base = y * this.width + x;
		base *= 4;
		this._data[base] = r;
		this._data[base + 1] = g;
		this._data[base + 2] = b;
		this._data[base + 3] = 255;
	}
	
	update()
	{
		this._context.putImageData(this._image, 0, 0);
	}

	get smooth()
	{
		return this._smooth;
	}

	set smooth(val)
	{
		if (val != true && val != false)
			throw 'smooth value can be only `false` or `true`';
		this._context.imageSmoothingEnabled = val;
		this._context.mozImageSmoothingEnabled = val;
		this._context.webkitImageSmoothingEnabled = val;
		this._context.msImageSmoothingEnabled = val;
		this._smooth = val;
	}
}
