/*
 * file: centromere.js
 *
 * purpose: 	Glyph for drawing the centromere, a region with lenght placed over
 )		a target backbone.
 *
 * main methods:
 *	draw:   Draw the requested centromere
 *	test: 	Simple Console Log Test to make sure glyph is being accessed properly
 *
 */


define( [ 'jquery', 'glyph/utilities' ],
  function( $, utility ) {

    return {
      /** Simple console log to make sure glyph works*/
      test: function() {
        console.log( "Test of centromere glyph" );
      },

      /**
       * Draws the glyph of a given feature.
       *
       * @param {object} centromere - The centromere to draw.
       * @param {paper.group} group - Paper group that holds the backbomes.
       * @param {object} view - object that contains configuration information.
       * @param {paper.group} glyphGroup - Paper group that will hold the centromere.
       */

      draw: function( centromere, group, view, glyphGroup ) {
        var target = centromere.seqName;
        var targetGroup = group.children[ target ];
        if ( targetGroup ) {
          var xLoc = Math.floor( view.xloc[ target ] - ( view.centWidth / 2 ) );
          var yLoc = ( ( centromere.start ) * view.yScale ) + targetGroup.children[ target ].bounds.y;
          var point = new paper.Point( xLoc, yLoc );
          var size = new paper.Size( view.centWidth, ( centromere.end - centromere.start ) * view.yScale );
          var rectangle = new paper.Rectangle( point, size );
          var r = new paper.Path.Rectangle( rectangle );
          centromere.name = centromere.attribute.name ? centromere.attribute.name : '';
          r.info = centromere.attribute;
          r.thisColor = 'black';
          r.fillColor = utility.formatColor( view.config.color );

          if ( parseInt( view.config.draw_label ) === 1 ) {
            var label = utility.generateLabel( centromere, view, point, xLoc );
            targetGroup.addChild( label );
            glyphGroup.addChild( label );
            r.sendToBack();
          }

          targetGroup.addChild( r );
          glyphGroup.addChild( r );
        }
      }
    };
  } );
