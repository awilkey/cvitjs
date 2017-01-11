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
        try {
          var target = centromere.seqName;
          var targetGroup = group.children[ target ];
          if ( targetGroup ) {
            if ( targetGroup.children[ glyphGroup.name ] == undefined ) {
              var g = new paper.Group();
              g.name = glyphGroup.name;
              var labelGroup = new paper.Group();
              labelGroup.name = glyphGroup.name + '-label';
              targetGroup.addChild( g );
              g.addChild( labelGroup );
            }
            console.log( glyphGroup.name );
            var featureGroup = targetGroup.children[ glyphGroup.name ];
            var featureWidth = view.centWidth;
            var yLoc = ( ( centromere.start ) * view.yScale ) + targetGroup.children[ 0 ].bounds.top;
            var chrCenter = targetGroup.children[ target ].position.x;
            var xLoc = ( chrCenter );
            var point = new paper.Point( xLoc, yLoc );
            var size = new paper.Size( featureWidth, ( centromere.end - centromere.start ) * view.yScale );
            var rectangle = new paper.Rectangle( point, size );
            var r = new paper.Path.Rectangle( rectangle );
            r.position.x = chrCenter;
            r.info = centromere.attribute;
            centromere.name = r.info.name ? r.info.name : '';
            r.thisColor = 'black';
            var fillColor = r.info.color ? r.info.color : view.config.color;
            r.fillColor = utility.formatColor( fillColor );
            r.onMouseDown = function( event ) {
              utility.attachPopover( r, position );
            };
            if ( parseInt( view.config.draw_label ) === 1 ) {
              point.y = r.position.y;
              var label = utility.generateLabel2( r, view, targetGroup.children[ 0 ] );
              featureGroup.children[ glyphGroup.name + '-label' ].addChild( label );
              label.bringToFront();
            }
            featureGroup.addChild( r );
            r.sendToBack();
          }
        } catch ( err ) {
          console.log( err );
        }
      }
    };
  } );