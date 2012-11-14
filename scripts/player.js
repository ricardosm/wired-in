var player = ( function(){

	var player = {

		tracklist: [],

		current: 0,

		playing: false,

		init: function(){

			this.loadTracks()
			return this
		},

		loadTracks: function(){

			$('#tracklist a').each( function( index, element ){

				var music = 'music/01/wiredin_01_' + $(this).attr( 'data-music' )
				$(this).attr( 'data-index', index )

				player.tracklist[ index ] = $('<audio></audio>').appendTo('body')
					.attr( 'preload', index != 0 ? 'none' : 'auto' )
					.css( 'display', 'none' )
					.append( '<source src="'+ music +'.mp3" type="audio/mpeg" />' )
					.append( '<source src="'+ music +'.m4a" type="audio/mp4a-latm" />' )
					.append( '<source src="'+ music +'.ogg" type="audio/ogg" />' )
					.get( 0 )

				player.tracklist[ index ].addEventListener( 'ended', function(){
					player.next()
				})

				player.tracklist[ index ].addEventListener( 'progress', function(){

					if( this.buffered.length > 0 ){

						var percent = this.buffered.end( this.buffered.length-1 ) / this.duration * 100
						// console.log( 'progress: ' + percent )
						if( percent > 95 )
							player.preloadNext()
					}
				})
			})
		},

		preloadNext: function(){

			var index;

			if( this.current == this.tracklist.length - 1 )
				index = this.current = 0
			else
				index = this.current + 1

			if( this.tracklist[ index ].preload != 'auto' ){

				this.tracklist[ index ].preload = 'auto'
				console.log( 'preloading ' + index )
			}
		},

		prev: function(){

			if( this.current == 0 )
				this.play( this.tracklist.length - 1 )
			else
				this.play( this.current - 1 )
		},

		next: function(){

			if( this.current == this.tracklist.length - 1 )
				this.play( 0 )
			else
				this.play( this.current + 1 )
		},

		play: function( index ){

			if( this.tracklist.length > 0 ){

				if( index == null ){

					$('#tracklist a').removeClass( 'playing' ).removeClass( 'paused' )
					$('#tracklist a[data-index='+this.current+']').removeClass( 'paused' ).addClass( 'playing' )
					$('#toggle-play').removeClass( 'play' ).addClass( 'pause' )
					$('#prev, #next').removeClass( 'hidden' )
					this.tracklist[ this.current ].play()
					this.playing = true
					console.log('play')

				} else {

					index = parseInt( index )

					if( index >= 0 && index < this.tracklist.length ){

						if( index == this.current ){

							if( this.playing )
								this.pause()
							else
								this.play()

						} else {

							this.stop()
							this.current = index
							console.log('go to '+ index)
							this.play()
						}
					}
				}
			}
		},

		stop: function(){

			if( this.playing ){

				this.tracklist[ this.current ].pause()

				if( this.tracklist[ this.current ].currentTime != 0 )
					this.tracklist[ this.current ].currentTime = 0

				console.log('stop')
			}
		},

		pause: function(){

			this.tracklist[ this.current ].pause()
			$('#tracklist a[data-index='+this.current+']').removeClass( 'playing' ).addClass( 'paused' )
			$('#toggle-play').removeClass( 'pause' ).addClass( 'play' )
			$('#prev, #next').addClass( 'hidden' )
			this.playing = false
			console.log('pause')
		}
	}

	return player.init()
})()