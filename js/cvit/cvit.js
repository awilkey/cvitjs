/*
 * file: cvit.js
 *
 * purpose: A Javascript version of CViT.
 *
 * main methods:
 *   makeImage(divname, gff)      = create a new CViTjs image inside a <div> and
 *                                  draw features described by gff array.
 *   drawGffFeatures(gff)         = draw a new set off features on an existing
 *                                  image.
 *   readGff(raw)                 = parse file into GFF records.
 *   removeGffFeatures(gff)       = remove the features described by gff array.
 *   removeClassCss(classname, cssclassname)
 *                                = remove css class for a class of glyphs.
 *   restoreClassStyle(classname, attr)
 *                                = restore default style for a class of glyphs.
 *   setClassCss(classname, cssclassname)
 *                                = assign a css class to a class of glyphs.
 *   setClassStyle(classname, attr, value)
 *                                = change a style setting on a class of glyphs.
 *
 */

// note here that domReady! means that cvit.js won't be called until after the
// dom is ready to be manipulated.

define( [ 'jquery', 'paper', 'cvit/file/file', 'cvit/menu/menus', 'draw/general', 'draw/glyph/glyph', 'text!../../cvit.conf', 'tools/zoom/zoom', 'mousewheel', 'domReady!' ],
  function( $, paper, file, menu, general, glyph, cvitConf, zoom ) {

    return {
      init: function(dataset) {
        // Good Practice to store this context in a variable, to use later.
        var thisC = this;
        // Change this if you want to set your main configuration file somewhere else.
        var viewConf = '';
        var defaultData = '';
        this.conf = {};
        this.data = {};
        this.viewInfo = {};
	this.dataset =  dataset ? dataset : false;
        // try to load main configuration information.
        var locations = thisC.getSettings( file.parse.conf( cvitConf ), thisC.dataset );
        viewConf = locations.conf;
        defaultData = locations.defaultData;

        console.log( 'CViTjs: Initializing Canvas' );
        // Add canvas element to page
        try {
          var canvas = '<canvas id="cvit-canvas" style="background-color:#6f6f6f;"  resize>';
          var overlay = $( '<div id="overlay" class="hover_div" style="position:absolute; display:block;">' );
          $( canvas ).css( 'position', 'absolute' );
          $( '#cvit-div' ).css( 'position', 'relative' );
          $( '#cvit-div' ).append( overlay );
          $( '#cvit-div' ).append( canvas );
          $( '#cvit-canvas' ).width( 1000 );
          $( '#cvit-canvas' ).height( 500 );
          $( '#cvit-canvas' ).css( "background-color", "white" );
          paper.setup( 'cvit-canvas' );
        } catch ( err ) {
          console.log( 'CViTjs: Error: Was not able to find canvas.' );
          return;
        }

	viewConf = viewConf;
	defaultData = defaultData;
        // read view configuration and baseGff (ASYNC)
        // .then(success,failure)
	
        var readConfig = file.getFile( viewConf, true ).then(
          function( result ) {
            console.log( "CViTjs: Successfully loaded configuration." );
            thisC.conf = result;
          },
          function( errorMessage ) {
            console.log( errorMessage );
          } );

        var readChromosome = file.getFile( defaultData ).then(
          function( result ) {
            console.log( "CViTjs: Successfully loaded backbone data." );
            thisC.data = result;
          },
          function( errorMessage ) {
            console.log( errorMessage );
          } );


        var backbone = $.when( readChromosome, readConfig ).then(
          function( result ) {
            if ( thisC.data.chromosome === undefined || thisC.data.chromosome === null ) {
              throw new Error( 'CViTjs: Error: No chromosome data loaded.' );
            }
            // set glyphs for the data sections in the form glyph:display.
            var featureGlyph;
            var display;
            thisC.view.setGlyphs.call( thisC );
            console.log( "CViTjs: Drawing requested view." );
            thisC.view.getBounds.call( thisC, thisC.data.chromosome );
            thisC.viewInfo.xOffset = parseInt( thisC.conf.general.image_padding );
            thisC.viewInfo.yOffset = parseInt( thisC.conf.general.chrom_padding_top ) >= thisC.viewInfo.xOffset ? parseInt( thisC.conf.general.chrom_padding_top ) : thisC.viewInfo.xOffset;
            thisC.viewInfo.yScale = thisC.view.setZoom( thisC.data.chromosome.min, thisC.data.chromosome.max, thisC.viewInfo.yOffset );
            thisC.viewInfo.chromWidth = parseInt( thisC.conf.general.chrom_width );
            thisC.viewInfo.xMin = thisC.data.chromosome.min;
            thisC.data.zoom = thisC.view.setZoom( thisC.data.chromosome.min, thisC.data.chromosome.max );
            //actually draw the darn glyohs
            var cvitView = new paper.Group();
			cvitView.name = 'backbone';
            var group = general.drawGlyph( thisC.data, thisC.conf, thisC.viewInfo ).then( function( group ) {
              paper.view.draw();
              group.name = 'view';
              cvitView.addChild( group );
              menu.build( thisC.conf, thisC.viewInfo, group );
		    paper.view.draw();
              for ( var confGroup in thisC.conf ) {
                if ( thisC.conf.hasOwnProperty( confGroup ) ) {
                  thisC.viewInfo.viewName = confGroup;
		  var dataLoc = thisC.conf[confGroup].dataLoc;
                  if (thisC.data[dataLoc]) {
                    var rangeGet = glyph.drawGlyph( thisC.data[ dataLoc ], thisC.conf, thisC.viewInfo, group ).then(
                      function() {
                        paper.view.draw();
                      },
                      function( errorMessage ) {
                        console.log( errorMessage );
                      }
                    );
                  }
				  paper.view.draw();
                }
              }
              paper.view.draw();
	      return group;
            } );

		 
            //Enable zoom and pan controls
            zoom.enableZoom( paper.view.bounds );
	    return group;
          },

          function( errorMessage ) {
            console.log( errorMessage );
          } );
	  return backbone;
      },

      /**
       * Setup functions for getting the boundries required to draw the canvas.
       *
       */

      view: {

        /**
         * Read over data to draw and set the maximum Y positions based on
         * the maximum of the provided backbone
         *
         * @param chromosomeData {Object} Backbone data
         *
         */
        getBounds: function( chromosomeData ) {
          var min = 0;
          var max = 0;
		  var chrMin = chromosomeData.features[0].seqName;
		  var chrMax = chromosomeData.features[0].seqName;
          chromosomeData.features.forEach( function( data ) {
            if ( data.start < min ) {
              min = data.start;
	      chrMin = data.seqName;
            }
            if (data.end > max ) {
              max = data.end;
			  chrMax = data.seqName;
            }
          } );
          // Set min and max of the chromosome
          chromosomeData.min = min;
		  chromosomeData.minSeq = chrMin;
          chromosomeData.max = max;
		  chromosomeData.maxSeq = chrMax;
        },

        /**
         * Read over the data and set the glyph for each of feature groupings 
         *
         */
        setGlyphs: function() {
          var thisC = this;
		  $.each(thisC.conf, function(key,value){
			var featureGlyph;
			var display;
			if(key === 'general'){
				thisC.conf[key].glyph ="chromosome";
				thisC.conf[key].shape = "chromosome";
		    } if (thisC.conf[key].glyph === undefined){
					thisC.conf[key].glyph = key ;
			} 
			
			if (thisC.conf[key].shape === undefined){ 
					thisC.conf[key].shape =  thisC.conf[key].glyph ;
			}

			if(thisC.conf[key].feature){
				var dataLoc = thisC.conf[key].feature.match( /(.*)\:(.*)/ );
				thisC.conf[key].dataFilter = dataLoc[1];
				thisC.conf[key].dataLoc = dataLoc[2];
			}	else {
				thisC.conf[key].dataLoc = key;
			}

		  });
        },

        /**
         * Set the y-scale factor for drawing on the canvas based on the actual 
         * canvas dimensions and the vertical padding.
         *
         * @return {Number} The y-scale zoom factor 
         */
        setZoom: function( chromosomeMin, chromosomeMax, yOff ) {
          if ( yOff ) {
            return ( $( '#cvit-canvas' ).height() - ( 2 * yOff ) ) / ( chromosomeMax - chromosomeMin );
          }
          return ( $( '#cvit-canvas' ).height() - 100 ) / ( chromosomeMax - chromosomeMin );
        }
      },

      /**
       * Read through the main configuration file and find the location of the
       * configuration file and data for the current URL's querry string.
       *
       * @return {{conf:String, defaultData:String}} 
       */
      getSettings: function( mainConf, dataset ) {
        var query = window.location.search;
        var data = query.match( /data=(\w+)/ );
	console.log("CViTjs: Requested Dataset: " + String(dataset));
	if(dataset){
          var settings = mainConf[ 'data.' + dataset ];
        } else if (!!data) {
          var settings = mainConf[ 'data.' + data[ 1 ] ];
        } else if ('general' in mainConf && 'data_default' in mainConf['general']) {
          var default_data = mainConf['general']['data_default'];
          var settings = mainConf[ 'data.' + default_data ];
        }
        if ( settings ) {
          return settings;
        } else {
          throw 'Data not found';
        }
      }
    };
  } );
