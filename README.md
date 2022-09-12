# Viewport library example page
https://viewport-101.herokuapp.com/

# Viewport library documentation page
https://viewport-101.herokuapp.com/doc.html

# Getting Started
Download the Viewport folder, ensure both Viewport.js and style.css are in it.
Place the folder at the same level of you HTML file.
Use standard HTML and load the Viewport library:

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Viewport Demo</title>
    <script defer type="text/javascript" src='./Viewport/Viewport.js'></script>
    <script defer type="text/javascript" src='./your_javascript_file.js'></script>
    <link rel="stylesheet" type="text/css" href="your_stylesheet.css">
</head>
<body>
  
</body>
</html>
```

You can modify img src below so it finds some images on your machine.
Add this code to your HTML body:

```HTML
<div id="myViewList">
	<a href="https://www.google.com">
		<img class="myView" src="./image/random-pic.jpg">
	</a>
	<img class="myView" src="./image/random-pic1.jpeg">
	<img class="myView" src="./image/random-pic2.jpg">
	<img class="myView" src="./image/random-pic3.jpg">
	<img class="myView" src="./image/random-pic4.jpg">
	<div class="myView">
		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut semper justo ut venenatis maximus.
		Cras vestibulum urna dolor, ut aliquet ex vehicula nec. Morbi dictum est non arcu rutrum efficitur.
		Integer in quam tincidunt, accumsan neque ac, varius libero. Proin aliquam nisi ante, vitae
		ultricies lorem laoreet nec. Nam ut eros vulputate, pulvinar ipsum et, molestie libero. Curabitur
		nec faucibus odio. Donec convallis vestibulum volutpat.
	</div>
</div>
```

And this to your_javascript_file.js:

```
"use strict";
const viewport = new Viewport()
const myViewList = document.querySelector("#myViewList")
const allViews = document.querySelectorAll(".myView")
viewport.makeView(myViewList, allViews)
```

Refresh your HTML page and now you should see small blocks of your images and textboxes arranged.