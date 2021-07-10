/**
 * @description       : 
 * @Ticket            : 
 * @author            : Juan Moguel
 * @group             : 
 * @last modified on  : 06-23-2021
 * @last modified by  : Juan Moguel
 * Modifications Log 
 * Ver   Date         Author        Modification
 * 1.0   06-23-2021   Juan Moguel   Initial Version
**/
public with sharing class INEGICallout{
	@AuraEnabled
	public static BookWrapper callout(string searchWord){
		try{
			CalloutUtils cu = new CalloutUtils();
			cu.endPoint('https://www.googleapis.com/books/v1/volumes?langRestrict=en&q='+EncodingUtil.urlEncode(searchWord, 'UTF-8'));
			cu.method('GET');
			Map<String, String> collectionHeaders = new Map<String, String>();
			collectionHeaders.put('Content-Type', 'application/json');
			collectionHeaders.put('Authorization', 'Bearer');
			cu.addHeader(collectionHeaders);
			HttpResponse response = cu.send();
			// I use this complete wrapper in order to update the data table in future or save data to Salesforce DataBase
			BookWrapper bookList = (BookWrapper)JSON.deserialize(response.getBody(), BookWrapper.class);
			System.debug('BookList total items' + bookList);
			return bookList;
		} catch (Exception e){
			throw new AuraHandledException(e.getMessage());
		}
	}
	@AuraEnabled
	public static Book__c createBook(string authors, string bookName, string country, string language, string pictureURL, string publishedDate){
		Book__c book = new Book__c();
		book.Authors__c = authors;
		book.Name= bookName;
		book.Country__c= country;
		book.Language__c = language;
		book.Picture_URL__c =pictureURL;
		book.Published_Date__c= publishedDate;

		upsert book;
		return book;
	}
}