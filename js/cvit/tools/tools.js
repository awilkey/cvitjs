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


define( [ 'jquery', 'tools/zoom/zoom', 'cvit/menu/modals/exportmodal',
		  'cvit/menu/modals/uploadmodal','cvit/menu/modals/helpmodal','bootstrap' ],
  function( $, zoom, exportMod, uploadMod, helpMod ) {
    return {
      //** builds menu stack */
      addToolsControl: function( ) {
	   var menuButton = $( '<div id="tool-btn" class="btn-group">'+	
		  '<button type="button" class="btn btn-xs btn-default">'+
		  '<span class="glyphicon glyphicon-wrench"></span>'+
	//	  '<button type="button" class="btn btn-xs btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
		  '</button>');
  var toolSelect = $('<div id="tool-bar" class="btn-group btn-group-xs"'+
		 ' role="group" aria-label="tools"></div>');
  toolSelect.hide();
  var panTool =  $('<button type="button" class="btn  btn-default">'+
		  '<span class="glyphicon glyphicon-move"></span>'+
		  '</button>');
  var boxTool =$('<button type="button" class="btn btn-default">'+
		  '<span class="glyphicon glyphicon-zoom-in"></span>'+
		  '</button>');

   $(menuButton ).on( 'click', function( event ) {
		$(toolSelect).toggle();
   } ); 

   console.log(paper.tools);
   $(panTool).on( 'click', function( event ) {
    	paper.tools[0].activate();
   }); 

   $(boxTool ).on( 'click', function( event ) {
    	paper.tools[1].activate();
   } ); 

    
   $(toolSelect).append(panTool);
   $(toolSelect).append(boxTool);
   $('#zoom-ctrl').after(menuButton);
   $(menuButton).after(toolSelect);
   console.log(paper.tools);
      }
    };
  } );
