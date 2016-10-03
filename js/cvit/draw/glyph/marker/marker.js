/*
 * file: marker.js
 *
 * purpose: Glyph for drawing markers
 *   the chromosome.
 *
 * main methods:
 *  draw:   Draw the requested glyph.
 *  test:   SImple console test for glyph
 *
 */


define( [ 'jquery', 'glyph/utilities' ],
  function( $, utility ) {

    return {
      /** Simple console log to make sure glyph works */
      test: function() {
        console.log( "Test of marker glyph" );
      },

      /**
       * Draws the glyph of a given feature.
       *
       * @param {object} position - The position to draw.
       * @param {paper.group} group - Paper group that holds the backbones.
       * @param {object} view - object that contains configuration information.
       * @param {paper.group} glyphGroup - Paper group that will hold the positions.
       */

      draw: function( marker, group, view, glyphGroup ) {
        var target = marker.seqName;
        var targetGroup = group.children[ target ];
        if ( targetGroup ) {
          var yLoc = ( ( marker.start ) * view.yScale ) + targetGroup.children[ target ].bounds.y;
          var xLoc = ( view.xloc[ target ] + parseInt( view.config.offset ) );
          var point = new paper.Point( xLoc, yLoc );
          var size = new paper.Size( parseInt( view.config.width ), 3 );
          var rectangle = new paper.Rectangle( point, size );
          var r = new paper.Path.Rectangle( rectangle );
          if ( parseInt( view.config.enable_pileup ) === 1 ) {
            this.testCollision( r, glyphGroup, view.pileup );
          }
          marker.name = marker.attribute.name ? marker.attribute.name : '';
          r.info = marker.attribute;
          r.thisColor = 'black';
          r.fillColor = new paper.Color( view.config.color );
          r.onMouseDown = function( event ) {
            utility.attachPopover( r, marker );
          };
          if ( parseInt( view.config.draw_label ) === 1 ) {
			point.y = r.position.y;
            var label = utility.generateLabel( marker, view, point, xLoc );
            targetGroup.addChild( label );
            glyphGroup.addChild( label );
            label.bringToFront();
          }
          targetGroup.addChild( r );
          r.sendToBack();
          glyphGroup.addChild( r );
        }
      }
    };
  } );
