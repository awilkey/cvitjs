/*
 * file: rulers.js
 *
 * purpose: Gatekeeper for glyph subclasses.
 *
 * main methods:
 *	drawGlyph :		Require then the requested glyph.
 *	prepareGlyph :		Do common calculations for glyphs
 *	placeGlyph :	 	Call the subglyph logic to draw the glyph
 *	setXLoc :		Sets up xposition based on current backbone
 *.
 */


define( [ 'require', 'jquery', 'glyph/utilities' ],
  function( require, $, utility ) {

    return {
		draw: function(min,max,config,view){
		  var baseLayer = paper.project.activeLayer;
		  var rulerLayer = new paper.Layer();
		  console.log(view);
		  console.log(config.general.chrom_font_size);
     	   var yPos = view.yOffset+ parseInt(config.general.chrom_font_size );
          var xPos = 20;
  
          var startOffset = view.yScale;
  
          var point = new paper.Point( xPos, yPos);
  
          var size = new paper.Size( 10, (max) * view.yScale );
          var rectangle = new paper.Rectangle( point, size );
          var r = new paper.Path.Rectangle( rectangle );
          r.fillColor = 'black';		  
		  r.name = "rulerRight";
		  r.strokeWidth =2;
		  r.strokeColor = "black" 
		  baseLayer.activate();
		}
    };
});
