
let count = 0;

document.getElementById('dec').onclick = function()
{
	--count;
	cocument.getElementById('dec').innerHTML = count;
}

document.getElementById('res').onclick = function()
{
	count = 0;
	cocument.getElementById('res').innerHTML = count;
}

document.getElementById('inc').onclick = function()
{
	++count;
	cocument.getElementById('inc').innerHTML = count;
}

	
