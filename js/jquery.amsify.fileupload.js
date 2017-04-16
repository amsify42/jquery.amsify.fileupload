 // Amsify42 FileUpload 1.0.0
 // http://www.amsify42.com
 (function(AmsifyFileUpload, $, undefined) {
 	/**
 	 * default field selector
 	 * @type {String}
 	 */
    var defaultField    	= '.amsify-fileupload-field';
    /**
     * default type
     * @type {String}
     */
    var defaultType     	= '';
    /**
     * default button area selector
     * @type {String}
     */
    var buttonArea       	= '.amsify-fileupload-button-area';
    /**
     * fileInfoArea selector
     * @type {String}
     */
    var fileInfoArea 		= '.amsify-fileupload-info-area';
    /**
     * file select selector
     * @type {String}
     */
    var fileSelect       	= '.amsify-fileupload-select'; 
    /**
     * file info selector
     * @type {String}
     */
    var filesInfo 			= '.amsify-fileupload-info';
    /**
     * file upload selector
     * @type {String}
     */
    var fileUpload 			= '.amsify-fileupload-upload';
    /**
     * files remove selector
     * @type {String}
     */
    var fileRemove 			= '.amsify-fileupload-remove';
    /**
     * default drag area
     * @type {String}
     */
    var defaultDragArea 	= '.amsify-fileupload-drag-area';
    /**
     * default upload file area
     * @type {String}
     */
    var defaultFileInfoArea = '.amsify-fileupload-info';

    /**
     * Making method available through Jquery selector
     * @param  {object} config
     */
    $.fn.amsifyFileUpload = function(config) {
        if(config !== undefined) {
          config['field'] = this;
        } else {
          var config = {field: this};
        }
        var defaultFileUpload = new AmsifyFileUpload.FileUpload;
        defaultFileUpload.set(config);
    };


    /**
     * init the plugin with global settings
     * @param  {object} config
     */
    AmsifyFileUpload.init = function(config) {
      setConfig(config); 
      var defaultFileUpload = new AmsifyFileUpload.FileUpload();
          defaultFileUpload.set();
    };

    /**
     * run the plugin with each instance settings
     * @param  {object} config
     */
    AmsifyFileUpload.set = function(config) {
        var newFileUpload = new AmsifyFileUpload.FileUpload();
            newFileUpload.set(config);
    };


    /**
     * This is like class which can be instantiated multiple times with each setting rules
     */
    AmsifyFileUpload.FileUpload = function(config) {
    	AmsifyFileUpload.FileUpload.prototype.set = function(config) {
	    	var type 		= defaultType;
	    	var field 		= defaultField;
	    	var infoArea 	= defaultFileInfoArea;
	    	var ajaxMethod 	= '';
	    	var callback 	= '';
	    	var extraParams = {};

	    	if(config !== undefined) {
			    if(config.hasOwnProperty('type')) {
			      type = config.type;
			    }
			    if(config.hasOwnProperty('field')) {
			      field = config.field;
			    }
			    if(config.hasOwnProperty('form')) {
			      form = config.form;
			    }
			    if(config.hasOwnProperty('infoArea')) {
			      infoArea = config.infoArea;
			    }
			    if(config.hasOwnProperty('callback')) {
			      callback = config.callback;
			    }
			    if(config.hasOwnProperty('ajaxMethod')) {
			      ajaxMethod = config.ajaxMethod;
			    }
			    if(config.hasOwnProperty('extraParams')) {
			      extraParams = config.extraParams;
			    }
			}

			$(field).each(function(fieldIndex, eachField){

				$(document).on('click', fileSelect, function(){
		            $(eachField).click();
		        });

				$(eachField).hide();
				$(eachField).after('<div class="'+defaultDragArea.substring(1)+'" ondragover="return false">Or drag and drop files here</div>');
				$(eachField).after('<div class="'+fileInfoArea.substring(1)+'">'+getImageInfoHtml(eachField)+'</div>');

				$(eachField).change(function(){
					AmsifyFileUpload.readFileSource(eachField, this.files, config);
				});

				 $(document).on({
			          dragover: function(e) {
			          	e.stopPropagation();
				        e.preventDefault();
				        $(this).css('opacity', '0.7');
			          	$(this).addClass('amsify-drag-border');
			          },
			          dragleave: function(e) {
			          	e.stopPropagation();
				        e.preventDefault();
			          	$(this).css('opacity', '1');
			          	$(this).removeClass('amsify-drag-border');
			          },
			          drop : function(e) {
			          	e.stopPropagation();
				        e.preventDefault();
				        files = e.originalEvent.target.files || e.originalEvent.dataTransfer.files;
			          	AmsifyFileUpload.readFileSource(eachField, files, config);
			          	$(this).css('opacity', '1');
			          	$(this).removeClass('amsify-drag-border');
			          	$(eachField).val('');
			          }
			      }, defaultDragArea);
			});

			// $(document).on('click', fileUpload, function(){
			// 	console.info($(this).closest(field)[0].files);
			// });
		};
    };

    /**
     * read file source of all files and call ajax
     * @param  {selector} field
     * @param  {object}   files
     * @param  {object}   config
     */
    AmsifyFileUpload.readFileSource = function(field, files, config) {

    	if(files) {
    		var fileLimit 	= 5;
    		var maxSize 	= 5;
    		var extensions 	= 'all';
    		if(config !== undefined) {
    			if(config.hasOwnProperty('fileLimit')) {
			      fileLimit = config.fileLimit;
			    }
			    if(config.hasOwnProperty('maxSize')) {
			      maxSize = config.maxSize;
			    }
			    if(config.hasOwnProperty('extensions')) {
			      extensions = config.extensions;
			    }
    		}
    		if(files.length > fileLimit) {
    			AmsifyHelper.showFlash('Maximum '+fileLimit+' images are allowed', 'error');
    			return false;
    		}
    		$('.amsify-fileupload-loader').show();
    		$(filesInfo).show();
			$(fileUpload).show();
	    	$(fileRemove).show();
        	var listHTML 	= '<ol>';
        	$.each(files, function(index, file) {
        		var fileName 	= file.name;
        		var extension 	= fileExt(fileName);
	            fileName 		= AmsifyHelper.shortFileName(fileName);

	            var fileInfo  		= '0%';
	            var sizeInMB 		= (file.size/(1024*1024)).toFixed(2);
	            var allowedUpload	= true;
	            if(sizeInMB > maxSize) {
	            	allowedUpload 	= false;
	            	fileInfo 		= 'max size exceeded';
	            }
	            if(extensions != 'all' && $.inArray(extension, extensions) === -1) {
	            	allowedUpload 	= false;
	            	fileInfo 		= 'file not allowed';
	            }

	        	// reading data if allowed
				if(allowedUpload){      	
		        	var reader 		= new FileReader();
			        reader.onload 	= function(e) {
			        	AmsifyFileUpload.callAjax(e.target.result, index, config);
			        }
			        reader.readAsDataURL(files[index]);
			        listHTML += '<li>'+fileName+' <img id="amsifyupload-loader-'+index+'" class="amsify-fileupload-loader-each" src="'+AmsifyHelper.base_url+'/images/loader-small.gif"/><span class="amsifyupload-percentage" id="amsifyupload-percentage-'+index+'">'+fileInfo+'</span></li>';
		        } else {
		        	listHTML += '<li>'+fileName+' <img id="amsifyupload-loader-'+index+'" class="amsify-fileupload-loader-each" src="'+AmsifyHelper.base_url+'/images/loader-small.gif" style="display:none;"/><span class="amsifyupload-percentage" id="amsifyupload-percentage-'+index+'"  style="background:red;">'+fileInfo+'</span></li>';
		        }
	        });
	        listHTML += '</ol>';
	        $(filesInfo).html(listHTML);
	        $(defaultDragArea).hide();
	        $('.amsify-fileupload-loader').hide();
        }
    };

    /**
     * html section to replace with field selector
     * @param  {selector} field
     * @return {string}
     */
    function getImageInfoHtml(field) {
        var html =  '<div class="'+buttonArea.substring(1)+'">';
        	html +=	'<span title="Select Images" class="'+fileSelect.substring(1)+'">Select Files</span>';
        	html +=	'<img class="amsify-fileupload-loader" src="'+AmsifyHelper.base_url+'/images/loader-small.gif"/>';
			html +=	'<span title="Clear Images" class="'+fileRemove.substring(1)+'">Clear</span>';
			// html +=	'<span title="Upload Images" class="'+fileUpload.substring(1)+'">Upload</span>';
			html += '</div>';
			html +=	'<div class="'+filesInfo.substring(1)+'"></div>';
        removeImageAction();    
		return html;
    };

    /**
     * remove click event
     * @param  {selector} field
     */
    function removeImageAction(field) {
        $(document).on('click', fileRemove, function(){
            $(field).val('');
            $(filesInfo).hide();
            $(fileUpload).hide();
            $(fileRemove).hide();
            $(defaultDragArea).show();
        });
    };

    /**
     * return extension from url or path
     * @param  {string} fileName
     * @return {string}
     */
    function fileExt(fileName) {
    	return fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase();
    };

    /**
     * call ajax for each file
     * @param  {string}  imageContent
     * @param  {integer} index
     * @param  {object}  config
     */
    AmsifyFileUpload.callAjax = function(imageContent, index, config) {

    	var ajaxMethod 	= AmsifyHelper.base_url;
    	var params 		= {index: index, image: imageContent, _token: AmsifyHelper.getToken()};
		if(config !== undefined) {
    		if(config.hasOwnProperty('ajaxMethod')) {
		      ajaxMethod = config.ajaxMethod;
		    }
		    if(config.hasOwnProperty('extraParams')) {
		      params = $.extend({}, params, extraParams);
		    }
	    }

        var ajaxConfig = {};

        ajaxConfig['xhr'] = function() {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function(evt) {
              if(evt.lengthComputable) {
                var percentComplete = parseInt((evt.loaded/evt.total)*100);
                $('#amsifyupload-percentage-'+index).text(percentComplete+'%');
                if(percentComplete === 100) {}
              }
            }, false);
            return xhr;
          };

        ajaxConfig['beforeSend'] = function() {  
            $('#amsifyupload-percentage-'+index).addClass('amsifyupload-processing');
        };

        ajaxConfig['afterSuccess'] = function(data) {
            $('#amsifyupload-percentage-'+index).css('background', 'green');
            if(config.afterUpload && typeof config.afterUpload == "function") {
                config.afterUpload(data);
            }
            // Remove this upload from processing and check if any processing is left
            $('#amsifyupload-percentage-'+index).removeClass('amsifyupload-processing');
            if(!$('.amsifyupload-processing').length) {
                if(config.afterComplete && typeof config.afterComplete == "function") {
                    config.afterComplete(data);
                }
            }
        };

        ajaxConfig['afterError'] = function(data) {
            $('#amsifyupload-percentage-'+index).css('background', 'red').text('not uploaded');
            // Remove this upload from processing and check if any processing is left
            $('#amsifyupload-percentage-'+index).removeClass('amsifyupload-processing');
            if(!$('.amsifyupload-processing').length) {
                if(config.afterComplete && typeof config.afterComplete == "function") {
                    config.afterComplete(data);
                }
            }
        };

        ajaxConfig['afterResponseError'] = function(data) {
            $('#amsifyupload-percentage-'+index).css('background', 'red').text('not uploaded');
        };

        ajaxConfig['complete'] = function() {
            $('#amsifyupload-loader-'+index).hide();
        };

        AmsifyHelper.callAjax(ajaxMethod, params, ajaxConfig);
    };


/**
 * 
 ************ Configuration section ************
 *
 **/

    /**
     * set the global config based on options passed
     * @param {object} config
     */
	function setConfig(config) {
		if(config !== undefined) {
		    if(config.hasOwnProperty('type')) {
		      defaultType = config.type;
		    }
		    if(config.hasOwnProperty('field')) {
		      defaultField = config.field;
		    }
		}
	};


}(window.AmsifyFileUpload = window.AmsifyFileUpload || {}, jQuery));
