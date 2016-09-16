/*
 * file: tools.js
 *
 *
 * purpose: create dropdown menu to allow for tooltip selection.
 * 
 * main methods:
 *  build:  Builds the desired menus. TODO: make it so menu can be configured in conf file.
 *  addZoomControl: Add manual, non-mouse zoom control
 *  addOptonsMenu: Generate buttons for options
 *  addViewMenu: Generate div for view toggles
 *  makeModal: Generate a modal window for use with Option menu options
 *  populateExportModal: Decorate export modal contents and do image export
 *  populateUploadModal: Decorate upload modal contents and do (local) gff import
 *  populateHelpModal: Decorate help modal contents
 *
 */


define( [ 'jquery', 'tools/zoom/zoom', 'tools/draw/rect', 'tools/draw/free', 'tools/draw/eraser',
		  ,'bootstrap' ],
  function( $, zoom,rect, free, eraser ) {
    return {
      //** builds menu stack */
      addToolsControl: function( ) {
	   var menuButton = $( '<div title="Pointer Tools" id="tool-btn" class="btn-group">'+	
		  '<button type="button" class="btn btn-xs btn-default">'+
		  '<span class="glyphicon glyphicon-wrench"></span>'+
		  '</button>');
  var toolSelect = $('<div id="tool-bar" class="btn-group btn-group-xs"'+
		 ' role="group" aria-label="tools"></div>');
  toolSelect.hide();
  var panTool =  $('<button title="Pan" type="button" class="btn  btn-default">'+
		  '<span class="glyphicon glyphicon-move"></span>'+
		  '</button>');
  var boxTool =$('<button title="Box Zoom" type="button" class="btn btn-default">'+
		  '<span class="glyphicon glyphicon-zoom-in"></span>'+
		  '</button>');

  var rectTool=$('<button title="Draw Rectangle" type="button" class="btn btn-default">'+
		  '<span class="glyphicon glyphicon-edit"></span>'+
		  '</button>');

  var drawTool=$('<button title="Draw Rectangle" type="button" class="btn btn-default">'+
		  '<span class="glyphicon glyphicon-pencil"></span>'+
		  '</button>');

  var eraserTool=$('<button title="Erase Drawing" type="button" class="btn btn-default">'+
		  '<span class="glyphicon glyphicon-erase"></span>'+
		  '</button>');
   $(menuButton ).on( 'click', function( event ) {
		$(toolSelect).toggle();
   } ); 

   rect.addRectDraw();
   free.addFreeDraw();
   eraser.addEraser();

   console.log(paper.tools);
   $(panTool).on( 'click', function( event ) {
		this.focus();
    	paper.tools[0].activate();
   }); 

   $(boxTool ).on( 'click', function( event ) {
		this.focus();
    	paper.tools[1].activate();
   } ); 

   $(rectTool ).on( 'click', function( event ) {
    	this.focus();
    	paper.tools[2].activate();
   } ); 
    
   $(drawTool ).on( 'click', function( event ) {
    	this.focus();
    	paper.tools[3].activate();
   } ); 
   $(eraserTool ).on( 'click', function( event ) {
    	this.focus();
    	paper.tools[4].activate();
   } ); 
   console.log("booo");
   $(toolSelect).append(panTool);
   $(toolSelect).append(boxTool);
   $(toolSelect).append(rectTool);
   $(toolSelect).append(drawTool);
   $(toolSelect).append(eraserTool);
   $('#zoom-ctrl').after(menuButton);
   $(menuButton).after(toolSelect);
   console.log(paper.tools);
      }
    };
  } );
