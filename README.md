# Amsify Jquery File Upload

This is the Jquery plugin for multiple file upload by calling ajax.

#### Requires
1. **jquery.js** library
2. **jquery.amsify.helper.js** file which is there in my **jquery.amsify.helper** repository with all its css and image files.

This is the way you can initialize it.
```js
  $('[name="images"]').amsifyFileUpload();
```

The selector your passed to this initialization will be hidden and button for uploading multiple files will appear with both option of click and drag and drop.<br/>
These are the options you can pass:

```txt
  ajaxMethod : Action URL for ajax, it can be absolute or relative url
  extensions : It is an array of extensions which are to be allowed
  afterUpload : This will trigger after each image is being uploaded to server
  afterComplete : This will trigger after all image are uploaded to server
```

```js
  $('[name="images"]').amsifyFileUpload({
    ajaxMethod 	: 'fileupload/upload.php',
    extensions 	: ['png', 'jpg', 'jpeg'],
    afterUpload : function(data){
      console.info('After each upload');	
    },
    afterComplete : function(data){
      console.info('After all uploads');	
    }
  });
```

