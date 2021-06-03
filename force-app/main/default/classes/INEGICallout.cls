public with sharing class INEGICallout{
	@AuraEnabled
	public static BookWrapper callout(){
		try{
			CalloutUtils cu = new CalloutUtils();
			cu.endPoint('https://www.googleapis.com/books/v1/volumes?langRestrict=en&q=salesforce');
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
}