

const div = document.getElementById('div');
const up = document.getElementById('up');
const tp = document.getElementById('top');
const left = document.getElementById('left');

div.addEventListener('mouseover', over);
div.addEventListener('mouseout', out);

let x = 0;
let y = 0
let timer = null;

function over()
{
	timer = setInterval(rotate, 10);
	let element = this;

	function rotate()
	{
		x += 1;
		y += 1;

		trans_top = `rotateX(${y}deg) rotateY(${x}deg)`;
		trans_up = `rotateX(${90 + y}deg)`;
		trans_left = `rotateY(${90 + x}deg) rotateX(${-y}deg)`;

		tp.style.transform = trans_top;
		up.style.transform = trans_up;
		left.style.transform = trans_left;
		//trans = `rotateX(${deg*1}deg) rotateY(${deg*2}deg) rotateZ(${deg*3}deg)`;
		//div.style.transform = trans;
	}
}

function out()
{
	clearInterval(timer);
}

