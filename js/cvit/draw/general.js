/*
 * file: general.js
 *
 * purpose: Sets up canvas when drawing backbone, because it is a special snowflake.
 *
 * main methods:
 *	drawGlyph :	Configure all the fiddly canvas options in GENERAL then draw backbone
 *
 */


define( [ 'require', 'jquery' ],
  function( require, $ ) {

    return {
      /**
       * Uses the jQuery promise system to try to draw a glyph based on the
       * glyph/subglyph of the chosen data object. This does so by requiring the requested
       * glyph type on demand, which, while asynchronus in nature, minimizes the page load time
       * by only requesting/loading the files for the glyphs actually used.
       *
       * @param data [Object] Feature to draw
       * @param track [String] a string of the format {glyph}:{subglyph}.
       * @param config [Object] Configuration object meeting the cvitconfig.json schema
       * @param backbone [paperGroup] A paper group that contains the chromosome backbone of the cvit drawing (optional)
       *
       * @return [promise] A jQuery promise, so that the glyphs can be drawn in an ansync form. 
       */
      drawGlyph: function( data, track, config, view, backbone ) {

        // Set and draw border
        var background = new paper.Path.Rectangle( {
          point: [ 0, 0 ],
          size: [ paper.view.size.width, paper.view.size.height ],
          strokeColor: 'white',
          selected: true
        } );
        background.fillColor = 'white';

        if ( config.general.border_width > 0 ) {
          background.strokeColor = new paper.Color( config.general.border_color );
          background.strokeWidth = config.general.border_width;
        }

        // Set and place title
        if ( config.general.title ) {
          // console.log( "Setting title" );
          var cvitTitle = config.general.title;
          var titleLoc;
          var titleSize = parseInt( config.general.title_font_size );
          var titleX = parseInt( config.general.image_padding ) + parseInt( config.general.border_width );
          //console.log( titleX );
          var titleY = titleX + titleSize;
          //console.log( titleSize + " " + titleX + "," + titleY );
          if ( config.general.title_location ) {
            //console.log( "setting loc " + config.general.title_location );
            var titlePos = config.general.title_location.match( /\((.*)\,(.*)\)/ );
            titleX += parseInt( titlePos[ 1 ] );
            titleY += parseInt( titlePos[ 2 ] );
          }

          titleLoc = new paper.Point( titleX, titleY );
          var title = new paper.PointText( titleLoc );
          title.content = cvitTitle;
          title.fontSize = titleSize;
          //console.log( 'tc: ' + config.general.title_color );
          title.fillColor = new paper.Color( config.general.title_color );
          title.name = 'cvitTitle';
        }



        var deferred = new $.Deferred();
        var glyph = track.match( /(.*)\:(.*)/ );
        var myGlyph = 'glyph/' + glyph[ 1 ] + '/' + glyph[ 2 ];
        var moo = require( [ myGlyph ], function( myGlyph ) {
          deferred.resolve( myGlyph.draw( data, config, view ) );
          background.sendToBack();
        } );

        return deferred.promise();
      }
    };
  } );