import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { Shake } from 'ionic-native';
import { Flashlight } from 'ionic-native';
import { Brightness } from 'ionic-native';
import { SpeechRecognition } from '@ionic-native/speech-recognition';

import { SettingsPage } from '../../pages/settings/settings';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	time: number;
	visible: boolean; 
	isStop: boolean;
	sosBtnId: string;
	isRunningSos: boolean;
	brightnessValue: number;
	pastBrightness: number;
	whiteScreen: string;
	screenFlashTitle: string;
	isRunningFlashing: boolean;
	twoFlashRunning: boolean;

  	constructor(public navCtrl: NavController, public eventH: Events, public speechRecognition: SpeechRecognition, public settingsV: SettingsPage) {
  		this.time = 0;
  		this.visible = true;
  		this.isStop = false;
  		this.sosBtnId = 'sosBtn';
  		this.isRunningSos = false;
  		this.whiteScreen = 'transBtn';

  		// Set volume of app in mute
		cordova.plugins.VolumeControl.setVolume(0, ()=>{ 
			console.log('success'); 
		}, 
		(ex)=>{
			console.log('There was Ex: '+ex);
		});

  		if(settingsV.getShaker()){
	  		let watch = Shake.startWatch(20).subscribe(() => {
				console.log("starting shake callback");
				if(!this.isRunningSos && !this.isRunningFlashing && !this.twoFlashRunning){
					if(Flashlight.available()){
						if(Flashlight.isSwitchedOn()){
							return this.turnOff();
						}
						return this.turnOn();
					}
				}else{
					alert("Please turn off others mode");
				}
			});
		}

		// Recognized Returned SMS form another device that added by him
		if(true){
			this.speechHandler();
		}
  	}

  	speechHandler(): void {
  		let speachRecognitionOptions = {
		  language: "en-US",
		  matches: 5,
		  prompt: "",      // Android only
		  showPopup: false,  // Android only
		  showPartial: false // iOS only
		}

  		// Check feature available
		this.speechRecognition.isRecognitionAvailable().then((available: boolean) => { 
	  		console.log(available);
	  		if(available){
	  			// Start the recognition process
				this.speechRecognition.startListening(speachRecognitionOptions).subscribe(
				    (matches: Array<string>) => { 
				    	console.log(matches);
				    	for (var i = 0; i <= matches.length; i++) {
				    		if(matches[i] == 'turn on'){
				    			console.log('turn on');
				    			this.turnOn();
				    		}else{
				    			if(matches[i] == 'turn off'){
				    				console.log('turn off');
				    				this.turnOff();
				    			}
				    		}
				    	}
				    	
				    	setTimeout(()=>{
							// Like "recorsive" function every one second
							this.speechHandler();
						}, 1000);
				    },
				    (onerror) => { 
				    	console.log('error:', onerror);
				    	setTimeout(()=>{
							// Like "recorsive" function every one second
							this.speechHandler();
						}, 1000);
					}
				  )
	  		}
	  	});
  	}

	turnOn(): void {
		if(this.time || this.time == 0){
			if(Flashlight.available()){
				if(!Flashlight.isSwitchedOn()){
					Flashlight.switchOn();
					// When visible = true so the turnOn btn will shown and when it false the turnOff will shown
					this.visible = false;
				}
			}else{
				this.turnOnScreenFlash();
			}
		}else{
			alert("turn the flash to 0");
		}
	}

	turnOff(): void {
		if(this.time || this.time == 0){
			if(Flashlight.available()){
				if(Flashlight.isSwitchedOn()){
					Flashlight.switchOff();
					// When visible = true so the turnOn btn will shown and when it false the turnOff will shown
					this.visible = true;
				}else{
					alert("Flashlight turned off")
				}
			}else{
				this.turnOffScreenFlash();
			}
		}else{
			alert("turn the flash to 0");
		}	
	}

	preapreSos(): void {
		this.isStop = !this.isStop;
		this.startSos(this.isStop);
	}

	startSos(isStop): void {
		console.debug(isStop);
		if(this.time || this.time == 0){
			if(isStop){
				if(Flashlight.available()){
					this.sosBtnId = 'activatedSosBtn';
					this.isRunningSos = true;
					console.log("toggling flash");
					Flashlight.toggle();
					
					setTimeout(()=>{
						if(this.isStop){
							// Like "recorsive" function every one second
							this.startSos(isStop);
						}else{
							if(Flashlight.isSwitchedOn()){
								this.turnOff();
							}
							this.sosBtnId = 'sosBtn';
						}
						this.isRunningSos = false;
					}, 1000);	
				}else{
					this.turnOnScreenFlash();
				}
			}
		}
	}

	prepareForFlashing(): void {
		let pastTime = this.time;
		console.log('('+pastTime+', '+this.time+")");
		setInterval(()=>{
			if(pastTime == this.time){
				this.flashingByTime(this.time);
			}
		}, 2000);
	}

	flashingByTime(time): void {
		console.debug(time);
		if(this.time != 0){
			if(Flashlight.available()){
				// this.sosBtnId = 'activatedSosBtn';
				if(!this.isRunningSos){
					console.log("toggling flash");
					Flashlight.toggle();
					
					setTimeout(()=>{
						if(this.time != 0){
							this.isRunningFlashing = true;
							// Like "recorsive" function every one second
							this.flashingByTime(this.time);
						}else{
							this.isRunningFlashing = false;
							Flashlight.switchOff();
						}
					}, (time * 1000));
				}else{
					alert("Turn off Sos mode");
				}
			}else{
				this.turnOnScreenFlash();
			}
		}
	}

	goTosettings(): void {
		this.navCtrl.push(SettingsPage);
	}

	turnOnScreenFlash(): void {
		if(this.settingsV.getBrightness()){
			Brightness.getBrightness().then((successVal) => {
				this.pastBrightness = successVal;
			});
			this.brightnessValue = 1;
			// Turn screen white without object on screen
			this.whiteScreen = 'activatedBtn';
			this.screenFlashTitle = 'Tap to cancel';

			// Brightness controlling
			Brightness.setBrightness(this.brightnessValue);
			// Brightness.setKeepScreenOn();
		}
	}

	turnOffScreenFlash(): void {
		this.pastBrightness;
		this.screenFlashTitle = '';
		// Turn screen white without object on screen
		this.whiteScreen = 'transBtn';

		// Brightness controlling
		Brightness.setBrightness(this.pastBrightness);
	}

	turnOnTwoSideFlash(): void {
		this.twoFlashRunning = true;
		this.turnOn();
		this.turnOnScreenFlash();
	}

	turnOffTwoSideFlash(): void {
		this.twoFlashRunning = false;
		this.turnOff();
		this.turnOffScreenFlash();
	}
}
