import { LightningElement, track } from 'lwc';
import getAccessList from '@salesforce/apex/UserAccessController.getRelatedAccess';

export default class UserAvailablePermssionsComponent extends LightningElement {

    @track userInput;
    @track responseReceived = false;
    @track accessObject = {};

    userInputChangeHandler(event){
        this.userInput = event.target.value;
    }

    getAvailableAccess(){
        if(this.userInput!=''){
            getAccessList({s: this.userInput}).then( response =>{
                this.accessObject = response;
                this.responseReceived = true;
                console.log('Permissions', this.accessObject.permissionSets);
                console.log('Public Groups', this.accessObject.publicGroups);
            }).catch(error => {
                console.log('Error messag', error.body.message);
            });
            console.log(this.userInput);
        }
    }
}