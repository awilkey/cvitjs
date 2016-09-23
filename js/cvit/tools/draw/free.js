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
      addFreeDraw: function( ) {
       var freeTool = new paper.Tool();
	   if(!paper.project.color1){
           paper.project.color1 = new paper.Color(0,0,0,1);
		}
	   freeTool.onMouseDown = function(event){
		    var path = new paper.Path()
			path.segments = [event.point];
			path.isErasable = true;
			path.strokeColor = paper.project.color1;
            freeTool.path = path;
       };

       freeTool.onMouseDrag = function(event){
		  freeTool.path.add(event.point);
       };

	   freeTool.onMouseUp= function(event){
		 freeTool.path.simplify(10);
	   }

      }
    };
  } );
