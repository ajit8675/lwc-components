import { LightningElement, track, wire } from 'lwc';
import { createRecord, getRecord } from 'lightning/uiRecordApi'
const fieldArray = ['Account.Name', 'Account.Phone', 'Account.Website'];

export default class AccountMangerLDS extends LightningElement {

    accountName;
    accountPhone;
    accountWebsite;
    
    @track recordId;

    @wire(getRecord, {recordId : '$recordId', fields : fieldArray})
    accountRecord;

    accountNameChangeHandler(event){
        this.accountName = event.target.value;
    }
    accountPhoneChangeHandler(event){
        this.accountPhone = event.target.value;
    }
    accountWebsiteChangeHandler(event){
        this.accountWebsite = event.target.value;
    }
    createAccount(){
        
        const fields = {Name:this.accountName, Phone:this.accountPhone, Website:this.accountWebsite};

        const inputObject = {apiName : 'Account', fields};
        createRecord(inputObject).then( result =>{
            this.recordId = result.id;
        }).catch(error => {
            console.log("Error Received:", error.body.message);
        });
    
    }

    get getAccountName(){
        if(this.accountRecord.data){
            return this.accountRecord.data.fields.Name.value;
        }
        return undefined;
    }

    get getAccountPhone(){
        if(this.accountRecord.data){
            return this.accountRecord.data.fields.Phone.value;
        }
        return undefined;
    }

    get getAccountWebsite(){
        if(this.accountRecord.data){
            return this.accountRecord.data.fields.Website.value;
        }
        return undefined;
    }
}