import { LightningElement, api, track, wire } from 'lwc';
import restdatapull from '@salesforce/apex/INEGICallout.callout';
import createBook from '@salesforce/apex/INEGICallout.createBook';
import Book_field from '@salesforce/schema/Rental__c.Book__c';
import Contact_field from '@salesforce/schema/Rental__c.Contact__c';
import Rdate_field from '@salesforce/schema/Rental__c.Return_Date__c';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'
export default class CmpCallout extends LightningElement {
    @track fields=[Book_field,Contact_field,Rdate_field];
    @track bookId;
    @track bShowModal = false;
    @track responsedata;
    @track columns = [
        
        { label: 'Book Cover', fieldName: 'selfLink', type: 'image' },
        { label: 'Title', fieldName: 'title', type: 'text' },
        { label: 'Language', fieldName: 'language', type: 'text' },
        { label: 'Authors', fieldName: 'textSnippet', type: 'text' },
        { label: 'Published date', fieldName: 'publishedDate', type: 'date' },
        { label: 'Country', fieldName: 'country', type: 'text' },
        {label: 'Rent',
        type: 'button-icon',
        initialWidth: 75,
        typeAttributes: {
            iconName: 'action:preview',
            title: 'Rent',
            variant: 'border-filled',
            alternativeText: 'Rent'
        }}
    ];
    @track page = 1;
    @track items = [];
    @track data = [];
    @track startingRecord = 1;
    @track endingRecord = 0;
    @track pageSize = 5;
    @track totalRecountCount = 0;
    @track totalPage = 0;
    @track allData = [];

    /*
    makeCall() {
        restdatapull().then(result => {
            console.log('result 0 ' + result);
            console.log('result: ' + JSON.stringify(result));
            this.totalRecountCount = result.totalItems;
            console.log('totalItems---' + this.totalRecountCount);
            this.items = result.items;
            console.log('result items---' + this.items[0].volumeInfo.title);
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
            console.log('totalPage---' + this.pageSize);
            var dirtyData = this.items.slice(0, this.pageSize);
            this.data = this.formatToTable(dirtyData);
            this.endingRecord = this.pageSize;
        }).catch(error => {
            console.log(error);
        });

    }
    */
    handleData(event){
        console.log('event '+ JSON.stringify(event.detail));
        
        console.log('entro a');
       this.totalRecountCount = event.detail.totalItems;
       console.log('this total ' + event.detail.totalItems);
        this.items = event.detail.items;
        console.log('items' + this.items);
      this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
       var dirtyData = this.items.slice(0, this.pageSize);
      this.data = this.formatToTable(dirtyData);
        this.endingRecord = this.pageSize;
    }
    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
    }

    //clicking on next button this method will be called
    nextHandler() {
        if ((this.page < this.totalPage) && this.page !== this.totalPage) {
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);
        }
    }
    displayRecordPerPage(page) {

        this.startingRecord = ((page - 1) * this.pageSize);
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount)
            ? this.totalRecountCount : this.endingRecord;

        // Get specific data for this data table    
        var dirtyData = this.items.slice(this.startingRecord, this.endingRecord);

        this.data = this.formatToTable(dirtyData);
        this.startingRecord = this.startingRecord + 1;
    }
    formatToTable(data) {
        var cleanData = [];
        for (let index = 0; index < data.length; index++) {
            var oneColum = new Object();
            oneColum.selfLink = data[index].volumeInfo.imageLinks.smallThumbnail;
            oneColum.title = data[index].volumeInfo.title;
            oneColum.language = data[index].volumeInfo.language;
            oneColum.textSnippet = data[index].volumeInfo.authors.toString();
            console.log('authors' + oneColum.textSnippet);
            oneColum.publishedDate = data[index].volumeInfo.publishedDate;
            oneColum.country = data[index].saleInfo.country;
            cleanData.push(oneColum);
            console.log('data ' + JSON.stringify(oneColum));
        }

        return cleanData;
    }

    handleRowAction(event) {

        const row = event.detail.row;
        console.log('el row es :'+ JSON.stringify (row));
        createBook({authors:row.textSnippet,bookName:row.title,country:row.country,language:row.language,pictureURL:row.pictureURL,publishedDate:row.publishedDate}).then(result => {
            if (result.Id!==undefined) {
                this.bookId= result.Id;
                this.bShowModal = true; // display modal window
            }
        });
        //this.record = row;
       
    }
 
    // to close modal window set 'bShowModal' tarck value as false
    closeModal() {
        this.bShowModal = false;
    }
    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: "Rental created",
            message: "Record successfully created" ,
            variant: "success"
        });
        this.dispatchEvent(evt);
        this.bShowModal= false;
    }

}