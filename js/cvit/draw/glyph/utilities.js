/*
 * file: Utiities.js
 *
 * purpose: Helper functions for drawing glyphs.
 *
 * main methods:
 *  test:   simple "yes this is here" test
 *  attachPopover: Create the popover when the feature is selected
 *  testCollision: moves features to avoid collisions when "enable pileup" is on
 *  generateLabel: Create text labels on canvas
 *  generateViewControl: Populate view control list with properly labeled button
 *
 */


define( [ 'jquery', 'bootstrap' ],
  function( $ ) {

    return {
      /** Simple log test */
      test: function() {
        window.alert( "Utility Test" );
      },
	  formatColor: function(color,transparency){
		var grey = color.match(/gr[ea]y(.*)/);
		if(grey){
			console.log(grey);
			color = "grey";
			if(grey[1].length !== 0){
				console.log(grey[1]);
				color = parseFloat('.'+grey[1]);
			}
		}
		
		return  new paper.Color(color);
	  },
      /** Attach popover to feature */
      attachPopover: function( r, feature ) {
        $( '.popover' ).remove();
        $( '#popdiv' ).remove();
        var clickDiv = $( '<div id="popdiv" style="position:absolute;">&nbsp;</div>' );
        $( clickDiv ).data( 'pos', r.bounds );
		$(clickDiv).data('item',r);
        $( clickDiv ).css( "top", ( r.bounds.y - paper.view.center._owner.y ) * paper.view.zoom );
        $( clickDiv ).css( "left", ( r.bounds.x - paper.view.center._owner.x ) * paper.view.zoom );
        $( clickDiv ).css( "height", r.bounds.height * paper.view.zoom );
        $( clickDiv ).css( "width", r.bounds.width * paper.view.zoom );
        $( clickDiv ).css( "color", "blue" );
        $( '#overlay' ).append( clickDiv );
        // This is so large because anything *not* included in inital creation of popover tends to get left
        // behind when moving the view around otherwise. A well documented quirk of bootstrap
        $( clickDiv ).popover( {
          'html': 'true',
          'container': '#cvit-div',
          'title': 'About this feature: <button type="button" class="close" ><span class="close-span">&times;</span></button>',
          'id': 'pop',
          'placement': 'auto right',
          'content': '<div class="container"><h4>Feature Information</h4><table class="table table-bordered" style="width:auto;">' +
            '<thead><tr><th>Name</th><th>' + feature.attribute.name + '</th></tr></thead>' +
            '<tbody><tr><td>Start</td><td>' + feature.start + '</td></tr>' +
            '<tr><td>End</td><td>' + feature.end + '</td></tr>' +
            '<tr><td>&c</td><td>&c</td></tr></tbody></table></div>',
          'toggle': 'manual'
        } ).popover( 'show' ).on( 'show.bs.popover', function() {
          var close = $( '<button type="button" class="close"><span class="close-span">&times;</span></button>' );
          $( '.popover-title' ).append( close );
          $( close ).click( function( event ) {
            $( '.popover' ).remove();
          } );
        } );

        $( '.popover' ).on( 'click', function() {
          $( this ).popover( 'hide' );
        } );
        $( '#popdiv' ).hide();
        $( '.close' ).click( function( event ) {
          $( '.popover' ).remove();
        } );
      },
      /** Collision detection. pGap can be negative to move left, positive to move right */
      testCollision: function( feature, featureGroup, pGap ) {
        // Set the expected number of hits for the given feature to avoid infinte loop
        var minGroup = typeof( feature.children ) != "undefined" ? feature.children.length : 1;
        while ( paper.project.getItems( {
            overlapping: feature.strokeBounds,
            class: paper.Path
          } ).length > minGroup ) {
          feature.translate( new paper.Point( feature.strokeBounds.width + pGap, 0 ) );
        }

      },
      //** TODO: Make better, currently is a mess with overlapping labels
      generateLabel: function( feature, view, point, xOffset ) {
        var labelOffset = parseInt( view.config.label_offset );

        if ( labelOffset < 0 ) {
          point.x = xOffset - ( view.centWidth / 2 ) - labelOffset;
        } else {
          point.x = xOffset + ( view.centWidth / 2 ) + labelOffset;
        }

        var test = xOffset + view.centWidth / 2 + labelOffset;
        var label = new paper.PointText( point );
        label.content = feature.attribute.name !== undefined ? feature.attribute.name : '';
        var fill = typeof( view.config.label_color ) != 'undefined' ? view.config.label_color : 'black';
        label.fillColor = this.formatColor( fill );
        label.fontSize = parseInt( view.config.font_size );

        if ( labelOffset < 0 ) {
          label.position = new paper.Point( point.x - label.strokeBounds.width, point.y );
        }

		label.position.y = point.y;
        return label;
      },
      //** Generate a toggle button to hide/show a given group in the view.
      generateViewControl: function( groupName, group ) {
		var gName = groupName.replace(/\s+/g,'-').toLowerCase();
        var viewTitle = $( '<span>' + groupName + '</span>"' );
        var openButton = $( '<button type="button" class="btn btn-success view-toggle" style="float:right; margin-right:10px;">Show</button>' ).on( 'click', function( event ) {
          $( '#' + gName + '-options .btn-success' ).toggleClass( 'btn-danger' );
          group.visible = group.visible ? false : true;
          paper.view.draw();
        } );

        var viewLi = $( '<li></li>' );
        var viewDiv = $( '<div id="' + gName + '-options"></div>' );
        viewDiv.append( viewTitle );
        viewDiv.append( openButton );
        viewLi.append( viewDiv );
        viewLi.append( '<hr />' );
        $( '#view-list' ).append( viewLi );
      }
    };
  } );
