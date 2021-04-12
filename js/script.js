// Create new wheel object specifying the parameters at creation time.
            let theWheel = new Winwheel({
                'numSegments'       : 4,         // Specify number of segments.
                'outerRadius'       : 152,       // Set outer radius so wheel fits inside the background.
                'drawMode'          : 'image',   // drawMode must be set to image.
                'drawText'          : true,      // Need to set this true if want code-drawn text on image wheels.
                'textFontSize'      : 14,        // Set text options as desired.
                'textOrientation'   : 'curved',
                'textDirection'     : 'reversed',
                'textAlignment'     : 'outer',
                'textMargin'        : 15,
                'textFontFamily'    : 'monospace',
                'textStrokeStyle'   : 'black',
                'textLineWidth'     : 2,
                'textFillStyle'     : 'white',
                'segments'     :                // Define segments.
                [
                   {'text' : 'Team Breakfast'},
                   {'text' : 'Team Lunch'},
                   {'text' : 'Team Diner'},
                   {'text' : 'Team Activity'}
                ],
                'animation' :                   // Specify the animation to use.
                {
                    'type'     : 'spinToStop',
                    'duration' : 5,     // Duration in seconds.
                    'spins'    : 8,     // Number of complete spins.
                    'callbackSound'    : playSound,   // Function to call when the tick sound is to be triggered.
                    'callbackFinished' : alertPrize,
                    'soundTrigger'     : 'pin'        // Specify pins are to trigger the sound, the other option is 'segment'.
                },
                'pins' :				// Turn pins on.
                {
                    'number'     : 16,
                    'fillStyle'  : 'silver',
                    'outerRadius': 3,
                }
            });

            // Create new image object in memory.
            let loadedImg = new Image();

            // Create callback to execute once the image has finished loading.
            loadedImg.onload = function()
            {
                theWheel.wheelImage = loadedImg;    // Make wheelImage equal the loaded image object.
                theWheel.draw();                    // Also call draw function to render the wheel.
            }

            // Set the image source, once complete this will trigger the onLoad callback (above).
            loadedImg.src = "img/SpinWheel_Silverfin.png";



            // Vars used by the code in this page to do power controls.
            let wheelPower    = 0;
            let wheelSpinning = false;

            // -------------------------------------------------------
            // Function to handle the onClick on the power buttons.
            // -------------------------------------------------------
            function powerSelected(powerLevel)
            {
                // Ensure that power can't be changed while wheel is spinning.
                if (wheelSpinning == false) {
                    // Reset all to grey incase this is not the first time the user has selected the power.
                    document.getElementById('pw1').disabled = false;
                    document.getElementById('pw2').disabled = false;
                    document.getElementById('pw3').disabled = false;
                    document.getElementById('wheel-start').disabled = true;

                    // Now light up all cells below-and-including the one selected by changing the class.
                    if (powerLevel == 1) {
                        document.getElementById('pw2').disabled = true;
                        document.getElementById('pw3').disabled = true;
                    }

                    if (powerLevel == 2) {
                        document.getElementById('pw1').disabled = true;
                        document.getElementById('pw3').disabled = true;
                    }

                    if (powerLevel == 3) {
                        document.getElementById('pw1').disabled = true;
                        document.getElementById('pw2').disabled = true;
                    }

                    // Set wheelPower var used when spin button is clicked.
                    wheelPower = powerLevel;
                    document.getElementById('wheel-start').disabled = false;
                }
            }
            // Loads the tick audio sound in to an audio object.
            let audio = new Audio('tick.mp3');

            // This function is called when the sound is to be played.
            function playSound()
            {
                // Stop and rewind the sound if it already happens to be playing.
                audio.pause();
                audio.currentTime = 0;

                // Play the sound.
                audio.play();
            }

            // -------------------------------------------------------
            // Click handler for spin button.
            // -------------------------------------------------------
            function startSpin()
            {
                // Ensure that spinning can't be clicked again while already running.
                document.getElementById('wheel-start').disabled = true;

                if (wheelSpinning == false) {
                    // Based on the power level selected adjust the number of spins for the wheel, the more times is has
                    // to rotate with the duration of the animation the quicker the wheel spins.
                    if (wheelPower == 1) {
                        theWheel.animation.spins = 2;
                    } else if (wheelPower == 2) {
                        theWheel.animation.spins = 5;
                    } else if (wheelPower == 3) {
                        theWheel.animation.spins = 8;
                    }

                    // Disable the spin button so can't click again while wheel is spinning.
                    //document.getElementById('spin_button').src       = "img/spin_off.png";
                    //document.getElementById('spin_button').className = "";

                    // Begin the spin animation by calling startAnimation on the wheel object.
                    theWheel.startAnimation();

                    // Set to true so that power can't be changed and spin button re-enabled during
                    // the current animation. The user will have to reset before spinning again.
                    wheelSpinning = true;
                }
            }

            // -------------------------------------------------------
            // Function for reset button.
            // -------------------------------------------------------
            function resetWheel()
            {
                theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
                theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
                theWheel.draw();                // Call draw to render changes to the wheel.

                document.getElementById('pw1').disabled = false;
                document.getElementById('pw2').disabled = false;
                document.getElementById('pw3').disabled = false;
                document.getElementById('wheel-start').disabled = true;

                wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
            }

            // -------------------------------------------------------
            // Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
            // note the indicated segment is passed in as a parmeter as 99% of the time you will want to know this to inform the user of their prize.
            // -------------------------------------------------------
            function alertPrize(indicatedSegment)
            {
                // Do basic alert of the segment text. You would probably want to do something more interesting with this information.
                alert("Congrats, you won: " + indicatedSegment.text);
            }