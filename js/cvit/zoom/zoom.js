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
        var zIn = $( '<button type="button" class="btn btn-default" aria-label="Zoom in"></button>' );
        $( zIn ).append( '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>' );
        var zOut = $( '<button type="button" class="btn btn-default" aria-label="Zoom out" disabled="true"></button>' );
        $( zOut ).append( '<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>' );
        var zReset = $( '<button type="button" class="btn btn-default aria-label="Reset zoom"></button>' );
        $( zReset ).append( '<span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>' );
		thisC.zoomRulers(2,1);
		thisC.zoomRulers(1,2);
        // setup click logic for zoom in/out/reset
        var originalCenter = paper.project.activeLayer.position;
		var rulerCenter = paper.project.layers[1].position;
		paper.project.activeLayer.oc = originalCenter;
		paper.project.activeLayer.center = originalCenter;
		paper.project.layers[0].zoom = 1;
		paper.project.layers[1].zoom =1;
		paper.project.layers[1].layerOffset = paper.project.layers[0].position.y - paper.project.layers[1].position.y;	
        $( zIn ).on( 'click', function( event ) {
          event.preventDefault();
          var oldZoom = paper.project.activeLayer.zoom;
          var newZoom = thisC.changeZoom( oldZoom, 1, paper.view.center, paper.view.center );
          if ( newZoom[ 0 ] === 8 ) {
            $( zIn ).prop( 'disabled', true );
          } else if ( newZoom[ 0 ] > 1 ) {
            $( zOut ).prop( 'disabled', false );
          }
		  thisC.zoomRulers(newZoom[0], oldZoom);
          if ( $( '#popdiv' ).length ) {
           thisC.compensateZoom( newZoom[ 0 ] );
          }
		  paper.project.activeLayer.center = paper.project.activeLayer.position;
          paper.view.draw();
        } );

        $( zOut ).on( 'click', function( event ) {
          event.preventDefault();
		  var oldZoom = paper.project.activeLayer.zoom;
          var newZoom = thisC.changeZoom( oldZoom, -1, paper.view.center, paper.view.center );
          if ( newZoom[ 0 ] === 1 ) {
            $( zOut ).prop( 'disabled', true );
          } else if ( newZoom[ 0 ] < 8 ) {
            $( zIn ).prop( 'disabled', false );
          }
		  thisC.zoomRulers(newZoom[0],oldZoom);
          if ( $( '#popdiv' ).length ) {
           thisC.compensateZoom( newZoom[ 0 ] );
          }
	      paper.project.activeLayer.center = paper.project.activeLayer.position;
          paper.view.draw();
        } );

        $( zReset ).on( 'click', function( event ) {
          event.preventDefault();
		  var oldZoom = paper.project.activeLayer.zoom;
		  if(paper.project.activeLayer.zoom !== 1){
		    thisC.zoomRulers(1,oldZoom);
		  }
          paper.project.layers[0].position = originalCenter;
		  paper.project.layers[1].position = rulerCenter;
		  paper.project.layers[0].center = originalCenter;
		  console.log("boom");
		  paper.view.draw();
          thisC.compensateZoom( 1 );
          $( zOut ).prop( 'disabled', true );
          $( zIn ).prop( 'disabled', false );
		  paper.project.activeLayer.center = originalCenter;
		  thisC.zoomRulers();
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
		console.log(paper.project.layers[0].position);
        // Attach listener to mousewheel using jquery plugin to watch for scrollwheel zoom
        // delta means that zoom will center around the mouse pointer	
        $( "#cvit-canvas" ).mousewheel( function( event ) {
          var mousePos = new paper.Point( event.offsetX, event.offsetY );
          var viewPos = paper.project.activeLayer.globalToLocal( mousePos );
		  var originalZoom = paper.project.activeLayer.zoom;
          var newZoom = thisC.changeZoom( paper.project.activeLayer.zoom, event.deltaY, paper.project.layers[0].position, viewPos );
          paper.project.activeLayer.zoom = newZoom[ 0 ];
		  //paper.project.activeLayer.position.y += (paper.project.activeLayer.center - mousePos.y);
		  //paper.project.activeLayer.center = paper.project.activeLayer.position;
          //if ( paper.view.bounds.x < 0 ) {
          //  paper.view.translate( new paper.Point( -paper.view.bounds.x, 0 ) );
          //}
          // popdiv is the div that contains the popover that contains feature information
          // need to reposition it as the view changes, as it is an overlay, not part of canvas.
        //  if ( $( '#popdiv' ).length ) {
        //    thisC.compensateZoom( newZoom[ 0 ] );
        //  }
          event.preventDefault();
		  thisC.zoomRulers(newZoom[0],originalZoom);
		  console.log(paper.project.activeLayer.center);
		  console.log(paper.project.activeLayer.position);
		  console.log(newZoom[1]);
		  paper.project.activeLayer.center = paper.project.activeLayer.center.subtract(newZoom[1]);
		  paper.project.activeLayer.position = paper.project.activeLayer.center;
		  console.log(paper.project.activeLayer.center);
		  console.log(paper.project.activeLayer.position);
		  console.log(newZoom[1]);
          paper.view.draw();
        } );

        //initialize paper tool on canvas to watch for "click and drag" style events for panning
        var tool = new paper.Tool();
        tool.onMouseDown = function( event ) {
          tool.path = new paper.Point();
          tool.path.add( paper.project.activeLayer.position );
        };
		tool.onMouseUp = function (event){
			paper.project.activeLayer.center = paper.project.activeLayer.position;
		};
        tool.onMouseDrag = function( event ) {
          thisC.changePan( event.downPoint, event.point, startView );
          event.preventDefault();
          if ( $( '#popdiv' ).length ) {
            thisC.compensateZoom( paper.project.activeLayer.zoom );
          }
          paper.view.draw();

        };

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
      changeZoom: function( current, delta, center, mouse ) {
        var zoomLevel = current;
        var factor = 1.05;
        if ( delta < 0 ) {
          zoomLevel = current / factor;
        }
        if ( delta > 0 ) {
          zoomLevel = current * factor;
        }
        zoomLevel = zoomLevel < 1 ? 1 : zoomLevel < 8 ? zoomLevel : 8;

        var scale = current / zoomLevel;
        var pos = mouse.subtract( center );
        var offset = mouse.subtract( pos.multiply( scale ) ).subtract( center );
        return [ zoomLevel, offset ];
      },

      /**
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

		var layerC = paper.project.activeLayer.position;	
        var xLimit = startView.width - paper.view.bounds.width;
        var yLimit = startView.height - paper.view.bounds.height;
        var delta = new paper.Point( -deltaX, -deltaY );
		paper.project.activeLayer.position = paper.project.activeLayer.center.add(delta);
		paper.project.layers[1].position.y -=(layerC.y - paper.project.activeLayer.position.y);
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
		var backbone = paper.project.layers[0].children["backbone"].children["view"];
		var minLoc = paper.project.layers[1].children["rulerRight"].minSeq;
		var rulerLayer = paper.project.layers[1];
        paper.project.activeLayer.scale(newZoom/oldZoom);
	    paper.project.layers[1].children["rulerRight"].scale(1,newZoom/oldZoom);
		paper.project.layers[1].children["rightTicks"].scale(1,newZoom/oldZoom);
		paper.project.layers[1].children["rightText"].scale(1,newZoom/oldZoom);
		for(var text in  paper.project.layers[1].children["rightText"].children){
		  paper.project.layers[1].children["rightText"].children[text].scale(1,oldZoom/newZoom);
		};
		paper.view.draw();
		paper.project.activeLayer.zoom = newZoom;
		var ymove = backbone.children[minLoc].position.y;
		rulerLayer.children["rulerRight"].position.y = ymove;
		rulerLayer.children["rightTicks"].position.y = ymove;
		rulerLayer.children["rightText"].position.y = ymove;
		console.log(rulerLayer);

      }
    };
  } );
