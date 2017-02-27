// Load cvit as a module and run. This ensures single point of entry.
// TODO: Use require text module to start by reading in configuration text
// file first

require(["cvit/cvit"],function(cvit){
		console.log("CViTjs: Starting CViTJS");
		// cvit.init(dataset) to have the provided dataset
		//override defaults or URI string
        var passedData = document.getElementById('cvit-div');
        var dataset = undefined;
        var gff = undefined;
        
        if(passedData.dataset.dataset){
            dataset= passedData.dataset.dataset;
        }

        if(dataset !== undefined){
          cvit.init(dataset);
        } else { 
		  cvit.init();
        }
	});
