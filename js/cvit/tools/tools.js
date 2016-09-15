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
	   var menuButton = $( '<div class="btn-group">'+	
		  '<button type="button" class="btn btn-default">Tool</button>'+
		  '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
		  '<span class="caret"></span>'+
		  '<span class="sr-only">Toggle Dropdown</span>'+
		  '</button>');
		$('#zoom-ctrl').after(menuButton);
      }
    };
  } );
