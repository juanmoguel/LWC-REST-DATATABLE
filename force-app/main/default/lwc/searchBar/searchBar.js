import { LightningElement,track,wire,api } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'
import restdatapull from '@salesforce/apex/INEGICallout.callout';
export default class SearchBar extends LightningElement {
    @track outputText;


    makeCall() {
        var word= this.template.querySelector('lightning-input').value;
        restdatapull({
            searchWord:word
        }).then(result => {
           
            
           
            //var dirtyData = this.items.slice(0, this.pageSize);
           // this.data = this.formatToTable(dirtyData);
            //this.endingRecord = this.pageSize;
            this.dispatchEvent(new CustomEvent('data',{
                detail: result
            }));
        }).catch(error => {
            console.log(error);
        });

    }

}