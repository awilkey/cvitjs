/*
 * file: range.js
 *
 * purpose: Glyph for drawing ranges, a feature with length placed beside
 *   the chromosome.
 *
 * main methods:
 *  draw:   Draw the requested range
 *  test:   Simple console test to make sure glyph is being accessed properly
 *
 */


define( [ 'jquery', 'glyph/utilities' ],
  function( $, utility ) {

    return {
      /** Simple console log to make sure glyph works */
      test: function() {
        console.log( "Test of range glyph" );
      },

      /**
       * Draws the glyph of a given feature.
       *
       * @param {object} range - The range to draw.
       * @param {paper.group} group - Paper group that holds the backbomes.
       * @param {object} view - object that contains configuration information.
       * @param {paper.group} glyphGroup - Paper group that will hold the range.
       */

      draw: function( range, group, view, glyphGroup ) {
        var target = range.seqName;
        var targetGroup = group.children[ target ];
        if ( targetGroup ) {
          var yLoc = ( ( range.start - view.xMin ) * view.yScale ) + targetGroup.children[ target ].bounds.y;
          var xLoc = ( view.xloc[ target ] + parseInt( view.config.offset ) );
          var point = new paper.Point( xLoc, yLoc );
          var size = new paper.Size( parseInt( view.config.width ), ( range.end - range.start ) * view.zoom );
          var rectangle = new paper.Rectangle( point, size );
          var r = new paper.Path.Rectangle( rectangle );
          if ( parseInt( view.config.enable_pileup ) === 1 ) {
            utility.testCollision( r, glyphGroup, view.pileup );
          }
          range.name = range.attribute.name ? range.attribute.name : '';
          r.info = range.attribute;
          r.thisColor = 'black';
          r.fillColor = new paper.Color( view.config.color );
          r.onMouseDown = function( event ) {
            utility.attachPopover( r, range );
          };

          if ( parseInt( view.config.draw_label ) === 1 ) {

            var label = utility.generateLabel( range, view, point, xLoc );
            targetGroup.addChild( label );
            glyphGroup.addChild( label );
          }
          targetGroup.addChild( r );
          glyphGroup.addChild( r );

        }
      }
    };
  } );