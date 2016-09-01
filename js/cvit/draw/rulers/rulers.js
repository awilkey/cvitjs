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
		draw: function(backbone, config, view){
		 console.log("BOOM");
		  var baseLayer = paper.project.activeLayer;
		  var rulerLayer = new paper.Layer();
		  var min = backbone.min;
		  var max = backbone.max;

     	  var yPos = view.yOffset+ parseInt(config.general.chrom_font_size );
          var xPos = 20;
  
          var startOffset = view.yScale;
  
          var point = new paper.Point( xPos, yPos);
  		console.log(paper.project);
		  var size = new paper.Point(0, (max + (0-min))*view.yScale);
          //var size = new paper.Size( 2, (backbone.max + (0-backbone.min)) * view.yScale );
          //var rectangle = new paper.Rectangle( point, size );
          var r = new paper.Path.Line( point, point.add(size) );
		  r.maxChr = backbone.maxSeq;
		  r.minSeq = backbone.minSeq;
          //r.fillColor = 'black';		  
		  r.name = "rulerRight";
		  r.strokeColor = config.general.ruler_color
	      r.strokeWidth = 2;
		  console.log(r);
          console.log(config);
		  //setup tics and draw first tic at minimum
		  var ticGroup = new paper.Group();
		  ticGroup.name = "rightTicks"
		  var textGroup = new paper.Group();
		  textGroup.name = "rightText"
		  
		  var ticW = parseInt(config.general.tick_line_width);
		  var ticO = new paper.Point(ticW,0);
		  var ticP = new paper.Point(xPos,yPos);
		  var tic = new paper.Path.Line(ticP, ticP.add(ticO));
		  tic.strokeColor = config.general.ruler_color; 
		  tic.strokeWidth= 2;
		  ticGroup.addChild(tic);
		  var label = new paper.PointText(ticP.x+ticO.x+1, ticP.y);
		  label.content = min;
		  label.fontSize = 10+'px';
		  textGroup.addChild(label);

		  var ticInt = parseInt(config.general.tick_interval);
		  console.log(ticInt);
		  var intDivision = Math.round(ticInt/parseInt(config.general.minor_tick_divisions));
		  console.log("TicLoop");
		  for(var i = intDivision; i < max; i= i+ intDivision){
				console.log(i + " : " + max);
		     	var mTicP = new paper.Point(xPos, yPos+(i*view.yScale));
		    	var mTic = new paper.Path.Line(mTicP, mTicP.add(ticO));
		  		mTic.strokeColor = config.general.ruler_color; 
		  		mTic.strokeWidth= 2;
				if(i%ticInt ==0){
		  		var label = new paper.PointText(mTicP.x+ticO.x+1, mTicP.y);
		  		label.content =i;
		  		label.fontSize = 10+'px';
				textGroup.addChild(label);
				}
				ticGroup.addChild(mTic);
		  }
			//ticGroup.addChild(textGroup);
		  baseLayer.activate();
		}
    };
});
