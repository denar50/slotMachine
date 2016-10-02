export const createAnimationRunner = (animation, fps) => {
	var frameCount = 0;
	var fpsInterval, startTime, now, then, elapsed;
	let stop = false

	// initialize the timer variables and start the animation
	function animate() {
		if(stop) return //break the spell
	  // request another frame
	  requestAnimationFrame(animate);

	  // calc elapsed time since last loop

	  now = Date.now();
	  elapsed = now - then;

	  // if enough time has elapsed, draw the next frame

	  if (elapsed > fpsInterval) {
			console.log('animating')
	      // Get ready for next frame by setting then=now, but also adjust for your
	      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
	      then = now - (elapsed % fpsInterval);
				animation()
	      // Put your drawing code here

	  }
	}
	function runAnimation() {
		fpsInterval = 1000 / fps;
		then = Date.now();
		startTime = then;
		animate();
	}

	function stopAnimation() {
		stop = true
	}

	return {
		runAnimation,
		stopAnimation
	}
}
