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
		  'tools/draw/color','bootstrap' ],
  function( $, zoom,rect, free, eraser, color ) {
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

  var colorSel=$('<button title="Line Color" type="button" class="btn color-sel btn-default" '+
				  'data-toggle="modal" data-target="#color1-select">'+
		  '<span> </span>'+
		  '</button>');
  var colorSel2 = $(colorSel).clone(true);
   $(colorSel).attr("id","color1");
   $(colorSel2).attr("id","color2");
   $(colorSel2).attr("data-target","#color2-select");
   $(colorSel2).attr("title","Fill Color");
   
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
   color.addColorSel("color1","Line");
   color.addColorSel("color2","Fill");
   console.log("COLOR HERE" + paper.project.color1.toCSS());
   $(colorSel).on('click', function(event){
	color.colorPicker('color1',colorSel);
   });
   $(colorSel2).on('click', function(event){
	color.colorPicker('color2',colorSel2);
   });

   console.log("booo");
   $(toolSelect).append(panTool);
   $(toolSelect).append(boxTool);
   $(toolSelect).append(rectTool);
   $(toolSelect).append(drawTool);
   $(toolSelect).append(eraserTool);
   $(toolSelect).append(colorSel);
   $(toolSelect).append(colorSel2);
   $('#zoom-ctrl').after(menuButton);
   $(menuButton).after(toolSelect);
   $('#color1').css("background",paper.project.color1.toCSS());
   $('#color2').css("background",paper.project.color2.toCSS());
      }
    };
  } );
