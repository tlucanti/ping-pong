
export function min(a, b)
{
	return a > b ? b : a;
}

export function max(a, b)
{
	return a > b ? a : b;
}

export function not_undef(val)
{
	if (val === undefined)
		throw 'undefined value assertion';
	return val;
}

