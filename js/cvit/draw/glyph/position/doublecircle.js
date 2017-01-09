/*
 * file: doublecircle.js
 *
 * purpose: Sub-glyph for drawing positions as a circle, 
 *          a feature with length placed beside the chromosome
 *	    with user-defined size.
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
        console.log( "Test of position class" );
      },

      /**
       * Draws the glyph of a given feature.
       *
       * @param {object} position - The position to draw.
       * @param {paper.group} group - Paper group that holds the backbones.
       * @param {object} view - object that contains configuration information.
       * @param {paper.group} glyphGroup - Paper group that will hold the positions.
       */

      draw: function( position, group, view, glyphGroup ) {
        var target = position.seqName;
        var targetGroup = group.children[ target ];
        if ( targetGroup ) {
          if ( targetGroup.children[ glyphGroup.name ] == undefined ) {
            var g = new paper.Group();
            g.name = glyphGroup.name;
            targetGroup.addChild( g );
          }
          var featureGroup = targetGroup.children[ glyphGroup.name ];
          var featureWidth = parseInt(view.config.width);
		  var radius = featureWidth/2; 
          var yLoc = ( ( position.start ) * view.yScale ) + targetGroup.children[ target ].bounds.y;
          var xOffset = parseInt(view.config.offset);
          var chrEdge = 1/xOffset > 0 ? targetGroup.children[target].strokeBounds.right : targetGroup.children[target].strokeBounds.left - featureWidth; 
          var xLoc = ( chrEdge + xOffset ); 
          var point = new paper.Point( xLoc, yLoc );
          var r = new paper.CompoundPath( {
            children: [
              new paper.Path.Circle( {
                center: new paper.Point( xLoc + ( radius / 2 ), yLoc + radius / 2 ),
                radius: radius / 2
              } ),
              new paper.Path.Circle( {
                center: new paper.Point( xLoc + ( radius + radius / 2 ), yLoc + radius / 2 ),
                radius: radius / 2
              } )
            ]
          } );

          if ( parseInt( view.config.enable_pileup ) === 1 ) {
            utility.testCollision( r, featureGroup, view );
          }
          position.name = position.attribute.name ? position.attribute.name : '';
          r.info = position.attribute;
		  console.log("Twerkit");
          var fillColor = position.attribute.color ? position.attribute.color : view.config.color;
          r.fillColor = utility.formatColor( fillColor );
		  console.log("Twerkit real good");
          r.onMouseDown = function( event ) {
            utility.attachPopover( r, position );
          };
          if ( parseInt( view.config.draw_label ) === 1 ) {
            point.y = r.position.y;
            var label = utility.generateLabel( position, view, point, xLoc );
            targetGroup.addChild( label );
            glyphGroup.addChild( label );
            label.bringToFront();
          }
          featureGroup.addChild( r );
          r.sendToBack();
        }
      }
    };
  } );
