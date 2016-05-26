/*
 * file: menus.js
 *
 * purpose: Add all the fiddly menus.
 *
 * main methods:
 *  build:  Builds the desired menus. TODO: make it so menu can be configured in conf file.
 *  addZoomControl: Add manual, non-mouse zoom control
 *  addOptonsMenu: Generate buttons for options
 *  addViewMenu: Generate div for view toggles
 *  makeModal: Generate a modal window for use with Option menu options
 *  populateExportModal: Decorate export modal contents and do image export
 *  populateUploadModal: Decorate upload modal contents and do (local) gff import
 *  populateHelpModal: Decorate help modal contents
 *
 */

define( [ 'jquery', 'cvit/zoom/zoom', 'cvit/file/file', 'draw/glyph/glyph', 'glyph/utilities', 'bootstrap' ],
  function( $, zoom, file, glyph, utility ) {
    return {
      //** builds menu stack */
      build: function( conf, view, group ) {
        var thisC = this;
        thisC.conf = conf;
        thisC.view = view;
        thisC.group = group;
        thisC.addZoomControl();
        thisC.addOptionsMenu();
        thisC.addViewMenu();
      },

      /**
       *
       * Adding a button panel for zooming in, out and resetting view
       *
       */
      addZoomControl: function() {
        var zoomGroup = $( '<div class="btn-group-vertical btn-group-xs" role="group" aria-label="Zoom controls">' );
        $( zoomGroup ).css( "top", "10px" );
        $( zoomGroup ).css( "left", "10px" );
        var zIn = $( '<button type="button" class="btn btn-default" aria-label="Zoom in"></button>' );
        $( zIn ).append( '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>' );
        var zOut = $( '<button type="button" class="btn btn-default" aria-label="Zoom out" disabled="true"></button>' );
        $( zOut ).append( '<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>' );
        var zReset = $( '<button type="button" class="btn btn-default aria-label="Reset zoom"></button>' );
        $( zReset ).append( '<span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>' );

        // setup click logic for zoom in/out/reset		
        var originalCenter = paper.view.center;
        $( zIn ).on( 'click', function( event ) {
          event.preventDefault();
          var oldZoom = paper.view.zoom;
          var newZoom = thisC.changeZoom( paper.view.zoom, 1, paper.view.center, paper.view.center );
          if ( newZoom[ 0 ] === 8 ) {
            $( zIn ).prop( 'disabled', true );
          } else if ( newZoom[ 0 ] > 1 ) {
            $( zOut ).prop( 'disabled', false );
          }
          paper.view.zoom = newZoom[ 0 ];
          if ( $( '#popdiv' ).length ) {
            zoom.compensateZoom( newZoom[ 0 ] );
          }
          paper.view.draw();
        } );

        $( zOut ).on( 'click', function( event ) {
          event.preventDefault();
          var newZoom = thisC.changeZoom( paper.view.zoom, -1, paper.view.center, paper.view.center );
          if ( newZoom[ 0 ] === 1 ) {
            $( zOut ).prop( 'disabled', true );
          } else if ( newZoom[ 0 ] < 8 ) {
            $( zIn ).prop( 'disabled', false );
          }

          paper.view.zoom = newZoom[ 0 ];
          paper.view.draw();
        } );

        $( zReset ).on( 'click', function( event ) {
          event.preventDefault();
          paper.view.zoom = 1;
          paper.view.center = originalCenter;
          zoom.compensateZoom( 1 );
          $( zOut ).prop( 'disabled', true );
          $( zIn ).prop( 'disabled', false );
          paper.view.draw();
        } );

        $( zoomGroup ).append( zIn );
        $( zoomGroup ).append( zReset );
        $( zoomGroup ).append( zOut );

        $( '#overlay' ).append( zoomGroup );
      },

      addOptionsMenu: function() {
        var thisc = this;
        var leftedge = paper.view.bounds.width;
        var menuButton = $( '<button type="button" id="menubutton" class="btn btn-default" data-toggle="collapse" data-target="#menu-group"></button>' );
        $( menuButton ).append( '<span class="glyphicon glyphicon-menu-hamburger" aria-label="menu" aria-hidden="true"></span>' );
        $( menuButton ).css( 'position', 'absolute' );

        // place options menu "hamburger" depending on if there is a title div
        var rightOffset = paper.view.bounds.width;
        if ( $( '#title-div' ).length ) {
          $( '#title-div' ).css( 'position', 'relative' );
          $( '#title-div' ).append( menuButton );
          $( menuButton ).css( 'top', '5%' );
        } else {
          $( '#overlay' ).append( menuButton );
          $( menuButton ).css( 'top', '10px' );
          rightOffset -= 10;
        }
        rightOffset -= parseInt( menuButton.css( 'width' ) );
        $( menuButton ).css( 'left', rightOffset + 'px' );

        var mg = $( '<div class="collapse" id="menu-group" >' );
        var menuGroup = $( '<div class="btn-group btn-group-justified">' );
        $( menuGroup ).css( 'width', paper.view.bounds.width );

        var mExport = $( '<div class="btn-group"><button type="button" class="btn btn-default"' +
          ' id="btn-export" data-toggle="modal" data-target = "#export-modal">' +
          '<span class="glyphicon glyphicon-picture" aria-hidden="true"/> Export View to Image</button></div>'
        );
        var mUpload = $( '<div class="btn-group"><button type="button" class="btn btn-default"' +
          ' id="btn-upload" data-toggle="modal" data-target="#upload-modal">' +
          '<span class="glyphicon glyphicon-open" aria-hidden="true"/>Add My Data</button></div>'
        );
        var mHelp = $( '<div class="btn-group"><button type="button" class="btn btn-default"' +
          ' id="btn-help" data-toggle="modal" data-target="#help-modal">? Help</button></div>'
        );

        $( mExport ).on( 'click', function( event ) {
          var exportModal = thisc.makeModal( 'export-modal' );
          $( '#cvit-div' ).append( exportModal );
          thisc.populateExportModal();
        } );

        $( mUpload ).on( 'click', function( event ) {
          var uploadModal = thisc.makeModal( 'upload-modal' );
          $( '#cvit-div' ).append( uploadModal );
          thisc.populateUploadModal( thisc );
        } );

        $( mHelp ).on( 'click', function( event ) {
          var helpModal = thisc.makeModal( 'help-modal' );
          $( '#cvit-div' ).append( helpModal );
          thisc.populateHelpModal();
        } );

        $( menuGroup ).append( mExport );
        $( menuGroup ).append( mUpload );
        $( menuGroup ).append( mHelp );

        $( mg ).append( menuGroup );
        $( '#cvit-div' ).prepend( mg );
      },

      //** builds menu to manipulate view */
      addViewMenu: function() {
        var thisc = this;
        var viewGroup = $( '<div class="btn-group btn-group-justified" role="group">' );
        var menuButton = $( '<div class="btn-group">' +
          '<button type="button" id="viewButton" class="btn btn-default"' +
          ' data-toggle="collapse" data-target="#view-group">' +
          '<span id="bob" class="glyphicon glyphicon-menu-down" aria-hidden="true"/>' +
          ' View Options <span class="glyphicon glyphicon-menu-down" aria-hidden="true"/> </button></div>' );
        $( menuButton ).on( 'click', function( event ) {
          if ( $( '.glyphicon-menu-down' ).length ) {
            $( '.glyphicon-menu-down' ).toggleClass( 'glyphicon-menu-down glyphicon-menu-up' );
          } else {
            $( '.glyphicon-menu-up' ).toggleClass( 'glyphicon-menu-down glyphicon-menu-up' );
          }
        } );
        $( viewGroup ).css( 'width', paper.view.bounds.width );
        $( viewGroup ).append( menuButton );
        $( '#cvit-div' ).append( viewGroup );

        var vg = $( '<div class="collapse" id="view-group" ><div class="scrollable-menu" role="menu" style="height:auto; max-height:216px; overflow-y:scroll;">' +
          '<hr /><ul id="view-list" style="list-style: none;"></ul></div></div>' );
        $( vg ).css( 'width', paper.view.bounds.width );
        $( '#cvit-div' ).append( vg );
      },

      //** Generic modal window, to be decorated later */
      makeModal: function( id ) {
        return $( '<div id="' + id + '" class="modal fade" role="dialog"><div class="modal-dialog">' +
          '<div class="modal-content"><div class="modal-header"><button type="button" class="close"' +
          ' data-dismiss="modal">&times;</button><h4 class="modal-title"></h4></div>' +
          '<div class="modal-body"></div><div class="modal-footer"><button type="button"' +
          ' class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>'
        );

      },

      //** Decoration and logic for Export option */
      populateExportModal: function() {

        $( '#export-modal .modal-title' ).text( "Export View to Image" );
        $( '#export-modal .modal-body' ).html( '<p class="lead">Save your current view as an image.</p>' +
          '<h4>Export As</h4><div class="container"><div class="row">' +
          '<form role="form" class="form-inline"><div class="form-group">' +
          '<label for="format-select" style="padding-right:1em;">Select format:</label>' +
          '<select class="form-control" id="format-select"><option>png</option>' +
          '<option>svg</option></select></div><div class="btn-group" style="padding-left:1em;">' +
          '<button type="button" class="btn btn-primary" id="export-button">Export</button></div></form></div></div>'
        );
        $( '#export-modal .form-control' ).css( 'width', 'auto' );

        $( '#export-button' ).on( 'click', function( event ) {
          var dl = document.createElement( 'a' );
          // Paper logic to export as svg
          if ( $( '#format-select' ).val() === 'svg' ) {
            dl.setAttribute( 'href', "data:image/svg+xml;utf8," + encodeURIComponent( paper.project.exportSVG( {
              asString: true
            } ) ) );
            dl.setAttribute( 'download', 'cvit.svg' );
            $( document.body ).append( dl );
            dl.click();
            $( dl ).remove();
          }
          // HTML5 logic to export as png
          if ( $( '#format-select' ).val() === 'png' ) {
            var image = $( '#cvit-canvas' )[ 0 ].toDataURL( 'image/png' );
            dl.setAttribute( 'href', image );
            dl.setAttribute( 'download', 'cvit.png' );
            $( document.body ).append( dl );
            dl.click();
            $( dl ).remove();
          }
        } );
      },

      //** Decoration and logic for Upload option */
      populateUploadModal: function( thisc ) {
        $( '#upload-modal .modal-title' ).text( "Upload Your Data" );
        // Need to test if local file upload is supported by browser.
        // Will essentially only return false if using IE<8
        if ( window.File && window.FileReader && window.FileList && window.Blob ) {
          var fileTypes = [ 'gff', 'gff3' ];
          $( '#upload-modal .modal-body' ).html( '<div><input type="file" id="files" name="files[]" multiple /><output id="list"></output></div>' );
          $( '#files' ).on( 'change', function( event ) {
            var files = event.target.files;
            var output = [];
            for ( var key in files ) {
              var f = files[ key ];
              var extension = f.name.split( '.' ).pop().toLowerCase();
              if ( fileTypes.indexOf( extension ) < 0 ) {
                continue;
              }

              output.push( '<li><strong>', escape( f.name ), '</strong> - ',
                f.size, ' bytes, last modified: ',
                f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                '</li>' );
              var fileReader = new FileReader();
              // TODO: Support customizing glyph options.
              $( fileReader ).on( 'load', function( event ) {
                var fileContents = event.target;
                var newFeatures = file.parse.gff( event.target.result );
                for ( var fkey in newFeatures ) {
                  thisc.view.viewName = "Uploaded";
                  var rangeGet = glyph.drawGlyph( newFeatures[ fkey ], 'range:range', thisc.conf, thisc.view, thisc.group ).then( function() {
                    paper.view.draw();
                  } );
                }
              } );
              fileReader.readAsText( f );
            }

            $( '#list' ).html( '<ul>' + output.join( '' ) + '</ul>' );

          } );

        } else {
          $( '#upload-modal .modal-body' ).text( 'Uploading a local file is not currently supported in this browser. See help for supported browser list.' );
        }

      },
      //** Populate help popup  TODO:Populate with better information and provide for a tour*/
      populateHelpModal: function() {

        $( '#help-modal .modal-title' ).text( "About CViTjs" );
        $( '#help-modal .modal-body' ).html( '<p class="lead">Information and tour.</p>' +
          '<h4>Export As</h4><div class="container"><div class="row">' +
          '<form role="form" class="form-inline"><div class="form-group">' +
          '<label for="format-select" style="padding-right:1em;">Select format:</label>' +
          '<select class="form-control" id="format-select"><option>png</option>' +
          '<option>svg</option></select></div><div class="btn-group" style="padding-left:1em;">' +
          '<button type="button" class="btn btn-primary" id="export-button">Export</button></div></form></div></div>'
        );
        $( '.form-control' ).css( 'width', 'auto' );
      },
      setFeatures: function( conf, view, group ) {
        this.conf = conf;
        this.view = view;
        this.group = group;
      }
    };
  } );