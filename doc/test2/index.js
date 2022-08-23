
let answer = Math.floor(Math.random() * 20 + 1);
let cnt = 1;

document.getElementById('submit').onclick = function()
{
	let num = Number(document.getElementById('inp').value);
	let status = document.getElementById('status');

	if (num == answer)
	{
		status.innerHTML = `congratulations you guessed in ${cnt} turns`;
		answer = Math.floor(Math.random() * 20 + 1);
		ok = true;
		cnt = 0;
	}
	else if (num < answer)
		status.innerHTML = `turn ${cnt}: number is bigger`;
	else
		status.innerHTML = `turn ${cnt}: number is smaller`;
	++cnt;
}

