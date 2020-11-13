<p>This is a website that uses webgl to display three cubes, one with bump mapping, one with toon shading, one with rainbow shading, and all with varying amount of fog. This code was adapted from a template that allowed for displayign any image with white shading.</p>
<p>Index.php and index.css are what handles the main website. The skeleton of the shaders and getting the webgl set up are part of the template, but they have been adjusted to account for bump mapping, toon shading, and fog. The sliders are my addition.</p>
<p>The other file of note is js/demo.js. It was adjusted from a template to display one object with minimal shading. The adjusting to have models and to have shading were my code, as was the jquery to read in what the sliders have, and feed that into the shaders so they can adjust accordingly.


![Graphics Example Image](https://github.com/eplank18/best_hits/blob/main/Graphics%20Final%20Project/Graphics%20Example.png)
<p>This is what the website looks like in action. The sliders' look was added in HTML, and Javascripit was used to read in their values, figure out what values to use for each cube, then send that to the shaders and adjust the amount of fog accordingly.</p>
