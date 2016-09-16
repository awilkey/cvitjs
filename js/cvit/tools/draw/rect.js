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
      addRectDraw: function( ) {
       var rectTool = new paper.Tool();
            rectTool.onMouseDown = function(event){
            rectTool.box = paper.Path.Rectangle(event.downPoint, event.point);
			rectTool.box.isErasable=true;
       };

       rectTool.onMouseDrag = function(event){
            document.body.style.cursor = 'crosshair';
            rectTool.box.remove();
            rectTool.box = paper.Path.Rectangle(event.downPoint, event.point);
            rectTool.box.strokeWidth = 2;
            rectTool.box.strokeColor = "black"
            rectTool.box.dashArray = [2,2];
			rectTool.box.isErasable=true;
            rectTool.box.fillColor = new paper.Color(0.8,0.3);
       };
	   rectTool.onMouseUp = function(event){
            document.body.style.cursor = 'default';
	   };
      }
    };
  } );
