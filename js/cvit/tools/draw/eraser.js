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


define( [ 'jquery','bootstrap' ],
  function( $ ) {
    return {
      //** builds menu stack */
      addEraser: function( ) {
       var eraser = new paper.Tool();
	   var hitOptions = {
		 segments: true,
         stroke: true,
         fill: true,
         tolerance: 5
	   };
       eraser.onMouseDown = function(event){
		 var hitTest = paper.project.hitTest(event.point,hitOptions);
		 if(hitTest.item.isErasable){
		   hitTest.item.remove();
		 }
       };


      }
    };
  } );
