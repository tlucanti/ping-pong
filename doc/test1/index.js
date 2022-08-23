
let count = 0;

document.getElementById('dec').onclick = function()
{
	--count;
	document.getElementById('cnt').innerHTML = count;
}

document.getElementById('res').onclick = function()
{
	count = 0;
	document.getElementById('cnt').innerHTML = count;
}

document.getElementById('inc').onclick = function()
{
	++count;
	document.getElementById('cnt').innerHTML = count;
}

	
