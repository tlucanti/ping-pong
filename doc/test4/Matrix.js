
export class RotateMatrix
{
	constructor(alpha, theta, gamma)
	{
		const sin_alpha = Math.sin(alpha);
		const sin_theta = Math.sin(theta);
		const sin_gamma = Math.sin(gamma);

		const cos_alpha = Math.cos(alpha);
		const cos_theta = Math.cos(theta);
		const cos_gamma = Math.cos(gamma);

		this._matr = [
			/* (0) 0 */cos_gamma * cos_alpha,
			/* (1) a12 */-sin_gamma * cos_alpha,
			/* (2) a13 */sin_alpha,
			/* (3) a21 */sin_theta * sin_alpha * cos_gamma
							+ sin_gamma * cos_theta,
			/* (4) a22 */-sin_theta * sin_gamma * sin_alpha
							+ cos_theta * cos_gamma,
			/* (5) a23 */-sin_theta * cos_alpha,
			/* (6) a31 */sin_theta * sin_gamma
							- sin_alpha * cos_alpha * cos_theta * cos_gamma,
			/* (7) a32 */sin_theta * cos_gamma
							+ sin_gamma * sin_alpha * cos_theta,
			/* (8) a33 */cos_theta * cos_alpha,
		]
	}

	irotate(vec)
	{
		const dx = this._matr[0] * vec._x + this._matr[1] * vec._y
			+ this._matr[2] * vec._z;
		const dy = this._matr[3] * vec._x + this._matr[4] * vec._y
			+ this._matr[5] * vec._z;
		const dz = this._matr[6] * vec._x + this._matr[7] * vec._y
			+ this._matr[8] * vec._z;

		vec._x = dx;
		vec._y = dy;
		vec._z = dz;
		return vec;
	}
}
