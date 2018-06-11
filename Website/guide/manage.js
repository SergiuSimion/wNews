var aboutSection = document.getElementById('aboutSection'),
	howItWorksSection = document.getElementById('howItWorksSection');
	
var content = document.getElementsByClassName('content')[0],
	options = document.getElementsByClassName('options')[0],
	main = document.getElementsByClassName('main')[0];
	 
var displaySettings = false;
function showContent(section) {

	if (section == "about") {
		main.scrollTop = 0;
		content.style.display = 'none';
		aboutSection.style.display = 'block';
	} else {
		aboutSection.style.display = 'none';
		content.style.display = 'block';
		displaySettings = !displaySettings;
		if (displaySettings == true) {
			howItWorksSection.style.display = 'block';
		} else {
			howItWorksSection.style.display = 'none';
		}
	}

	

	//content.innerHTML = '';
/*	var text = document.getElementById(section + 'Section');

	if (displaySettings == true ) {
		text.style.display = 'block';
		if (section == "about") {
			content.appendChild(text);
		} else {
			options.appendChild(text);
		}
	} else {
		text.style.display = 'none';
	}
	*/
	
}