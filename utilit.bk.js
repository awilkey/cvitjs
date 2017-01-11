/*
 * file: Utiities.js
 *
 * purpose: Helper functions for drawing glyphs.
 *
 * main methods:
 *  test:   simple "yes this is here" test
 *  formatColor:   take color string and format it for display
 *  attachPopover: Create the popover when the feature is selected
 *  testCollision: moves features to avoid collisions when "enable pileup" is on
 *  generateLabel: Create text labels on canvas
 *  generateViewControl: Populate view control list with properly labeled button
 *
 */


define( [ 'jquery', 'bootstrap' ],
  function( $ ) {

    return {
      /** 
	   *
	   * Simple console log test to make sure utility.js has been loaded from
	   * other module
	   *
	   */
      test: function() {
        console.log( "Utility Test" );
      },
      /* 
	   * Format color string to color
	   * 
	   * @param {string} color - The color to format for paperjs may take the
	   * format of:
	   * 	hex: #RRGGBB(AA)
	   * 	HTML Color name 
	   * 	gray%% is also parsed here to preserve backwards compatability with old perl cvit
	   *
	   * @return paperjs compatible color
	   */
      formatColor: function( color, transparency ) {
        var grey = color.match( /gr[ea]y(.*)/ );
        if ( grey ) {
          color = "grey";
          if ( grey[ 1 ].length !== 0 ) {
            color = parseFloat( '.' + grey[ 1 ] );
          }
        }
        if ( color[ 0 ] === '#' ) {
          return color;
        } else {
          return new paper.Color( color );
        }
      },
      /*
	   * Attach popover to feature
	   *
	   * @param r - The feature glyph to attach the popover to. 
	   * @param feature - The base feature the glyph was created from.
	   *
	   */
      attachPopover: function( r, feature ) {
        $( '.popover' ).remove();
        $( '#popdiv' ).remove();
        var clickDiv = $( '<div id="popdiv" style="position:absolute;">&nbsp;</div>' );
        $( clickDiv ).data( 'pos', r.bounds );
        $( clickDiv ).data( 'item', r );
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
            '<thead><tr><th>Name</th><th>' + feature.attribute.id + '</th></tr></thead>' +
            '<tbody><tr><td>Start</td><td>' + feature.start + '</td></tr>' +
            '<tr><td>End</td><td>' + feature.end + '</td></tr>' +
            '<tr><td>Strand</td><td>' + feature.strand + '</td></tr>' +
            '<tr><td>Score</td><td>' + feature.score + '</td></tr>' +
            '<tr><td>Type</td><td>' + feature.type + '</td></tr>' +
            '</tbody></table></div>',
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
      /*
	   * Collision detection between glyphs. Moves glyphs based on the feature's
	   * pileup_gap. If a glyph would cross the boundries of another backbone, 
	   * moves the effected backbone and those following it out of the way. 
	   *
	   * @param feature - the feature glyph being tested
	   * @param featureGroup - the group the feature glyph belongs to
	   * @param view - the view configuration information
	   *
	   */
      testCollision: function( feature, featureGroup, view ) {
        var pGap = view.pileup;
        // Set the expected number of hits for the given feature to avoid infinte loop
        var minGroup = typeof( feature.children ) != "undefined" ? feature.children.length : 1;
		console.log(minGroup);
        var getItem = function() {
          return paper.project.getItems( {
            overlapping: feature.strokeBounds,
            class: paper.Path
          } );
        };

		var groupOverlap = function(){
				return paper.project.getItems({
				overlapping: feature.strokeBounds,
				class: paper.Group,
				name: function(value){return value !=fPName;},
				_parent : function(value){return value.name === 'view'}
				});
		};
        var testItem = getItem();
		var overGroup = groupOverlap();
		var chrGroup = featureGroup.parent;
        var fPName = chrGroup.name;
        var baseGroup = chrGroup.parent;
        var layer = paper.project.layers[ 0 ];
        var length = baseGroup.children.length;
        var offset = feature.strokeBounds.width + pGap;
		var side = chrGroup.children[0].position.x < feature.position.x ? true:false;
        var index = baseGroup.children.indexOf( chrGroup );
		var moveBackbone = function(pileupOffset){
            if ( side ) {
		      var groupBounds = feature.strokeBounds.right - baseGroup.children[index+1].strokeBounds.left;
              for ( var i = index + 1; i < length; i++ ) {
                var group = baseGroup.children[ i ];
                group.position.x += pileupOffset+groupBounds;
                layer.children[ group.name + "Label" ].position.x += pileupOffset+groupBounds;
              }
            } else {
		      var groupBounds = baseGroup.children[index-1].strokeBounds.right - feature.strokeBounds.left;
              for ( var i = index - 1; i > -1; i-- ) {
                var group = baseGroup.children[ i ];
                group.position.x -= pileupOffset+groupBounds;
                layer.children[ group.name + "Label" ].position.x -= pileupOffset+groupBounds;
              }
            }
		};
        while ( testItem.length > minGroup ) {
		  if (side){
            feature.translate( new paper.Point( offset, 0 ) );
		  } else {
            feature.translate( new paper.Point( -offset, 0 ) );
		  }
          if ( overGroup.length > 0 ){
		       moveBackbone(pGap);
		  }
		  testItem = getItem();
		  overGroup = groupOverlap();  
		}
      },
	  /*
	   * Generates and places the text label for a feature labels are x offset
	   * based on backBone, not on the feature. y position is the center of the
	   * feature.
	   *
	   * @param feature - feature to draw the associated label with
	   * @param view - view configuration information
	   * @param backBone - backbone feature is associated with
	   *
	   */
      //** TODO: Find good solution for overlapping labels
      generateLabel2: function( feature, view, backBone ) {
        var labelOffset = parseInt( view.config.label_offset );
        var label = new paper.PointText( feature.position );
        label.content = feature.info.name !== undefined ? feature.info.name.trim() : '';
        var fill = typeof( view.config.label_color ) !== undefined ? view.config.label_color : 'black';
        label.fillColor = this.formatColor( fill );
        label.fontSize = parseInt( view.config.font_size );
		label.position.y = feature.position.y;
        if ( 1/labelOffset > 0 ) {
          label.position.x = backBone.strokeBounds.right + labelOffset + (label.strokeBounds.width/2);
        } else {
		  label.position.x = backBone.strokeBounds.left + labelOffset - (label.strokeBounds.width/2);
		}
        return label;
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
        label.content = feature.attribute.name !== undefined ? feature.attribute.name.trim() : '';
        var fill = typeof( view.config.label_color ) != 'undefined' ? view.config.label_color : 'black';
        label.fillColor = this.formatColor( fill );
        label.fontSize = parseInt( view.config.font_size );

        if ( labelOffset < 0 ) {
          label.position = new paper.Point( point.x - label.strokeBounds.width, point.y );
        }

        label.position.y = point.y;
        return label;
      },
	  /*
	   * Generates a toggle button to hide/show a given group from the drawing
	   *
	   * @param groupName - the name of the group to toggle.
	   * 
	   */
      //** Generate a toggle button to hide/show a given group in the view.
      generateViewControl: function( groupName, group ) {
		console.log(group);
		console.log(groupName);
		console.log(group.children);
		console.log(group.children[0]);
        var gName = groupName.replace( /\s+/g, '-' ).toLowerCase();
        var viewTitle = $( '<span>' + groupName + '</span>"' );
        var openButton = $( '<button type="button" class="btn btn-success view-toggle" style="float:right; margin-right:10px;">Show</button>' ).on( 'click', function( event ) {
          $( '#' + gName + '-options .btn-success' ).toggleClass( 'btn-danger' );
		console.log(group);
		console.log("thats what my baby said");
		console.log(group.children['chr2']);
		  for(var i = 0; i < group.children.length; i++){
		    var toggleGroup = group.children[i].children[groupName];
			if(toggleGroup !== undefined){
			  toggleGroup.visible = toggleGroup.visible ? false : true;
			}
			paper.view.draw();
		  }
		  
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