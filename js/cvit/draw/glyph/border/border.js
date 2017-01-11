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
       * @param {object} centromere - The border to draw.
       * @param {paper.group} group - Paper group that holds the backbones.
       * @param {object} view - object that contains configuration information.
       * @param {paper.group} glyphGroup - Paper group that will hold the border.
       */

      draw: function( border, group, view, glyphGroup ) {
        console.log( "drawing border" );
        var target = border.seqName;
        var targetGroup = group.children[ target ];
        var gName = glyphGroup.name
        if ( targetGroup ) {
          if ( targetGroup.children[ gName ] == undefined ) {
            var g = new paper.Group();
            g.name = gName;
            var labelGroup = new paper.Group();
            labelGroup.name = gName + '-label';
            targetGroup.addChild( g );
            g.addChild( labelGroup );
            console.log( view.config );
          }

          var featureGroup = targetGroup.children[ gName ];
          var featureWidth = targetGroup.children[ target ].bounds.width;
          var yLoc = ( ( border.start ) * view.yScale ) + targetGroup.children[ target ].bounds.top;
          var chrCenter = targetGroup.children[ target ].position.x;
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
          if ( parseInt( view.config.fill ) === 1 ) {
            var fillColor = r.info.color ? r.info.color : view.config.color;
            r.fillColor = utility.formatColor( fillColor );
          }
          console.log( targetGroup.children[ target ].strokeWidth );
          r.strokeWidth = targetGroup.children[ target ].strokeWidth;
          var strokeColor = r.info.color ? r.info.color : view.config.border_color;
          r.strokeColor = utility.formatColor( strokeColor );
          r.onMouseDown = function( event ) {
            utility.attachPopover( r, position );
          };
          if ( parseInt( view.config.draw_label ) === 1 ) {
            point.y = r.position.y;
            var label = utility.generateLabel( r, view, targetGroup.children[ target ] );
            featureGroup.children[ glyphGroup.name + '-label' ].addChild( label );
            label.bringToFront();
          }
          featureGroup.addChild( r );
          r.bringToFront();
        }
      }
    };
  } );