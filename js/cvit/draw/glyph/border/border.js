/*
 * file: border.js
 *
 * purpose: 	Glyph for drawing a border, a region with lenght placed over
 )		a target backbone.
 *
 * main methods:
 *	draw:   Draw the requested border
 *	test: 	Simple Console Log Test to make sure glyph is being accessed properly
 *
 */


define( [ 'jquery', 'glyph/utilities' ],
  function( $, utility ) {

    return {
      /** Simple console log to make sure glyph works*/
      test: function() {
        console.log( "Test of border glyph" );
      },

      /**
       * Draws the glyph of a given feature.
       *
       * @param {object} centromere - The centromere to draw.
       * @param {paper.group} group - Paper group that holds the backbomes.
       * @param {object} view - object that contains configuration information.
       * @param {paper.group} glyphGroup - Paper group that will hold the centromere.
       */

      draw: function( border, group, view, glyphGroup ) {
        console.log( "drawing border" );
        var target = border.seqName;
        var targetGroup = group.children[ target ];
        if ( targetGroup ) {
          if ( targetGroup.children[ glyphGroup.name ] == undefined ) {
            var g = new paper.Group();
            g.name = glyphGroup.name;
            var labelGroup = new paper.Group();
            labelGroup.name = glyphGroup.name + '-label';
            targetGroup.addChild( g );
            g.addChild( labelGroup );
            console.log( view.config );
            if ( parseInt( view.config.fill ) === 1 ) {
              var fill = new paper.Path.Rectangle(
                targetGroup.children[ 0 ].bounds.left,
                targetGroup.children[ 0 ].bounds.top,
                targetGroup.children[ 0 ].bounds.width,
                targetGroup.children[ 0 ].bounds.height );
              fill.fillColor = 'black';
              g.addChild( fill );
              fill.sendToBack();
            }
          }

          var featureGroup = targetGroup.children[ glyphGroup.name ];
          var featureWidth = targetGroup.children[ 0 ].bounds.width;
          var yLoc = ( ( border.start ) * view.yScale ) + targetGroup.children[ 0 ].bounds.top;
          var chrCenter = targetGroup.children[ 0 ].position.x;
          var xLoc = chrCenter;
          var fLen = view.yScale * ( border.end - border.start );
          console.log( fLen );
          var point = new paper.Point( xLoc, yLoc );
          var size = new paper.Size( featureWidth, fLen );
          var r = new paper.Path.Rectangle( point, size );
          r.position.x = xLoc;
          r.info = border.attribute;
          border.name = r.info.name ? r.info.name : '';
          r.thisColor = 'black';
          var fillColor = r.info.color ? r.info.color : view.config.color;
          r.fillColor = utility.formatColor( fillColor );

          console.log( targetGroup.children[ 0 ].strokeWidth );
          r.strokeWidth = targetGroup.children[ 0 ].strokeWidth;
          var strokeColor = r.info.color ? r.info.color : view.config.border_color;
          r.strokeColor = utility.formatColor( 'green' );
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
          r.bringToFront();
        }
      }
    };
  } );