// Load cvit as a module and run. This ensures single point of entry.
// TODO: Use require text module to start by reading in configuration text
// file first

require(["cvit/cvit","cvit/file/file","draw/glyph/glyph"],function(cvit,file,glyph){
		console.log("CViTjs: Starting CViTJS");
		// cvit.init(dataset) to have the provided dataset
		//override defaults or URI string
	        // cvit.init returns the backbone group of the async
	        // drawing operations, allowing you to manually draw 
	        // files after completion  
		
	        cvit.init(Drupal.settings.blast_ui.dataset).then( function(group){

	        var test = file.getFile(Drupal.settings.blast_ui.gff).then(
	           function( result ) {
			data = result;
			console.log(result);
			data.match.features.forEach(function(element){
			    var rework = element.seqName.split('.');
			    element.seqName= rework[1]+'.'+rework[2];
		            console.log(element);
			});
			var draw = glyph.drawGlyph(data.match, cvit.conf, cvit.viewInfo, group).then(
		            function(){
				 console.log("Drawn");
				 paper.view.draw();
			     },
			    function(errorMessage){
			         console.log(errorMessage);
			     });
			}, 
			function(errorMessage) {
			    console.log(errorMessage);
			});
		});
	});
