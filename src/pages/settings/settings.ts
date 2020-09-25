import { Component } from '@angular/core';
// import { Storage } from '@ionic/storage';

// import { NavController } from 'ionic-angular';

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
	isShakeOn: boolean;
	isBrightnessOn: boolean;
	descriptionTextF: string;
	descriptionTextL: string;
	titleOfShake: string = "Shake description";
	titleOfBrightness: string = "Brightness description";
	settingsVariables: any;
    
    constructor() {
    	this.isShakeOn = true;
		this.isBrightnessOn = true;

    	this.settingsVariables = localStorage.getItem('settingsVars');
    	this.settingsVariables = JSON.parse(this.settingsVariables);
    	console.log(this.settingsVariables);
    	if(this.settingsVariables){
	    	this.isShakeOn = this.settingsVariables.isShakeOn;
	    	this.isBrightnessOn = this.settingsVariables.isBrightnessOn;
	    	console.log("isShakeOn = "+this.isShakeOn+" , "+"isBright = "+this.isBrightnessOn);
	    	
	    	// Write description on screen
	    	this.setShakeDescriptionOnScreen();
			this.setBrightnessDescriptionOnScreen();
    	}
    }

  	ionViewDidLoad() {
    	console.log('ionViewDidLoad SettingsPage');
  	}

  	toggleShaker(): void {
  		this.isShakeOn = !this.isShakeOn;
  	}

  	getShaker(): boolean {
  		let shakerBool: boolean;
  		shakerBool = this.isShakeOn;
  		return shakerBool;
  	}

  	getBrightness(): boolean {
  		let brightnessStrength: boolean;
  		brightnessStrength = this.isBrightnessOn;
  		return brightnessStrength;
  	}

  	setShakeDescriptionOnScreen(): void {
  		// if(this.isShakeOn) {
  			this.descriptionTextF = "allow you control flash by shaking the device";	
  		// }
  	}

  	setBrightnessDescriptionOnScreen(): void {
  		// if(this.isBrightnessOn) {
  			this.descriptionTextL = "recomended for devices without flash";
  		// }
  	}

  	// LS is LocalStorage in short
  	saveVariablesOnLS(): void {
  		console.log("isShakeOn = "+this.isShakeOn+" , "+"isBright = "+this.isBrightnessOn);
  		let dataJson = {
  			isShakeOn: this.isShakeOn,
			isBrightnessOn: this.isBrightnessOn
  		}
  		localStorage.setItem('settingsVars', JSON.stringify(dataJson));
  	}
}
