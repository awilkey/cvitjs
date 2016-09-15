/*
 * file: zoom.js
 *
 * purpose: logic for zooming and panning the canvas
 *
 * main methods:
 *  enableZoom:   	Sets up the canvas to allow zoom controls 
 *  changeZoom:   	Change zoom at constant factor due to triggering event
 *  changePan:		Pan view based on delta
 *  compensateZoom:	Move popover in response to change in zoom or pan.
 *
 */

define( [ "jquery", 'mousewheel' ],
  function( $ ) {

    return {

      /**
	   *
       * Add zoom and pan controls to overlay over the
	   * cvit canvas 
       *
       */
      addZoomControl: function() {
		var zoomGroup = $( '<div id="zoom-ctrl" class="btn-group-vertical btn-group-xs" role="group" aria-label="Zoom controls">' );
        $( zoomGroup ).css( "top", "10px" );
        $( zoomGroup ).css( "left", "10px" );
        var zIn = $( '<button type="button" id="zoom-in-btn" class="btn btn-default z-ctrl" aria-label="Zoom in"></button>' );
        $( zIn ).append( '<span " class="glyphicon glyphicon-plus " aria-hidden="true"></span>' );
        var zOut = $( '<button id="zoom-out-btn" type="button" class="btn btn-default z-crtl" aria-label="Zoom out" disabled="true"></button>' );
        $( zOut ).append( '<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>' );
        var zReset = $( '<button type="button" class="btn btn-default aria-label="Reset zoom"></button>' );
        $( zReset ).append( '<span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>' );
		thisC.zoomRulers(2,1);
		thisC.zoomRulers(1,2);
        // setup click logic for zoom in/out/reset
        var originalCenter = paper.project.layers[0].position;
		var rulerCenter = paper.project.layers[1].position;
		paper.project.layers[0].oc = originalCenter;
		paper.project.layers[0].center = originalCenter;
		paper.project.layers[0].zoom = 1;
		paper.project.layers[1].zoom =1;
		paper.project.layers[1].layerOffset = paper.project.layers[0].position.y - paper.project.layers[1].position.y;	
        $( zIn ).on( 'click', function( event ) {
          event.preventDefault();
          var oldZoom = paper.project.activeLayer.zoom;
          var newZoom = thisC.changeZoom( oldZoom, 1, paper.view.center, paper.view.center );
		  console.log(newZoom[0]);
		  thisC.zoomRulers(newZoom[0], oldZoom);
          if ( $( '#popdiv' ).length ) {
           thisC.compensateZoom( newZoom[ 0 ] );
          }
		  paper.project.layers[0].center = paper.project.layers[0].position;
          paper.view.draw();
        } );

        $( zOut ).on( 'click', function( event ) {
          event.preventDefault();
		  var oldZoom = paper.project.layers[0].zoom;
          var newZoom = thisC.changeZoom( oldZoom, -1, paper.view.center, paper.view.center );
		  thisC.zoomRulers(newZoom[0],oldZoom);
          if ( $( '#popdiv' ).length ) {
           thisC.compensateZoom( newZoom[ 0 ] );
          }
	      paper.project.layers[0].center = paper.project.layers[0].position;
          paper.view.draw();
        } );

        $( zReset ).on( 'click', function( event ) {
          event.preventDefault();
		  var oldZoom = paper.project.layers[0].zoom;
		  if(paper.project.layers[0].zoom !== 1){
		    thisC.zoomRulers(1,oldZoom);
		  }
          paper.project.layers[0].position = originalCenter;
		  paper.project.layers[1].position = rulerCenter;
		  paper.project.layers[0].center = originalCenter;
          thisC.compensateZoom( 1 );
          paper.view.draw();
        } );

        $( zoomGroup ).append( zIn );
        $( zoomGroup ).append( zReset );
        $( zoomGroup ).append( zOut );

        $( '#overlay' ).append( zoomGroup );
      },

      /**
       * Setup mouse zoom and pan events
       *
       * @param {object} startView - The original positioning of the canvas.
       * @param {paper.group} group - Paper group that holds the backbomes.
       * @param {object} view - object that contains configuration information.
       * @param {paper.group} glyphGroup - Paper group that will hold the range.
       */
      enableZoom: function( startView ) {
        thisC = this;
        this.originalCenter = paper.project.layers[0].position;
        // Attach listener to mousewheel using jquery plugin to watch for scrollwheel zoom
        // delta means that zoom will center around the mouse pointer	
        $( "#cvit-canvas" ).mousewheel( function( event ) {
          var mousePos = new paper.Point( event.offsetX, event.offsetY );
          var viewPos = paper.project.layers[0].globalToLocal( mousePos );
		  var originalZoom = paper.project.layers[0].zoom;
          var newZoom = thisC.changeZoom( paper.project.layers[0].zoom, event.deltaY, paper.project.layers[0].position, viewPos );
          paper.project.layers[0].zoom = newZoom[ 0 ];
          // popdiv is the div that contains the popover that contains feature information
          // need to reposition it as the view changes, as it is an overlay, not part of canvas.
          if ( $( '#popdiv' ).length ) {
            thisC.compensateZoom( newZoom[ 0 ] );
          }
          event.preventDefault();
		  thisC.zoomRulers(newZoom[0],originalZoom);
		  paper.project.layers[0].center = paper.project.layers[0].center.subtract(newZoom[1]);
		  paper.project.layers[0].position = paper.project.layers[0].center;
		  console.log(paper.project.layers[0].center);
		  console.log(paper.project.layers[0].position);
          paper.view.draw();
        } );

       // //initialize paper tool on canvas to watch for "click and drag" style events for panning
       // var panTool = new paper.Tool();
       // panTool.onMouseDown = function( event ) {
	   //   document.body.style.cursor = 'move';
       //   panTool.path = new paper.Point();
       //   panTool.path.add( paper.project.layers[0].position );
       // };
	   // panTool.onMouseUp = function (event){
	   //   document.body.style.cursor = 'default';
	   // 	paper.project.layers[0].center = paper.project.layers[0].position;
	   // };
       // panTool.onMouseDrag = function( event ) {
       //   thisC.changePan( event.downPoint, event.point, startView );
       //   event.preventDefault();
       //   if ( $( '#popdiv' ).length ) {
       //     thisC.compensateZoom( paper.project.layers[0].zoom );
       //   }
       //   paper.view.draw();

       // };
	   
	   //initialize paper tool on canvas for box select.
	   var boxTool = new paper.Tool();
	   boxTool.onMouseDown = function(event){
			boxTool.drag = false;
			boxTool.box = paper.Path.Rectangle(event.downPoint, event.point);
	   };

	   boxTool.onMouseDrag = function(event){
		 	document.body.style.cursor = 'zoom-in';
			boxTool.box.remove();
			boxTool.box = paper.Path.Rectangle(event.downPoint, event.point);
		 	boxTool.box.strokeWidth = 1;
			boxTool.box.strokeColor = "lightblue"
			boxTool.box.dashArray = [2,2];
			boxTool.box.fillColor = new paper.Color(0.8,0.3);
			boxTool.drag=true;
	   };
	   
	   boxTool.onMouseUp = function(event){
         document.body.style.cursor = 'default';
		 if(boxTool.drag){
		   var viewSize = paper.project.view.size;
		   var boxSize = boxTool.box.handleBounds.size;
		   var xScale = viewSize.width/boxSize.width;
		   var yScale = viewSize.height/boxSize.height;
		   var newScale = xScale <= yScale ? xScale : yScale;
		   console.log(newScale);
		   if(newScale < 70){
		     if (newScale > 8){newScale = 8;};
		     thisC.zoomRulers(newScale, paper.project.layers[0].zoom);
             thisC.changePan( boxTool.box.position, paper.project.layers[0].position, startView);
	         paper.project.layers[0].center = paper.project.layers[0].position;
		   }
		 }
		 boxTool.box.remove();
	   }

      },

      /**
       * Calculate change in zoom level
       *
       * @param {float} current     - The current zoom level.
       * @param {float} delta       - Which direction the mousewheel scrolled.
       * @param {object} center     - Current centerpoint of the canvas.
       * @param {paper.group} mouse - Point of the mouse on the canvas, 
       * 			      allows for zoom centering on mouse point.
       *
       *@return {array} New zoom level and how far to offset the centerpoint to
       *                track the mouse pointer if scrollwheel used
       *
       */
      changeZoom: function( current, delta, center, mouse, newScale ) {
        var zoomLevel = current;
		if(newScale !== undefined){
			zoomLevel = newScale;
		}

        var factor = 1.05;
		if(!newScale){
          if ( delta < 0 ) {
            zoomLevel = current / factor;
          }
          if ( delta > 0 ) {
            zoomLevel = current * factor;
          }
          zoomLevel = zoomLevel < 1 ? 1 : zoomLevel < 8 ? zoomLevel : 8;
		}
        var scale = current / zoomLevel;
        var pos = mouse.subtract( center );
        var offset = mouse.subtract( pos.multiply( scale ) ).subtract( center );
        return [ zoomLevel, offset ];
      },

      /**nn
       * Move canvas to follow a click and drag event
       *
       * @param {object} downPoint - Where the mousedown event occured.
       * @param {object} point - Where the mouse event is currently located (drag location)
       * @param {object} startView - Original orientation of the canvas.
       */
      changePan: function( downPoint, point, startView ) {

        var deltaX = downPoint.x - point.x;
        var deltaY = downPoint.y - point.y;
        // Calculate boundries so the pan can't go past the limits of the cavas.	
        var xEdge = paper.view.bounds.x;
        var yEdge = paper.view.bounds.x;

        var xBound = xEdge + deltaX;
        var yBound = yEdge + deltaY;

		var layerC = paper.project.layers[0].position;	
        var xLimit = startView.width - paper.view.bounds.width;
        var yLimit = startView.height - paper.view.bounds.height;
        var delta = new paper.Point( -deltaX, -deltaY );
		paper.project.layers[0].position = paper.project.layers[0].center.add(delta);
		paper.project.layers[1].position.y -=(layerC.y - paper.project.layers[0].position.y);
      },

      /**
       * Move popover due to new zoom
       *
       * @param {Float} zoom - The current zoom level.
       */
      compensateZoom: function( zoom ) {
        var divData = $( '#popdiv' ).data( "pos" );
		var bounds = $('#popdiv').data("item").bounds;
        $( '#popdiv' ).show();
        $( '#popdiv' ).css( 'top', (divData.y + Math.round(bounds.y - divData.y)) );
        $( '#popdiv' ).css( 'left', (divData.x + Math.round(bounds.x - divData.x)) );
        $( '#popdiv' ).css( 'width', divData.width * zoom );
        $( '#popdiv' ).css( 'height', divData.height * zoom );
        $( '.popover' ).popover( 'show' );
        $( '#popdiv' ).hide();
      },
      zoomRulers: function(newZoom, oldZoom) {
          // enable/disable zoom controls
		if ( newZoom <= 1 ) {
          $( "#zoom-out-btn" ).prop( 'disabled', true );
          $( "#zoom-in-btn" ).prop( 'disabled', false );
        } else if ( 8 <= newZoom  ) {
          $( "#zoom-out-btn" ).prop( 'disabled', false );
          $( "#zoom-in-btn" ).prop( 'disabled', true );
        } else {
          $( "#zoom-out-btn" ).prop( 'disabled', false );
          $( "#zoom-in-btn" ).prop( 'disabled', false );
		}
		
		// Zoom ruler and drawing layer, layer[0] is drawing, [1] is ruler
		var backbone = paper.project.layers[0].children["backbone"].children["view"];
		var minLoc = paper.project.layers[1].children["rulers"].minSeq;
		var rulerLayer = paper.project.layers[1];
        paper.project.layers[0].scale(newZoom/oldZoom);
	    paper.project.layers[1].children["rulers"].scale(1,newZoom/oldZoom);
		paper.project.layers[1].children["tics"].scale(1,newZoom/oldZoom);
		paper.project.layers[1].children["text"].scale(1,newZoom/oldZoom);
		for(var text in  paper.project.layers[1].children["text"].children["rightText"].children){
		  paper.project.layers[1].children["text"].children["rightText"].children[text].scale(1,oldZoom/newZoom);
		  //paper.project.layers[1].children["text"].children["leftText"].children[text].scale(1,oldZoom/newZoom);
		};
		paper.view.draw();
		paper.project.activeLayer.zoom = newZoom;
		var ymove = backbone.children[minLoc].position.y;
		rulerLayer.children["rulers"].position.y = ymove;
		rulerLayer.children["tics"].position.y = ymove;
		rulerLayer.children["text"].position.y = ymove;
		console.log(rulerLayer);

      }
    };
  } );
